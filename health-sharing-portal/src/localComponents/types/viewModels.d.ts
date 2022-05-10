import { Models, MongoDB, Commons, System } from './models.d';
import * as Enums from './enums.d';

export namespace ViewModels {
    interface AccessViewModel extends ViewModels.IViewModel<Models.AccessControl.ISharedAccess> {
        sharerProfileData: Models.Person;
        access: Models.AccessControl.ISharedAccess;
        hasEmergencyToken: boolean;
    }

    interface AccountCreationInfo {
        accountType: Enums.AccountType;
        person: Models.Person;
        menschIdChallengeResponse?: string;
        menschIdChallengeId?: string;
    }

    interface AccountViewModel extends ViewModels.IViewModel<Models.Account> {
        accountId: string;
        accountType: Enums.AccountType;
        profileData: Models.Person;
        isPasswordChangeRequired: boolean;
    }

    interface CopyMedicationScheduleItemViewModel {
        sourceScheduleId: string;
        itemId: string;
        targetScheduleId: string;
    }

    interface DiagnosisViewModel extends Models.Diagnoses.Diagnosis, ViewModels.IViewModel<Models.Diagnoses.Diagnosis> {
        name: string;
    }

    interface DispenseMedicationViewModel {
        scheduleId: string;
        itemId: string;
        dispensionId: string;
        dispensionState: Enums.MedicationDispensionState;
        administrationTime?: Date | null;
        administeredBy: string;
        note: string;
        administeredAmount: Models.Medication.MedicationDosage;
    }

    interface GuestEmergencyAccessViewModel {
        user: ViewModels.GuestViewModel;
        accessInfo: Models.AccessControl.EmergencyAccess;
    }

    interface GuestViewModel extends ViewModels.IUserViewModel {
        authenticationResult: Models.AuthenticationResult;
    }

    interface IUserViewModel {
        profileData: Models.Person;
        accountType: string;
        accountId: string;
        preferedLanguage: Enums.Language;
    }

    interface IViewModel<T> {
        
    }

    interface LoggedInUserViewModel extends ViewModels.IUserViewModel {
        account: Models.Account;
    }

    interface LoginCreationInfo {
        username: string;
        password: string;
    }

    interface MenschIdChallengeViewModel {
        menschId: string;
        challengeId: string;
        challengeShortId: string;
    }

    interface PastMedicationViewModel {
        personId: string;
        drug: Models.Medication.Drug;
        createdBy: string;
        administeredBy?: string;
        dosage: Models.Medication.MedicationDosage;
        startTimestamp: Date;
        endTimestamp: Date;
        pattern: Models.Medication.MedicationSchedulePattern;
    }

    interface PatientOverviewViewModel {
        profileData: Models.Person;
        admissions: Models.Admission[];
        notes: Models.PatientNote[];
        diagnoses: ViewModels.DiagnosisViewModel[];
        medicationSchedules: Models.Medication.MedicationSchedule[];
        medicationDispensions: Models.Medication.MedicationDispension[];
        immunizations: Models.Medication.Immunization[];
        testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
        medicalProcedures: Models.Procedures.MedicalProcedure[];
        observations: Models.Observations.Observation[];
        documents: Models.PatientDocument[];
        questionnaires: ViewModels.QuestionnaireAnswersViewModel[];
    }

    interface PersonGenomeSequencesViewModel {
        person: Models.Person;
        referenceSequences: Models.DiagnosticTestResults.NominalDiagnosticTestResult[];
        testResults: Models.DiagnosticTestResults.DocumentDiagnosticTestResult[];
        documents: Models.PatientDocument[];
        deployments: Models.GenomeExplorerDeployment[];
    }

    interface QuestionnaireAnswersViewModel extends Models.Interview.QuestionnaireAnswers, ViewModels.IViewModel<Models.Interview.QuestionnaireAnswers> {
        questionnaireTitle: string;
        questionnaireDescription: string;
        questionnaireLanguage: Enums.Language;
        questionCount: number;
        hasAnswered: boolean;
    }

    interface StudyEnrollmentViewModel extends ViewModels.IViewModel<Models.StudyEnrollment> {
        enrollment: Models.StudyEnrollment;
        person: Models.Person;
    }

    interface StudyParticipationOfferViewModel {
        study: Models.Study;
        inclusionCriteriaQuestionnaires: Models.Interview.Questionnaire[];
        inclusionCriteriaSchemas: ViewModels.QuestionnaireSchema[];
        inclusionCriteriaAnswers: Models.Interview.QuestionnaireAnswers[];
        exclusionCriteriaQuestionnaires: Models.Interview.Questionnaire[];
        exclusionCriteriaSchemas: ViewModels.QuestionnaireSchema[];
        exclusionCriteriaAnswers: Models.Interview.QuestionnaireAnswers[];
    }

    interface QuestionnaireSchema {
        questionnaireId: string;
        schema: any;
    }

    interface StudyViewModel extends ViewModels.IViewModel<Models.Study> {
        study: Models.Study;
        enrollmentStatistics: Models.StudyEnrollmentStatistics;
        myAssociation: Models.StudyAssociation;
        myEnrollment: Models.StudyEnrollment;
    }

    interface IViewModel<ISharedAccess> {
        
    }

    interface IViewModel<Account> {
        
    }

    interface IViewModel<Diagnosis> {
        
    }

    interface IViewModel<QuestionnaireAnswers> {
        
    }

    interface IViewModel<StudyEnrollment> {
        
    }

    interface IViewModel<Study> {
        
    }
}
