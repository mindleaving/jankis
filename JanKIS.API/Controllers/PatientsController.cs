using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Diagnoses;
using HealthModels.DiagnosticTestResults;
using HealthModels.Interview;
using HealthModels.Medication;
using HealthModels.Observations;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;
using JanKIS.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly IStore<Person> personsStore;
        private readonly IAdmissionsStore admissionsStore;
        private readonly IReadonlyStore<PatientNote> patientNotesStore;
        private readonly IReadonlyStore<DiagnosticTestResult> testResultsStore;
        private readonly IReadonlyStore<Observation> observationsStore;
        private readonly IReadonlyStore<PatientDocument> documentsStore;
        private readonly IReadonlyStore<BedOccupancy> bedOccupanciesStore;
        private readonly ISubscriptionsStore subscriptionsStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMedicationScheduleStore medicationSchedulesStore;
        private readonly IReadonlyStore<MedicationDispension> medicationDispensionsStore;
        private readonly IReadonlyStore<AttachedEquipment> patientEquipmentStore;
        private readonly IViewModelBuilder<AttachedEquipment> attachedEquipmentViewModelBuilder;
        private readonly IReadonlyStore<Diagnosis> diagnosesStore;
        private readonly IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder;
        private readonly IReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore;
        private readonly IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder;

        public PatientsController(
            IStore<Person> personsStore,
            IAdmissionsStore admissionsStore,
            IReadonlyStore<PatientNote> patientNotesStore,
            IReadonlyStore<DiagnosticTestResult> testResultsStore,
            IReadonlyStore<Observation> observationsStore,
            IReadonlyStore<PatientDocument> documentsStore,
            IReadonlyStore<BedOccupancy> bedOccupanciesStore,
            ISubscriptionsStore subscriptionsStore,
            IHttpContextAccessor httpContextAccessor,
            IMedicationScheduleStore medicationSchedulesStore,
            IReadonlyStore<MedicationDispension> medicationDispensionsStore,
            IReadonlyStore<AttachedEquipment> patientEquipmentStore,
            IViewModelBuilder<AttachedEquipment> attachedEquipmentViewModelBuilder,
            IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder,
            IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder,
            IReadonlyStore<Diagnosis> diagnosesStore,
            IReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore)
        {
            this.personsStore = personsStore;
            this.admissionsStore = admissionsStore;
            this.patientNotesStore = patientNotesStore;
            this.testResultsStore = testResultsStore;
            this.observationsStore = observationsStore;
            this.documentsStore = documentsStore;
            this.bedOccupanciesStore = bedOccupanciesStore;
            this.subscriptionsStore = subscriptionsStore;
            this.httpContextAccessor = httpContextAccessor;
            this.medicationSchedulesStore = medicationSchedulesStore;
            this.medicationDispensionsStore = medicationDispensionsStore;
            this.patientEquipmentStore = patientEquipmentStore;
            this.attachedEquipmentViewModelBuilder = attachedEquipmentViewModelBuilder;
            this.diagnosisViewModelBuilder = diagnosisViewModelBuilder;
            this.questionnaireAnswersViewModelBuilder = questionnaireAnswersViewModelBuilder;
            this.diagnosesStore = diagnosesStore;
            this.questionnaireAnswersStore = questionnaireAnswersStore;
        }

        [HttpGet("/api/viewmodels/healthdata/{personId}")]
        public async Task<IActionResult> OverviewViewModel([FromRoute] string personId, [FromQuery] Language language = Language.en)
        {
            var profileData = await personsStore.GetByIdAsync(personId);
            if (profileData == null)
                return NotFound();
            var now = DateTime.UtcNow;
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var currentBedOccupancy = bedOccupanciesStore.FirstOrDefaultAsync(x => x.Patient.Id == personId && x.StartTime <= now && (x.EndTime == null || x.EndTime > now));
            var admissions = admissionsStore.SearchAsync(x => x.ProfileData.Id == personId);
            var notes = patientNotesStore.SearchAsync(x => x.PersonId == personId);
            var diagnoses = diagnosesStore.SearchAsync(x => x.PersonId == personId)
                .ContinueWith(result => diagnosisViewModelBuilder.BatchBuild(result.Result, new DiagnosisViewModelBuilderOptions { Language = language }))
                .Unwrap();
            var medicationSchedules = medicationSchedulesStore.GetForPatient(personId);
            var medicationDispensions = medicationDispensionsStore.SearchAsync(x => x.PersonId == personId);
            var testResults = testResultsStore.SearchAsync(x => x.PersonId == personId);
            var observations = observationsStore.SearchAsync(x => x.PersonId == personId);
            var documents = documentsStore.SearchAsync(x => x.PersonId == personId);
            var questionnaireAnswers = questionnaireAnswersStore.SearchAsync(x => x.PersonId == personId)
                .ContinueWith(result => questionnaireAnswersViewModelBuilder.BatchBuild(result.Result))
                .Unwrap();
            var subscription = subscriptionsStore.GetPatientSubscription(personId, username);

            await Task.WhenAll(
                currentBedOccupancy,
                admissions,
                notes,
                diagnoses,
                medicationSchedules,
                medicationDispensions,
                testResults,
                observations,
                documents,
                questionnaireAnswers,
                subscription);

            var viewModel = new PatientOverviewViewModel(
                profileData,
                currentBedOccupancy.Result,
                admissions.Result,
                notes.Result.OrderByDescending(x => x.Timestamp).ToList(),
                diagnoses.Result.Cast<DiagnosisViewModel>().ToList(),
                medicationSchedules.Result,
                medicationDispensions.Result.OrderByDescending(x => x.Timestamp).ToList(),
                testResults.Result.OrderByDescending(x => x.Timestamp).ToList(),
                observations.Result.OrderByDescending(x => x.Timestamp).ToList(),
                documents.Result.OrderByDescending(x => x.Timestamp).ToList(),
                questionnaireAnswers.Result.Cast<QuestionnaireAnswersViewModel>().ToList(),
                subscription.Result);
            return Ok(viewModel);
        }

        [HttpGet("{personId}/" + nameof(NursingViewModel))]
        public async Task<IActionResult> NursingViewModel([FromRoute] string personId)
        {
            var profileData = await personsStore.GetByIdAsync(personId);
            if (profileData == null)
                return NotFound();
            var currentAdmission = await admissionsStore.GetCurrentAdmissionAsync(personId);
            var equipments = await patientEquipmentStore.SearchAsync(x => x.PersonId == personId);
            var equipmentViewModels = new List<AttachedEquipmentViewModel>();
            foreach (var equipment in equipments)
            {
                var equipmentViewModel = await attachedEquipmentViewModelBuilder.Build(equipment);
                equipmentViewModels.Add((AttachedEquipmentViewModel) equipmentViewModel);
            }

            var threeDaysAgo = DateTime.Today.AddDays(-3);
            var observations = await observationsStore.SearchAsync(x => x.PersonId == personId && x.Timestamp > threeDaysAgo);
            var viewModel = new PatientNursingViewModel(
                profileData,
                currentAdmission,
                equipmentViewModels,
                observations);
            return Ok(viewModel);
        }


        [HttpGet("{personId}/admissions")]
        public async Task<IActionResult> GetAdmissions([FromRoute] string personId)
        {
            if (!await personsStore.ExistsAsync(personId))
                return NotFound();
            var notes = await admissionsStore.SearchAsync(x => x.ProfileData.Id == personId);
            return Ok(notes);
        }

        [HttpGet("{personId}/notes")]
        public async Task<IActionResult> GetPatientNotes([FromRoute] string personId)
        {
            if (!await personsStore.ExistsAsync(personId))
                return NotFound();
            var notes = await patientNotesStore.SearchAsync(x => x.PersonId == personId);
            return Ok(notes);
        }

        [HttpGet("{personId}/observations")]
        public async Task<IActionResult> GetObservations([FromRoute] string personId)
        {
            if (!await personsStore.ExistsAsync(personId))
                return NotFound();
            var observations = await observationsStore.SearchAsync(x => x.PersonId == personId);
            return Ok(observations);
        }

        [HttpGet("{personId}/testresults")]
        public async Task<IActionResult> GetTestResults([FromRoute] string personId)
        {
            if (!await personsStore.ExistsAsync(personId))
                return NotFound();
            var testResults = await testResultsStore.SearchAsync(x => x.PersonId == personId);
            return Ok(testResults);
        }

        [HttpGet("{personId}/documents")]
        public async Task<IActionResult> GetDocuments([FromRoute] string personId)
        {
            if (!await personsStore.ExistsAsync(personId))
                return NotFound();
            var documents = await documentsStore.SearchAsync(x => x.PersonId == personId);
            return Ok(documents);
        }

        [HttpGet("{personId}/equipment")]
        public async Task<IActionResult> GetAttachedEquipment([FromRoute] string personId)
        {
            if (!await personsStore.ExistsAsync(personId))
                return NotFound();
            var equipments = await patientEquipmentStore.SearchAsync(x => x.PersonId == personId);
            var equipmentViewModels = new List<AttachedEquipmentViewModel>();
            foreach (var equipment in equipments)
            {
                var equipmentViewModel = await attachedEquipmentViewModelBuilder.Build(equipment);
                equipmentViewModels.Add((AttachedEquipmentViewModel) equipmentViewModel);
            }
            return Ok(equipmentViewModels);
        }

        [HttpPost("{personId}/subscribe")]
        public async Task<IActionResult> SubscribeToPatient([FromRoute] string personId)
        {
            var patient = await personsStore.GetByIdAsync(personId);
            if (patient == null)
                return NotFound();
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var subscription = new PatientSubscription(
                Guid.NewGuid().ToString(),
                username,
                personId,
                true);
            await subscriptionsStore.StoreAsync(subscription);
            return Ok(subscription.Id);
        }

        [HttpPost("{personId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromRoute] string personId)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var existingSubscription = await subscriptionsStore.GetPatientSubscription(personId, username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }



    }
}
