import { Models, MongoDB, Commons, System } from './models.d';
import * as Enums from './enums.d';

export namespace ViewModels {
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

    interface IViewModel<T> {
        
    }

    interface LoggedInUserViewModel {
        profileData: Models.Person;
        authenticationResult: Models.AuthenticationResult;
        username: string;
        isPasswordResetRequired: boolean;
        accountType: Enums.AccountType;
    }

    interface PatientOverviewViewModel {
        profileData: Models.Person;
        admissions: Models.Admission[];
        notes: Models.PatientNote[];
        medicationSchedules: Models.Medication.MedicationSchedule[];
        medicationDispensions: Models.Medication.MedicationDispension[];
        testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
        observations: Models.Observations.Observation[];
        documents: Models.PatientDocument[];
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

    interface IViewModel<Account> {
        
    }

    interface IViewModel<StudyEnrollment> {
        
    }

    interface IViewModel<Study> {
        
    }
}