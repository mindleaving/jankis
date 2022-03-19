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

    interface StudyViewModel extends ViewModels.IViewModel<Models.Study> {
        study: Models.Study;
        enrollmentStatistics: Models.StudyEnrollmentStatistics;
        myAssociation: Models.StudyAssociation;
    }

    interface IViewModel<Account> {
        
    }

    interface IViewModel<Study> {
        
    }
}
