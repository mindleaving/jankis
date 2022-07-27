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
using HealthModels.Procedures;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models.Subscriptions;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HealthRecordViewModel = JanKIS.API.ViewModels.HealthRecordViewModel;
using ISubscriptionsStore = JanKIS.API.Storage.ISubscriptionsStore;

namespace JanKIS.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly IPersonDataStore<Person> personsStore;
        private readonly IAdmissionsStore admissionsStore;
        private readonly IPersonDataReadonlyStore<PatientNote> patientNotesStore;
        private readonly IPersonDataReadonlyStore<DiagnosticTestResult> testResultsStore;
        private readonly IPersonDataReadonlyStore<MedicalProcedure> medicalProceduresStore;
        private readonly IPersonDataReadonlyStore<Observation> observationsStore;
        private readonly IPersonDataReadonlyStore<PatientDocument> documentsStore;
        private readonly IReadonlyStore<BedOccupancy> bedOccupanciesStore;
        private readonly ISubscriptionsStore subscriptionsStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IPersonDataReadonlyStore<MedicationSchedule> medicationSchedulesStore;
        private readonly IPersonDataReadonlyStore<MedicationDispension> medicationDispensionsStore;
        private readonly IPersonDataReadonlyStore<Immunization> immunizationsStore;
        private readonly IPersonDataReadonlyStore<AttachedEquipment> patientEquipmentStore;
        private readonly IViewModelBuilder<AttachedEquipment> attachedEquipmentViewModelBuilder;
        private readonly IPersonDataReadonlyStore<Diagnosis> diagnosesStore;
        private readonly IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder;
        private readonly IPersonDataReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore;
        private readonly IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder;
        private readonly IAuthorizationModule authorizationModule;

        public PatientsController(
            IPersonDataStore<Person> personsStore,
            IAdmissionsStore admissionsStore,
            IPersonDataReadonlyStore<PatientNote> patientNotesStore,
            IPersonDataReadonlyStore<DiagnosticTestResult> testResultsStore,
            IPersonDataReadonlyStore<MedicalProcedure> medicalProceduresStore,
            IPersonDataReadonlyStore<Observation> observationsStore,
            IPersonDataReadonlyStore<PatientDocument> documentsStore,
            IReadonlyStore<BedOccupancy> bedOccupanciesStore,
            ISubscriptionsStore subscriptionsStore,
            IHttpContextAccessor httpContextAccessor,
            IPersonDataReadonlyStore<MedicationSchedule> medicationSchedulesStore,
            IPersonDataReadonlyStore<MedicationDispension> medicationDispensionsStore,
            IPersonDataReadonlyStore<Immunization> immunizationsStore,
            IPersonDataReadonlyStore<AttachedEquipment> patientEquipmentStore,
            IViewModelBuilder<AttachedEquipment> attachedEquipmentViewModelBuilder,
            IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder,
            IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder,
            IPersonDataReadonlyStore<Diagnosis> diagnosesStore,
            IPersonDataReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore,
            IAuthorizationModule authorizationModule)
        {
            this.personsStore = personsStore;
            this.admissionsStore = admissionsStore;
            this.patientNotesStore = patientNotesStore;
            this.testResultsStore = testResultsStore;
            this.medicalProceduresStore = medicalProceduresStore;
            this.observationsStore = observationsStore;
            this.documentsStore = documentsStore;
            this.bedOccupanciesStore = bedOccupanciesStore;
            this.subscriptionsStore = subscriptionsStore;
            this.httpContextAccessor = httpContextAccessor;
            this.medicationSchedulesStore = medicationSchedulesStore;
            this.medicationDispensionsStore = medicationDispensionsStore;
            this.immunizationsStore = immunizationsStore;
            this.patientEquipmentStore = patientEquipmentStore;
            this.attachedEquipmentViewModelBuilder = attachedEquipmentViewModelBuilder;
            this.diagnosisViewModelBuilder = diagnosisViewModelBuilder;
            this.questionnaireAnswersViewModelBuilder = questionnaireAnswersViewModelBuilder;
            this.diagnosesStore = diagnosesStore;
            this.questionnaireAnswersStore = questionnaireAnswersStore;
            this.authorizationModule = authorizationModule;
        }

        [HttpGet("/api/viewmodels/healthdata/{personId}")]
        public async Task<IActionResult> OverviewViewModel([FromRoute] string personId, [FromQuery] Language language = Language.en)
        {
            var accessGrants = await GetAccessGrantsForPerson(personId);
            var profileData = await personsStore.GetByIdAsync(personId, accessGrants);
            if (profileData == null)
                return NotFound();
            var now = DateTime.UtcNow;
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var currentBedOccupancy = bedOccupanciesStore.FirstOrDefaultAsync(x => x.Patient.Id == personId && x.StartTime <= now && (x.EndTime == null || x.EndTime > now));
            var admissions = admissionsStore.GetAllAsync(personId, accessGrants);
            var notes = patientNotesStore.GetAllAsync(personId, accessGrants);
            var diagnoses = diagnosesStore.GetAllAsync(personId, accessGrants)
                .ContinueWith(result => diagnosisViewModelBuilder.BatchBuild(result.Result, new DiagnosisViewModelBuilderOptions { Language = language }))
                .Unwrap();
            var medicationSchedules = medicationSchedulesStore.GetAllAsync(personId, accessGrants);
            var medicationDispensions = medicationDispensionsStore.GetAllAsync(personId, accessGrants);
            var immunizations = immunizationsStore.GetAllAsync(personId, accessGrants);
            var testResults = testResultsStore.GetAllAsync(personId, accessGrants);
            var medicalProcedures = medicalProceduresStore.GetAllAsync(personId, accessGrants);
            var observations = observationsStore.GetAllAsync(personId, accessGrants);
            var documents = documentsStore.GetAllAsync(personId, accessGrants);
            var questionnaireAnswers = questionnaireAnswersStore.GetAllAsync(personId, accessGrants)
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
                medicalProcedures,
                observations,
                documents,
                questionnaireAnswers,
                subscription);

            var viewModel = new HealthRecordViewModel(
                profileData,
                currentBedOccupancy.Result,
                admissions.Result,
                notes.Result.OrderByDescending(x => x.Timestamp).ToList(),
                diagnoses.Result.Cast<DiagnosisViewModel>().ToList(),
                medicationSchedules.Result,
                medicationDispensions.Result.OrderByDescending(x => x.Timestamp).ToList(),
                immunizations.Result.OrderByDescending(x => x.Timestamp).ToList(),
                testResults.Result.OrderByDescending(x => x.Timestamp).ToList(),
                medicalProcedures.Result.OrderByDescending(x => x.Timestamp).ToList(),
                observations.Result.OrderByDescending(x => x.Timestamp).ToList(),
                documents.Result.OrderByDescending(x => x.Timestamp).ToList(),
                questionnaireAnswers.Result.Cast<QuestionnaireAnswersViewModel>().ToList(),
                subscription.Result);
            return Ok(viewModel);
        }

        [HttpGet("{personId}/" + nameof(NursingViewModel))]
        public async Task<IActionResult> NursingViewModel([FromRoute] string personId)
        {
            var accessGrants = await GetAccessGrantsForPerson(personId);
            var profileData = await personsStore.GetByIdAsync(personId, accessGrants);
            if (profileData == null)
                return NotFound();
            var currentAdmission = await admissionsStore.GetCurrentAdmissionAsync(personId, accessGrants);
            var equipments = await patientEquipmentStore.GetAllAsync(personId, accessGrants);
            var equipmentViewModels = new List<AttachedEquipmentViewModel>();
            foreach (var equipment in equipments)
            {
                var equipmentViewModel = await attachedEquipmentViewModelBuilder.Build(equipment);
                equipmentViewModels.Add((AttachedEquipmentViewModel) equipmentViewModel);
            }

            var threeDaysAgo = DateTime.Today.AddDays(-3);
            var observations = await observationsStore.SearchAsync(personId, x => x.Timestamp > threeDaysAgo, accessGrants);
            var viewModel = new PatientNursingViewModel(
                profileData,
                currentAdmission,
                equipmentViewModels,
                observations);
            return Ok(viewModel);
        }

        [HttpPost("{personId}/subscribe")]
        public async Task<IActionResult> SubscribeToPatient([FromRoute] string personId)
        {
            var accessGrants = await GetAccessGrantsForPerson(personId);
            var patient = await personsStore.GetByIdAsync(personId, accessGrants);
            if (patient == null)
                return NotFound();
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
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
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var existingSubscription = await subscriptionsStore.GetPatientSubscription(personId, username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }

        private async Task<List<IPersonDataAccessGrant>> GetAccessGrantsForPerson(string personId)
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            var accessGrant = await authorizationModule.GetAccessGrantForPerson(personId, claims);
            return new List<IPersonDataAccessGrant> { accessGrant };
        }
    }
}
