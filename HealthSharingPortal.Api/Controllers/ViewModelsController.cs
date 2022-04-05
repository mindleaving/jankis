using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
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
        private readonly IPersonDataReadonlyStore<Person> personStore;
        private readonly IPersonDataReadonlyStore<Admission> admissionsStore;
        private readonly IPersonDataReadonlyStore<PatientNote> patientNotesStore;
        private readonly IPersonDataReadonlyStore<MedicationSchedule> medicationSchedulesStore;
        private readonly IPersonDataReadonlyStore<MedicationDispension> medicationDispensionsStore;
        private readonly IPersonDataReadonlyStore<DiagnosticTestResult> testResultsStore;
        private readonly IPersonDataReadonlyStore<Observation> observationsStore;
        private readonly IPersonDataReadonlyStore<PatientDocument> documentsStore;
        private readonly IPersonDataReadonlyStore<StudyEnrollment> studyEnrollmentStore;
        private readonly IReadonlyStore<Study> studyStore;
        private readonly IReadonlyStore<StudyAssociation> studyAssociationStore;
        private readonly IAuthorizationModule authorizationModule;
        private readonly IReadonlyStore<Questionnaire> questionaireStore;
        private readonly IPersonDataReadonlyStore<Diagnosis> diagnosesStore;
        private readonly IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder;
        private readonly IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder;
        private readonly IPersonDataReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore;
        private readonly IPersonDataReadonlyStore<GenomeExplorerDeployment> genomeExplorerDeploymentStore;

        public ViewModelsController(
            IHttpContextAccessor httpContextAccessor,
            IPersonDataReadonlyStore<Person> personStore,
            IPersonDataReadonlyStore<Admission> admissionsStore, 
            IPersonDataReadonlyStore<PatientNote> patientNotesStore, 
            IPersonDataReadonlyStore<MedicationSchedule> medicationSchedulesStore,
            IPersonDataReadonlyStore<MedicationDispension> medicationDispensionsStore, 
            IPersonDataReadonlyStore<DiagnosticTestResult> testResultsStore,
            IPersonDataReadonlyStore<Observation> observationsStore,
            IPersonDataReadonlyStore<PatientDocument> documentsStore,
            IPersonDataReadonlyStore<StudyEnrollment> studyEnrollmentStore, 
            IReadonlyStore<Study> studyStore,
            IReadonlyStore<StudyAssociation> studyAssociationStore,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<Questionnaire> questionaireStore,
            IPersonDataReadonlyStore<Diagnosis> diagnosesStore,
            IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder,
            IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder,
            IPersonDataReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore,
            IPersonDataReadonlyStore<GenomeExplorerDeployment> genomeExplorerDeploymentStore)
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
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            var accessGrant = await authorizationModule.GetAccessGrantForPerson(personId, claims);
            if (!accessGrant.Permissions.Contains(AccessPermissions.Read))
                return Forbid();
            var accessGrants = new List<IPersonDataAccessGrant> { accessGrant };
            var profileData = await personStore.GetByIdAsync(personId, accessGrants);
            if (profileData == null)
                return NotFound();
            var admissions = admissionsStore.SearchAsync(x => x.ProfileData.Id == personId, accessGrants);
            var notes = patientNotesStore.SearchAsync(x => x.PersonId == personId, accessGrants);
            var diagnoses = diagnosesStore.SearchAsync(x => x.PersonId == personId, accessGrants)
                .ContinueWith(result => diagnosisViewModelBuilder.BatchBuild(result.Result, new DiagnosisViewModelBuilderOptions { Language = language }))
                .Unwrap();
            var medicationSchedules = medicationSchedulesStore.SearchAsync(x => x.PersonId == personId, accessGrants);
            var medicationDispensions = medicationDispensionsStore.SearchAsync(x => x.PersonId == personId, accessGrants);
            var testResults = testResultsStore.SearchAsync(x => x.PersonId == personId, accessGrants);
            var observations = observationsStore.SearchAsync(x => x.PersonId == personId, accessGrants);
            var documents = documentsStore.SearchAsync(x => x.PersonId == personId, accessGrants);
            var questionnaireAnswers = questionnaireAnswersStore.SearchAsync(x => x.PersonId == personId, accessGrants)
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
            var statisticsAccessGrant = new List<IPersonDataAccessGrant> 
            { 
                new StudyEnrollmentStatisticsAccessGrant()
            };
            var enrollments = await studyEnrollmentStore.SearchAsync(x => x.StudyId == studyId, statisticsAccessGrant);
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
                var claims = ControllerHelpers.GetClaims(httpContextAccessor);
                var accessGrant = await authorizationModule.GetAccessGrantForPerson(personId, claims);
                var myEnrollments = await studyEnrollmentStore.SearchAsync(
                    x => x.StudyId == studyId && x.PersonId == personId, 
                    new List<IPersonDataAccessGrant> { accessGrant });
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
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            var accessGrant = await authorizationModule.GetAccessGrantForPerson(personId, claims);
            var myEnrollments = await studyEnrollmentStore.SearchAsync(
                x => x.StudyId == studyId && x.PersonId == personId, 
                new List<IPersonDataAccessGrant> { accessGrant });
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
            var accessGrant = await authorizationModule.GetAccessGrantForPerson(personId, claims);
            if (!accessGrant.Permissions.Contains(AccessPermissions.Read))
                return Forbid();
            var accessGrants = new List<IPersonDataAccessGrant> { accessGrant };
            var person = await personStore.GetByIdAsync(personId, accessGrants);
            if (person == null)
                return NotFound();
            var referenceSequences = await testResultsStore.SearchAsync(x => x.PersonId == personId && x.TestCodeLoinc == "62374-4", accessGrants);
            var sequencingTestResults = await testResultsStore.SearchAsync(x => x.PersonId == personId && x.TestCodeLoinc == "86206-0", accessGrants);
            var associatedDocumentIds = sequencingTestResults.Cast<DocumentDiagnosticTestResult>().Select(x => x.DocumentId).ToList();
            var sequencingDocuments = associatedDocumentIds.Count > 0
                ? await documentsStore.SearchAsync(x => x.PersonId == personId && associatedDocumentIds.Contains(x.Id), accessGrants)
                : new List<PatientDocument>();
            var deployments = await genomeExplorerDeploymentStore.SearchAsync(x => x.PersonId == personId, accessGrants);
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
