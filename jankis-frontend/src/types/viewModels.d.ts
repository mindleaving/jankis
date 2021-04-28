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

    interface ConsumableOrderViewModel {
        consumable: Models.Consumable;
        stockViewModels: ViewModels.StockViewModel[];
        requesterViewModel: ViewModels.AccountViewModel;
        id: string;
        consumableId: string;
        consumableName: string;
        requester: string;
        quantity: number;
        preferredSources: string[];
        note: string;
        state: Enums.OrderState;
        timestamps: { [key: Enums.OrderState]: Date };
    }

    interface ConsumableViewModel {
        stockStateViewModels: ViewModels.StockStateViewModel[];
        id: string;
        name: string;
        stockStates: Models.StockState[];
    }

    interface DepartmentViewModel {
        parentDepartment?: ViewModels.DepartmentViewModel;
        id: string;
        name: string;
        institutionId: string;
        parentDepartmentId?: string;
        roomIds: string[];
    }

    interface InstitutionViewModel {
        id: string;
        name: string;
        rooms: Models.Room[];
        departments: Models.Department[];
    }

    interface IViewModel<T> {
        
    }

    interface LocationViewModel {
        department?: ViewModels.DepartmentViewModel;
        room?: Models.Room;
        type: Enums.LocationType;
        id: string;
    }

    interface LoggedInUserViewModel {
        profileData: Models.Person;
        authenticationResult: Models.AuthenticationResult;
        username: string;
        isPasswordResetRequired: boolean;
        accountType: Enums.AccountType;
        roles: Models.Role[];
        permissions: Enums.Permission[];
        departments: Models.Department[];
    }

    interface PatientOverviewViewModel {
        profileData: Models.Person;
        currentBedOccupancy: Models.BedOccupancy;
        admissions: Models.Admission[];
        notes: Models.PatientNote[];
        medicationSchedules: Models.MedicationSchedule[];
        medicationDispensions: Models.MedicationDispension[];
        testResults: Models.DiagnosticTestResult[];
        observations: Models.Observation[];
        documents: Models.PatientDocument[];
        subscription: Models.Subscriptions.PatientSubscription;
    }

    interface ResourceViewModel {
        locationViewModel?: ViewModels.LocationViewModel;
        id: string;
        name: string;
        location?: Models.LocationReference;
        groupName?: string;
        note: string;
    }

    interface ServiceAudienceViewModel {
        type: Enums.ServiceAudienceType;
        role?: Models.Role;
        person?: Models.Person;
    }

    interface ServiceViewModel {
        department: ViewModels.DepartmentViewModel;
        id: string;
        name: string;
        description: string;
        parameters: Models.ServiceParameter[];
        audience: Models.ServiceAudience[];
        departmentId: string;
        autoAcceptRequests: boolean;
        isAvailable: boolean;
    }

    interface StockStateViewModel {
        stock: ViewModels.StockViewModel;
        audience: ViewModels.ServiceAudienceViewModel[];
        stockId: string;
        quantity: number;
        isOrderable: boolean;
        isUnlimitedOrderable: boolean;
        orderableBy: Models.ServiceAudience[];
    }

    interface StockViewModel {
        department: ViewModels.DepartmentViewModel;
        locationViewModel: ViewModels.LocationViewModel;
        id: string;
        name: string;
        location: Models.LocationReference;
        departmentId: string;
    }

    export namespace Builders {
        interface AccountViewModelBuilder {
            
        }
    
        interface ConsumableOrderViewModelBuilder {
            
        }
    
        interface ConsumableViewModelBuilder {
            
        }
    
        interface DepartmentViewModelBuilder {
            
        }
    
        interface IViewModelBuilder<T> {
            
        }
    
        interface LocationViewModelBuilder {
            
        }
    
        interface ResourceViewModelBuilder {
            
        }
    
        interface ServiceAudienceViewModelBuilder {
            
        }
    
        interface ServiceViewModelBuilder {
            
        }
    
        interface StockStateViewModelBuilder {
            
        }
    
        interface StockViewModelBuilder {
            
        }
    }
}
