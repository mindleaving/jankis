using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.DiagnosticTestResults;
using HealthModels.Medication;
using HealthModels.Observations;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ViewModelsController : ControllerBase
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IReadonlyStore<Account> accountStore;
        private readonly IReadonlyStore<Person> personStore;
        private readonly IReadonlyStore<Admission> admissionsStore;
        private readonly IReadonlyStore<PatientNote> patientNotesStore;
        private readonly IMedicationScheduleStore medicationSchedulesStore;
        private readonly IReadonlyStore<MedicationDispension> medicationDispensionsStore;
        private readonly IReadonlyStore<DiagnosticTestResult> testResultsStore;
        private readonly IReadonlyStore<Observation> observationsStore;
        private readonly IReadonlyStore<PatientDocument> documentsStore;
        private readonly IHealthProfessionalAccessReadonlyStore healthProfessionalAccessStore;
        private readonly IStudyAssociationReadonlyStore studyAssociationStore;
        private readonly IStudyEnrollmentReadonlyStore studyEnrollmentStore;

        public ViewModelsController(
            IHttpContextAccessor httpContextAccessor, 
            IReadonlyStore<Account> accountStore, 
            IReadonlyStore<Person> personStore,
            IReadonlyStore<Admission> admissionsStore, 
            IReadonlyStore<PatientNote> patientNotesStore, 
            IMedicationScheduleStore medicationSchedulesStore,
            IReadonlyStore<MedicationDispension> medicationDispensionsStore, 
            IReadonlyStore<DiagnosticTestResult> testResultsStore,
            IReadonlyStore<Observation> observationsStore,
            IReadonlyStore<PatientDocument> documentsStore, 
            IHealthProfessionalAccessReadonlyStore healthProfessionalAccessStore, 
            IStudyAssociationReadonlyStore studyAssociationStore,
            IStudyEnrollmentReadonlyStore studyEnrollmentStore)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.accountStore = accountStore;
            this.personStore = personStore;
            this.admissionsStore = admissionsStore;
            this.patientNotesStore = patientNotesStore;
            this.medicationSchedulesStore = medicationSchedulesStore;
            this.medicationDispensionsStore = medicationDispensionsStore;
            this.testResultsStore = testResultsStore;
            this.observationsStore = observationsStore;
            this.documentsStore = documentsStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
            this.studyAssociationStore = studyAssociationStore;
            this.studyEnrollmentStore = studyEnrollmentStore;
        }

        [HttpGet("healthdata/{personId}")]
        public async Task<IActionResult> HealthData(string personId)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            if (!await HasPermissionForPerson(personId, username))
                return Forbid();
            var profileData = await personStore.GetByIdAsync(personId);
            var admissions = await admissionsStore.SearchAsync(x => x.PatientId == personId);
            var notes = await patientNotesStore.SearchAsync(x => x.PatientId == personId);
            var medicationSchedules = await medicationSchedulesStore.GetForPatient(personId);
            var medicationDispensions = await medicationDispensionsStore.SearchAsync(x => x.PatientId == personId);
            var testResults = await testResultsStore.SearchAsync(x => x.PatientId == personId);
            var observations = await observationsStore.SearchAsync(x => x.PatientId == personId);
            var documents = await documentsStore.SearchAsync(x => x.PatientId == personId);
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

        private async Task<bool> HasPermissionForPerson(string personId, string username)
        {
            var account = await accountStore.GetByIdAsync(username);
            if (account.AccountType == AccountType.Admin)
            {
                return false; // Admins don't have access to health data
            }
            if (account.AccountType == AccountType.Sharer)
            {
                return account.PersonId == personId;
            }
            if (account.AccountType == AccountType.HealthProfessional)
            {
                return await healthProfessionalAccessStore.HasActiveAccessForPersonAssignedToUser(personId, username);
            }
            if (account.AccountType == AccountType.Researcher)
            {
                var associatedStudies = await studyAssociationStore.GetAllStudiesForUser(username);
                return await studyEnrollmentStore.IsEnrolledInAny(associatedStudies.Select(x => x.StudyId));
            }
            return false;
        }
    }
}
