using System;
using HealthModels;
using HealthModels.AccessControl;
using HealthModels.Diagnoses;
using HealthModels.DiagnosticTestResults;
using HealthModels.Interview;
using HealthModels.Medication;
using HealthModels.Observations;
using HealthModels.Procedures;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.Workflow
{
    public class AccountDeleterFactory
    {
        private readonly IAccountStore accountStore;
        private readonly IPersonDataStore<Admission> admissionStore;
        private readonly IPersonDataStore<GenomeExplorerDeployment> genomeExplorerDeploymentStore;
        private readonly IPersonDataStore<MedicationSchedule> medicationScheduleStore;
        private readonly IPersonDataStore<StudyEnrollment> studyEnrollmentStore;
        private readonly IPersonDataStore<Observation> observationStore;
        private readonly IPersonDataStore<Diagnosis> diagnosisStore;
        private readonly IPersonDataStore<DiagnosticTestResult> testResultStore;
        private readonly IPersonDataStore<Immunization> immunizationStore;
        private readonly IPersonDataStore<MedicalProcedure> medicalProcedureStore;
        private readonly IPersonDataStore<MedicationDispension> medicationDispensionStore;
        private readonly IPersonDataStore<PatientDocument> documentStore;
        private readonly IPersonDataStore<PatientNote> noteStore;
        private readonly IPersonDataStore<QuestionnaireAnswers> questionnaireAnswersStore;
        private readonly ISharedAccessStore<EmergencyAccess> emergencyAccessStore;
        private readonly ISharedAccessStore<HealthProfessionalAccess> healthProfessionalAccessStore;
        private readonly IStudyAssociationStore studyAssociationStore;

        public AccountDeleterFactory(
            IAccountStore accountStore,
            IPersonDataStore<Admission> admissionStore,
            IPersonDataStore<GenomeExplorerDeployment> genomeExplorerDeploymentStore,
            IPersonDataStore<MedicationSchedule> medicationScheduleStore,
            IPersonDataStore<StudyEnrollment> studyEnrollmentStore,
            IPersonDataStore<Observation> observationStore,
            IPersonDataStore<Diagnosis> diagnosisStore,
            IPersonDataStore<DiagnosticTestResult> testResultStore,
            IPersonDataStore<Immunization> immunizationStore,
            IPersonDataStore<MedicalProcedure> medicalProcedureStore,
            IPersonDataStore<MedicationDispension> medicationDispensionStore,
            IPersonDataStore<PatientDocument> documentStore,
            IPersonDataStore<PatientNote> noteStore,
            IPersonDataStore<QuestionnaireAnswers> questionnaireAnswersStore,
            ISharedAccessStore<EmergencyAccess> emergencyAccessStore,
            ISharedAccessStore<HealthProfessionalAccess> healthProfessionalAccessStore,
            IStudyAssociationStore studyAssociationStore)
        {
            this.accountStore = accountStore;
            this.admissionStore = admissionStore;
            this.genomeExplorerDeploymentStore = genomeExplorerDeploymentStore;
            this.medicationScheduleStore = medicationScheduleStore;
            this.studyEnrollmentStore = studyEnrollmentStore;
            this.observationStore = observationStore;
            this.diagnosisStore = diagnosisStore;
            this.testResultStore = testResultStore;
            this.immunizationStore = immunizationStore;
            this.medicalProcedureStore = medicalProcedureStore;
            this.medicationDispensionStore = medicationDispensionStore;
            this.documentStore = documentStore;
            this.noteStore = noteStore;
            this.questionnaireAnswersStore = questionnaireAnswersStore;
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
            this.studyAssociationStore = studyAssociationStore;
        }

        public IAccountDeleter Create(
            AccountType accountType)
        {
            switch (accountType)
            {
                case AccountType.Sharer:
                    return new SharerAccountDeleter(
                        accountStore,
                        admissionStore,
                        genomeExplorerDeploymentStore,
                        medicationScheduleStore,
                        studyEnrollmentStore,
                        observationStore,
                        diagnosisStore,
                        testResultStore,
                        immunizationStore,
                        medicalProcedureStore,
                        medicationDispensionStore,
                        documentStore,
                        noteStore,
                        questionnaireAnswersStore,
                        emergencyAccessStore,
                        healthProfessionalAccessStore);
                case AccountType.HealthProfessional:
                    return new HealthProfessionalAccountDeleter(accountStore);
                case AccountType.Researcher:
                    return new ResearcherAccountDeleter(accountStore, studyAssociationStore);
                case AccountType.EmergencyGuest:
                    throw new ArgumentException("Emergency guest accounts are temporary and cannot be deleted");
                case AccountType.Admin:
                    return new AdminAccountDeleter(accountStore);
                default:
                    throw new ArgumentOutOfRangeException(nameof(accountType), accountType, null);
            }
        }
    }
}
