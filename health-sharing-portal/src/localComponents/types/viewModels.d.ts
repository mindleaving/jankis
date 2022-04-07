import { Models, MongoDB, Commons, System } from './models.d';
import * as Enums from './enums.d';

export namespace ViewModels {
    interface AccessViewModel extends ViewModels.IViewModel<Models.AccessControl.ISharedAccess> {
        sharerProfileData: Models.Person;
        access: Models.AccessControl.ISharedAccess;
    }

    interface AccountCreationInfo {
        username: string;
        personId: string;
        accountType: Enums.AccountType;
    }

    interface AccountViewModel extends ViewModels.IViewModel<Models.Account> {
        username: string;
        accountType: Enums.AccountType;
        profileData: Models.Person;
    }

    interface DiagnosisViewModel extends Models.Diagnoses.Diagnosis, ViewModels.IViewModel<Models.Diagnoses.Diagnosis> {
        name: string;
    }

    interface IViewModel<T> {
        
    }

    interface LoggedInUserViewModel {
        profileData: Models.Person;
        authenticationResult: Models.AuthenticationResult;
        username: string;
        isPasswordResetRequired: boolean;
        accountType: Enums.AccountType;
        preferedLanguage: Enums.Language;
    }

    interface PatientOverviewViewModel {
        profileData: Models.Person;
        admissions: Models.Admission[];
        notes: Models.PatientNote[];
        diagnoses: ViewModels.DiagnosisViewModel[];
        medicationSchedules: Models.Medication.MedicationSchedule[];
        medicationDispensions: Models.Medication.MedicationDispension[];
        testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
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

    interface QuestionnaireAnswersViewModel extends ViewModels.IViewModel<Models.Interview.QuestionnaireAnswers> {
        questionnaireId: string;
        questionnaireTitle: string;
        questionnaireDescription: string;
        questionnaireLanguage: Enums.Language;
        questionCount: number;
        answersId: string;
        hasAnswered: boolean;
        lastChangeTimestamp: Date;
        assignedBy: string;
        assignedTimestamp: Date;
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
