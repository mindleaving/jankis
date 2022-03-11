import { Models, MongoDB, Commons } from './models.d';
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
}
