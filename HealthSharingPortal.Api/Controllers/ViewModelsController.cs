using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Diagnoses;
using HealthModels.DiagnosticTestResults;
using HealthModels.Interview;
using HealthModels.Medication;
using HealthModels.Observations;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow;
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
        private readonly IReadonlyStore<Questionnaire> questionaireStore;
        private readonly IReadonlyStore<Diagnosis> diagnosesStore;

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
            IAuthorizationModule authorizationModule,
            IReadonlyStore<Questionnaire> questionaireStore,
            IReadonlyStore<Diagnosis> diagnosesStore)
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
            this.questionaireStore = questionaireStore;
            this.diagnosesStore = diagnosesStore;
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
            var diagnoses = await diagnosesStore.SearchAsync(x => x.PersonId == personId);
            var medicationSchedules = await medicationSchedulesStore.GetForPerson(personId);
            var medicationDispensions = await medicationDispensionsStore.SearchAsync(x => x.PersonId == personId);
            var testResults = await testResultsStore.SearchAsync(x => x.PersonId == personId);
            var observations = await observationsStore.SearchAsync(x => x.PersonId == personId);
            var documents = await documentsStore.SearchAsync(x => x.PersonId == personId);
            var viewModel = new PatientOverviewViewModel(
                profileData,
                admissions,
                notes,
                diagnoses,
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
            if (study == null)
                return NotFound();
            var enrollments = await studyEnrollmentStore.SearchAsync(x => x.StudyId == studyId);
            var enrollmentStatistics = new StudyEnrollmentStatistics(enrollments);
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            StudyAssociation myAssociation = null;
            if (accountType == AccountType.Researcher)
            {
                var username = ControllerHelpers.GetUsername(httpContextAccessor);
                var myAssociations = await studyAssociationStore.SearchAsync(x => x.StudyId == studyId && x.Username == username);
                myAssociation = myAssociations.FirstOrDefault();
            }

            StudyEnrollment myEnrollment = null;
            if (accountType == AccountType.Sharer)
            {
                var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
                var myEnrollments = await studyEnrollmentStore.SearchAsync(x => x.StudyId == studyId && x.PersonId == personId);
                myEnrollment = myEnrollments.FirstOrDefault();
            }
            var viewModel = new StudyViewModel
            {
                Study = study,
                EnrollmentStatistics = enrollmentStatistics,
                MyAssociation = myAssociation,
                MyEnrollment = myEnrollment
            };
            return Ok(viewModel);
        }

        [HttpGet("studies/{studyId}/offerparticipation")]
        public async Task<IActionResult> OfferParticipationInStudy([FromRoute] string studyId, [FromQuery] Language language = Language.en)
        {
            var study = await studyStore.GetByIdAsync(studyId);
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            var myEnrollments = await studyEnrollmentStore.SearchAsync(x => x.StudyId == studyId && x.PersonId == personId);
            var myEnrollment = myEnrollments.FirstOrDefault();
            var questionaireToSchemaConverter = new QuestionaireToSchemaConverter();
            var inclusionCriteriaQuestionnaires = new List<Questionnaire>();
            var inclusionCriteriaSchemas = new List<QuestionnaireSchema>();
            foreach (var questionaireId in study.InclusionCriteriaQuestionaireIds ?? Enumerable.Empty<string>())
            {
                var questionnaire = await questionaireStore.GetByIdAsync(questionaireId);
                if(questionnaire.Language != language)
                    continue;
                inclusionCriteriaQuestionnaires.Add(questionnaire);
                var schema = questionaireToSchemaConverter.Convert(questionnaire);
                inclusionCriteriaSchemas.Add(new QuestionnaireSchema
                {
                    QuestionnaireId = questionaireId,
                    Schema = schema
                });
            }

            var exclusionCriteriaQuestionnaires = new List<Questionnaire>();
            var exclusionCriteriaSchemas = new List<QuestionnaireSchema>();
            foreach (var questionaireId in study.ExclusionCriteriaQuestionaireIds ?? Enumerable.Empty<string>())
            {
                var questionnaire = await questionaireStore.GetByIdAsync(questionaireId);
                if(questionnaire.Language != language)
                    continue;
                exclusionCriteriaQuestionnaires.Add(questionnaire);
                var schema = questionaireToSchemaConverter.Convert(questionnaire);
                exclusionCriteriaSchemas.Add(new QuestionnaireSchema
                {
                    QuestionnaireId = questionaireId,
                    Schema = schema
                });
            }
            var viewModel = new StudyParticipationOfferViewModel
            {
                Study = study,
                InclusionCriteriaQuestionnaires = inclusionCriteriaQuestionnaires,
                InclusionCriteriaSchemas = inclusionCriteriaSchemas,
                InclusionCriteriaAnswers = inclusionCriteriaSchemas
                    .Select(schema => myEnrollment?.InclusionCriteriaQuestionnaireAnswers?.Find(x => x.QuestionnaireId == schema.QuestionnaireId))
                    .ToList(),
                ExclusionCriteriaQuestionnaires = exclusionCriteriaQuestionnaires,
                ExclusionCriteriaSchemas = exclusionCriteriaSchemas,
                ExclusionCriteriaAnswers = exclusionCriteriaSchemas
                    .Select(schema => myEnrollment?.ExclusionCriteriaQuestionnaireAnswers?.Find(x => x.QuestionnaireId == schema.QuestionnaireId))
                    .ToList()
            };
            return Ok(viewModel);
        }
    }
}
