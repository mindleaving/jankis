using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.DiagnosticTestResults;
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
            IViewModelBuilder<AttachedEquipment> attachedEquipmentViewModelBuilder)
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
        }

        [HttpGet("{patientId}/" + nameof(OverviewViewModel))]
        public async Task<IActionResult> OverviewViewModel([FromRoute] string patientId)
        {
            var profileData = await personsStore.GetByIdAsync(patientId);
            if (profileData == null)
                return NotFound();
            var now = DateTime.UtcNow;
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var currentBedOccupancy = (await bedOccupanciesStore.SearchAsync(x => x.Patient.Id == patientId && x.StartTime <= now && (x.EndTime == null || x.EndTime > now))).FirstOrDefault();
            var admissions = await admissionsStore.SearchAsync(x => x.PatientId == patientId);
            var notes = await patientNotesStore.SearchAsync(x => x.PatientId == patientId);
            var medicationSchedules = await medicationSchedulesStore.GetForPatient(patientId);
            var medicationDispensions = await medicationDispensionsStore.SearchAsync(x => x.PatientId == patientId);
            var testResults = await testResultsStore.SearchAsync(x => x.PatientId == patientId);
            var observations = await observationsStore.SearchAsync(x => x.PatientId == patientId);
            var documents = await documentsStore.SearchAsync(x => x.PatientId == patientId);
            var subscription = await subscriptionsStore.GetPatientSubscription(patientId, username);
            var viewModel = new PatientOverviewViewModel(
                profileData,
                currentBedOccupancy,
                admissions,
                notes.OrderByDescending(x => x.Timestamp).ToList(),
                medicationSchedules,
                medicationDispensions.OrderByDescending(x => x.Timestamp).ToList(),
                testResults.OrderByDescending(x => x.Timestamp).ToList(),
                observations.OrderByDescending(x => x.Timestamp).ToList(),
                documents.OrderByDescending(x => x.Timestamp).ToList(),
                subscription);
            return Ok(viewModel);
        }

        [HttpGet("{patientId}/" + nameof(NursingViewModel))]
        public async Task<IActionResult> NursingViewModel([FromRoute] string patientId)
        {
            var profileData = await personsStore.GetByIdAsync(patientId);
            if (profileData == null)
                return NotFound();
            var currentAdmission = await admissionsStore.GetCurrentAdmissionAsync(patientId);
            var equipments = await patientEquipmentStore.SearchAsync(x => x.PatientId == patientId);
            var equipmentViewModels = new List<AttachedEquipmentViewModel>();
            foreach (var equipment in equipments)
            {
                var equipmentViewModel = await attachedEquipmentViewModelBuilder.Build(equipment);
                equipmentViewModels.Add((AttachedEquipmentViewModel) equipmentViewModel);
            }

            var threeDaysAgo = DateTime.Today.AddDays(-3);
            var observations = await observationsStore.SearchAsync(x => x.PatientId == patientId && x.Timestamp > threeDaysAgo);
            var viewModel = new PatientNursingViewModel(
                profileData,
                currentAdmission,
                equipmentViewModels,
                observations);
            return Ok(viewModel);
        }


        [HttpGet("{patientId}/admissions")]
        public async Task<IActionResult> GetAdmissions([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var notes = await admissionsStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(notes);
        }

        [HttpGet("{patientId}/notes")]
        public async Task<IActionResult> GetPatientNotes([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var notes = await patientNotesStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(notes);
        }

        [HttpGet("{patientId}/observations")]
        public async Task<IActionResult> GetObservations([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var observations = await observationsStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(observations);
        }

        [HttpGet("{patientId}/testresults")]
        public async Task<IActionResult> GetTestResults([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var testResults = await testResultsStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(testResults);
        }

        [HttpGet("{patientId}/documents")]
        public async Task<IActionResult> GetDocuments([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var documents = await documentsStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(documents);
        }

        [HttpGet("{patientId}/equipment")]
        public async Task<IActionResult> GetAttachedEquipment([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var equipments = await patientEquipmentStore.SearchAsync(x => x.PatientId == patientId);
            var equipmentViewModels = new List<AttachedEquipmentViewModel>();
            foreach (var equipment in equipments)
            {
                var equipmentViewModel = await attachedEquipmentViewModelBuilder.Build(equipment);
                equipmentViewModels.Add((AttachedEquipmentViewModel) equipmentViewModel);
            }
            return Ok(equipmentViewModels);
        }

        [HttpPost("{patientId}/subscribe")]
        public async Task<IActionResult> SubscribeToPatient([FromRoute] string patientId)
        {
            var patient = await personsStore.GetByIdAsync(patientId);
            if (patient == null)
                return NotFound();
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var subscription = new PatientSubscription(
                Guid.NewGuid().ToString(),
                username,
                patientId,
                true);
            await subscriptionsStore.StoreAsync(subscription);
            return Ok(subscription.Id);
        }

        [HttpPost("{patientId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromRoute] string patientId)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var existingSubscription = await subscriptionsStore.GetPatientSubscription(patientId, username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }



    }
}
