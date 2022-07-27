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
using HealthModels.Procedures;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.Workflow;

public class SharerAccountDeleter : IAccountDeleter
{
    private readonly List<IPersonDataStore> personDataStores;
    private readonly IAccountStore accountStore;
    private readonly ISharedAccessStore<EmergencyAccess> emergencyAccessStore;
    private readonly ISharedAccessStore<HealthProfessionalAccess> healthProfessionalAccessStore;

    public SharerAccountDeleter(
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
        ISharedAccessStore<HealthProfessionalAccess> healthProfessionalAccessStore)
    {
        this.accountStore = accountStore;
        this.emergencyAccessStore = emergencyAccessStore;
        this.healthProfessionalAccessStore = healthProfessionalAccessStore;
        personDataStores = new List<IPersonDataStore>
        {
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
            questionnaireAnswersStore
        };
    }

    public async Task<AccountDeleterResult> DeleteAsync(
        string accountId,
        List<IPersonDataAccessGrant> accessGrants,
        PersonDataChangeMetadata changedBy)
    {
        var account = await accountStore.GetByIdAsync(accountId);
        var personId = account.PersonId;
        foreach (var personDataStore in personDataStores)
        {
            await personDataStore.DeleteAllForPerson(personId, accessGrants, changedBy);
        }

        await emergencyAccessStore.DeleteAllForPerson(personId);
        await healthProfessionalAccessStore.DeleteAllForPerson(personId);
        await accountStore.DeleteAsync(accountId);
        return AccountDeleterResult.Success();
    }
}