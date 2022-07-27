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
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow.ViewModelBuilders
{
    public class HealthRecordViewModelBuilder
    {
        private readonly IPersonStore personStore;
        private readonly IPersonDataReadonlyStore<Admission> admissionsStore;
        private readonly IPersonDataReadonlyStore<PatientNote> patientNotesStore;
        private readonly IPersonDataReadonlyStore<MedicationSchedule> medicationSchedulesStore;
        private readonly IPersonDataReadonlyStore<MedicationDispension> medicationDispensionsStore;
        private readonly IPersonDataReadonlyStore<Immunization> immunizationsStore;
        private readonly IPersonDataReadonlyStore<DiagnosticTestResult> testResultsStore;
        private readonly IPersonDataReadonlyStore<MedicalProcedure> medicalProceduresStore;
        private readonly IPersonDataReadonlyStore<Observation> observationsStore;
        private readonly IPersonDataReadonlyStore<PatientDocument> documentsStore;
        private readonly IPersonDataReadonlyStore<Diagnosis> diagnosesStore;
        private readonly IPersonDataReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore;
        private readonly IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder;
        private readonly IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder;

        public HealthRecordViewModelBuilder(
            IPersonStore personStore,
            IPersonDataReadonlyStore<Admission> admissionsStore,
            IPersonDataReadonlyStore<PatientNote> patientNotesStore,
            IPersonDataReadonlyStore<MedicationSchedule> medicationSchedulesStore,
            IPersonDataReadonlyStore<MedicationDispension> medicationDispensionsStore,
            IPersonDataReadonlyStore<Immunization> immunizationsStore,
            IPersonDataReadonlyStore<DiagnosticTestResult> testResultsStore,
            IPersonDataReadonlyStore<MedicalProcedure> medicalProceduresStore,
            IPersonDataReadonlyStore<Observation> observationsStore,
            IPersonDataReadonlyStore<PatientDocument> documentsStore,
            IPersonDataReadonlyStore<Diagnosis> diagnosesStore,
            IPersonDataReadonlyStore<QuestionnaireAnswers> questionnaireAnswersStore,
            IViewModelBuilder<Diagnosis> diagnosisViewModelBuilder,
            IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder)
        {
            this.personStore = personStore;
            this.admissionsStore = admissionsStore;
            this.patientNotesStore = patientNotesStore;
            this.medicationSchedulesStore = medicationSchedulesStore;
            this.medicationDispensionsStore = medicationDispensionsStore;
            this.immunizationsStore = immunizationsStore;
            this.testResultsStore = testResultsStore;
            this.medicalProceduresStore = medicalProceduresStore;
            this.observationsStore = observationsStore;
            this.documentsStore = documentsStore;
            this.diagnosesStore = diagnosesStore;
            this.questionnaireAnswersStore = questionnaireAnswersStore;
            this.diagnosisViewModelBuilder = diagnosisViewModelBuilder;
            this.questionnaireAnswersViewModelBuilder = questionnaireAnswersViewModelBuilder;
        }

        public async Task<HealthRecordViewModel> Build(
            string personId, 
            List<IPersonDataAccessGrant> accessGrants,
            Language language = Language.en)
        {
            var profileData = personStore.GetByIdAsync(personId, accessGrants);
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
            await Task.WhenAll(
                profileData,
                admissions,
                notes,
                diagnoses,
                medicationSchedules,
                medicationDispensions,
                testResults,
                medicalProcedures,
                observations,
                documents,
                questionnaireAnswers);

            return new HealthRecordViewModel(
                profileData.Result,
                admissions.Result,
                notes.Result,
                diagnoses.Result.Cast<DiagnosisViewModel>().ToList(),
                medicationSchedules.Result,
                medicationDispensions.Result,
                immunizations.Result,
                testResults.Result,
                medicalProcedures.Result,
                observations.Result,
                documents.Result,
                questionnaireAnswers.Result.Cast<QuestionnaireAnswersViewModel>().ToList());
        }
    }
}
