import { Models } from './models.d';
import * as Enums from './enums.d';

export namespace ViewModels {
    interface AccountCreationInfo {
        username: string;
        personId: string;
        accountType: Enums.AccountType;
    }

    interface AccountViewModel {
        username: string;
        accountType: Enums.AccountType;
        profileData: Models.Person;
        roles: Models.Role[];
        permissionModifiers: Models.PermissionModifier[];
        departments: Models.Department[];
    }

    interface LoggedInUserViewModel {
        profileData: Models.Person;
        authenticationResult: Models.AuthenticationResult;
        username: string;
        isPasswordResetRequired: boolean;
        accountType: Enums.AccountType;
        roles: Models.Role[];
        permissions: Enums.Permission[];
        departmentIds: string[];
    }

    interface PatientOverviewViewModel {
        profileData: Models.Person;
        admissions: Models.Admission[];
        notes: Models.PatientNote[];
        testResults: Models.DiagnosticTestResult[];
        observations: Models.Observation[];
        documents: Models.PatientDocument[];
    }
}
