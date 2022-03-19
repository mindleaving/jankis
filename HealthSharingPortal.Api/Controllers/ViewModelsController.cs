using System;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthModels.DiagnosticTestResults;
using HealthModels.Medication;
using HealthModels.Observations;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ViewModelsController : ControllerBase
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IReadonlyStore<Person> personStore;
        private readonly IReadonlyStore<Admission> admissionsStore;
        private readonly IReadonlyStore<PatientNote> patientNotesStore;
        private readonly IMedicationScheduleStore medicationSchedulesStore;
        private readonly IReadonlyStore<MedicationDispension> medicationDispensionsStore;
        private readonly IReadonlyStore<DiagnosticTestResult> testResultsStore;
        private readonly IReadonlyStore<Observation> observationsStore;
        private readonly IReadonlyStore<PatientDocument> documentsStore;
        private readonly IReadonlyStore<StudyEnrollment> studyEnrollmentStore;
        private readonly IReadonlyStore<Study> studyStore;
        private readonly IReadonlyStore<StudyAssociation> studyAssociationStore;
        private readonly IAuthorizationModule authorizationModule;

        public ViewModelsController(
            IHttpContextAccessor httpContextAccessor,
            IReadonlyStore<Person> personStore,
            IReadonlyStore<Admission> admissionsStore, 
            IReadonlyStore<PatientNote> patientNotesStore, 
            IMedicationScheduleStore medicationSchedulesStore,
            IReadonlyStore<MedicationDispension> medicationDispensionsStore, 
            IReadonlyStore<DiagnosticTestResult> testResultsStore,
            IReadonlyStore<Observation> observationsStore,
            IReadonlyStore<PatientDocument> documentsStore,
            IReadonlyStore<StudyEnrollment> studyEnrollmentStore, 
            IReadonlyStore<Study> studyStore,
            IReadonlyStore<StudyAssociation> studyAssociationStore,
            IAuthorizationModule authorizationModule)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.personStore = personStore;
            this.admissionsStore = admissionsStore;
            this.patientNotesStore = patientNotesStore;
            this.medicationSchedulesStore = medicationSchedulesStore;
            this.medicationDispensionsStore = medicationDispensionsStore;
            this.testResultsStore = testResultsStore;
            this.observationsStore = observationsStore;
            this.documentsStore = documentsStore;
            this.studyEnrollmentStore = studyEnrollmentStore;
            this.studyStore = studyStore;
            this.studyAssociationStore = studyAssociationStore;
            this.authorizationModule = authorizationModule;
        }

        [HttpGet("healthdata/{personId}")]
        public async Task<IActionResult> HealthData(string personId)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            if (!await authorizationModule.HasPermissionForPerson(personId, username))
                return Forbid();
            var profileData = await personStore.GetByIdAsync(personId);
            var admissions = await admissionsStore.SearchAsync(x => x.ProfileData.Id == personId);
            var notes = await patientNotesStore.SearchAsync(x => x.PersonId == personId);
            var medicationSchedules = await medicationSchedulesStore.GetForPerson(personId);
            var medicationDispensions = await medicationDispensionsStore.SearchAsync(x => x.PersonId == personId);
            var testResults = await testResultsStore.SearchAsync(x => x.PersonId == personId);
            var observations = await observationsStore.SearchAsync(x => x.PersonId == personId);
            var documents = await documentsStore.SearchAsync(x => x.PersonId == personId);
            var viewModel = new PatientOverviewViewModel(
                profileData,
                admissions,
                notes,
                medicationSchedules,
                medicationDispensions,
                testResults,
                observations,
                documents);
            return Ok(viewModel);
        }

        [HttpGet("studies/{studyId}")]
        public async Task<IActionResult> Study([FromRoute] string studyId)
        {
            var study = await studyStore.GetByIdAsync(studyId);
            var enrollments = await studyEnrollmentStore.SearchAsync(x => x.StudyId == studyId);
            var enrollmentStatistics = new StudyEnrollmentStatistics(enrollments);
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var myAssociations = await studyAssociationStore.SearchAsync(x => x.StudyId == studyId && x.Username == username);
            var myAssociation = myAssociations.FirstOrDefault();
            var viewModel = new StudyViewModel
            {
                Study = study,
                EnrollmentStatistics = enrollmentStatistics,
                MyAssociation = myAssociation
            };
            return Ok(viewModel);
        }

    }
}
