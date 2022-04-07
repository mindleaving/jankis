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
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
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
        private readonly IReadonlyStore<MedicationSchedule> medicationSchedulesStore;
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
        private readonly IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder;
        private readonly IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder;
        private readonly IReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore;
        private readonly IReadonlyStore<GenomeExplorerDeployment> genomeExplorerDeploymentStore;

        public ViewModelsController(
            IHttpContextAccessor httpContextAccessor,
            IReadonlyStore<Person> personStore,
            IReadonlyStore<Admission> admissionsStore, 
            IReadonlyStore<PatientNote> patientNotesStore, 
            IReadonlyStore<MedicationSchedule> medicationSchedulesStore,
            IReadonlyStore<MedicationDispension> medicationDispensionsStore, 
            IReadonlyStore<DiagnosticTestResult> testResultsStore,
            IReadonlyStore<Observation> observationsStore,
            IReadonlyStore<PatientDocument> documentsStore,
            IReadonlyStore<StudyEnrollment> studyEnrollmentStore, 
            IReadonlyStore<Study> studyStore,
            IReadonlyStore<StudyAssociation> studyAssociationStore,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<Questionnaire> questionaireStore,
            IReadonlyStore<Diagnosis> diagnosesStore,
            IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder,
            IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder,
            IReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore,
            IReadonlyStore<GenomeExplorerDeployment> genomeExplorerDeploymentStore)
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
            this.questionnaireAnswersViewModelBuilder = questionnaireAnswersViewModelBuilder;
            this.diagnosisViewModelBuilder = diagnosisViewModelBuilder;
            this.questionnaireAnswersStore = questionnaireAnswersStore;
            this.genomeExplorerDeploymentStore = genomeExplorerDeploymentStore;
        }

        [HttpGet("healthdata/{personId}")]
        public async Task<IActionResult> HealthData(
            [FromRoute] string personId, 
            [FromQuery] Language language = Language.en)
        {
            var profileData = await personStore.GetByIdAsync(personId);
            if (profileData == null)
                return NotFound();
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            if (!await authorizationModule.HasPermissionForPerson(personId, claims))
                return Forbid();
            var admissions = admissionsStore.SearchAsync(x => x.ProfileData.Id == personId);
            var notes = patientNotesStore.SearchAsync(x => x.PersonId == personId);
            var diagnoses = diagnosesStore.SearchAsync(x => x.PersonId == personId)
                .ContinueWith(result => diagnosisViewModelBuilder.BatchBuild(result.Result, new DiagnosisViewModelBuilderOptions { Language = language }))
                .Unwrap();
            var medicationSchedules = medicationSchedulesStore.SearchAsync(x => x.PersonId == personId);
            var medicationDispensions = medicationDispensionsStore.SearchAsync(x => x.PersonId == personId);
            var testResults = testResultsStore.SearchAsync(x => x.PersonId == personId);
            var observations = observationsStore.SearchAsync(x => x.PersonId == personId);
            var documents = documentsStore.SearchAsync(x => x.PersonId == personId);
            var questionnaireAnswers = questionnaireAnswersStore.SearchAsync(x => x.PersonId == personId)
                .ContinueWith(result => questionnaireAnswersViewModelBuilder.BatchBuild(result.Result))
                .Unwrap();
            await Task.WhenAll(
                admissions,
                notes,
                diagnoses,
                medicationSchedules,
                medicationDispensions,
                testResults,
                observations,
                documents,
                questionnaireAnswers);

            var viewModel = new PatientOverviewViewModel(
                profileData,
                admissions.Result,
                notes.Result,
                diagnoses.Result.Cast<DiagnosisViewModel>().ToList(),
                medicationSchedules.Result,
                medicationDispensions.Result,
                testResults.Result,
                observations.Result,
                documents.Result,
                questionnaireAnswers.Result.Cast<QuestionnaireAnswersViewModel>().ToList());
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
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Sharer)
                return Forbid("Only sharers can offer participation in a study");
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

        [HttpGet("genomesequences/{personId}")]
        public async Task<IActionResult> GenomeSequences([FromRoute] string personId)
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            if (!await authorizationModule.HasPermissionForPerson(personId, claims))
                return Forbid();
            var person = await personStore.GetByIdAsync(personId);
            if (person == null)
                return NotFound();
            var referenceSequences = await testResultsStore.SearchAsync(x => x.PersonId == personId && x.TestCodeLoinc == "62374-4");
            var sequencingTestResults = await testResultsStore.SearchAsync(x => x.PersonId == personId && x.TestCodeLoinc == "86206-0");
            var associatedDocumentIds = sequencingTestResults.Cast<DocumentDiagnosticTestResult>().Select(x => x.DocumentId).ToList();
            var sequencingDocuments = await documentsStore.SearchAsync(x => x.PersonId == personId && associatedDocumentIds.Contains(x.Id));
            var deployments = await genomeExplorerDeploymentStore.SearchAsync(x => x.PersonId == personId);
            var viewModel = new PersonGenomeSequencesViewModel
            {
                Person = person,
                ReferenceSequences = referenceSequences.Cast<NominalDiagnosticTestResult>().ToList(),
                TestResults = sequencingTestResults.Cast<DocumentDiagnosticTestResult>().ToList(),
                Documents = sequencingDocuments,
                Deployments = deployments
            };
            return Ok(viewModel);
        }

    }
}
