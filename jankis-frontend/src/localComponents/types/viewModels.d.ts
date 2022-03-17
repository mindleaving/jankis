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
        roles: Models.Role[];
        permissionModifiers: Models.PermissionModifier[];
        departments: Models.Department[];
    }

    interface AttachedEquipmentViewModel extends Models.AttachedEquipment, ViewModels.IViewModel<Models.AttachedEquipment> {
        materialViewModels: ViewModels.MaterialViewModel[];
    }

    interface ConsumableOrderViewModel extends Models.ConsumableOrder, ViewModels.IViewModel<Models.ConsumableOrder> {
        consumable: Models.Consumable;
        stockViewModels: ViewModels.StockViewModel[];
        requesterViewModel: ViewModels.AccountViewModel;
    }

    interface ConsumableViewModel extends Models.Consumable, ViewModels.IViewModel<Models.Consumable> {
        stockStateViewModels: ViewModels.StockStateViewModel[];
    }

    interface DepartmentViewModel extends Models.Department, ViewModels.IViewModel<Models.Department> {
        parentDepartment?: ViewModels.DepartmentViewModel;
    }

    interface InstitutionViewModel extends Models.Institution, ViewModels.IViewModel<Models.Institution> {
        rooms: Models.Room[];
        departments: ViewModels.DepartmentViewModel[];
    }

    interface IViewModel<T> {
        
    }

    interface LocationViewModel extends Models.LocationReference, ViewModels.IViewModel<Models.LocationReference> {
        department?: ViewModels.DepartmentViewModel;
        room?: Models.Room;
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

    interface MaterialViewModel {
        type: Enums.MaterialType;
        consumable?: Models.Consumable;
        resource?: Models.Resource;
    }

    interface PatientNursingViewModel {
        profileData: Models.Person;
        currentAdmission: Models.Admission;
        equipments: ViewModels.AttachedEquipmentViewModel[];
        observations: Models.Observations.Observation[];
    }

    interface PatientOverviewViewModel {
        profileData: Models.Person;
        currentBedOccupancy: Models.BedOccupancy;
        admissions: Models.Admission[];
        notes: Models.PatientNote[];
        medicationSchedules: Models.Medication.MedicationSchedule[];
        medicationDispensions: Models.Medication.MedicationDispension[];
        testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
        observations: Models.Observations.Observation[];
        documents: Models.PatientDocument[];
        subscription: Models.Subscriptions.PatientSubscription;
    }

    interface ResourceViewModel extends Models.Resource, ViewModels.IViewModel<Models.Resource> {
        locationViewModel?: ViewModels.LocationViewModel;
    }

    interface ServiceAudienceViewModel extends Models.Services.ServiceAudience, ViewModels.IViewModel<Models.Services.ServiceAudience> {
        role?: Models.Role;
        person?: Models.Person;
    }

    interface ServiceViewModel extends Models.Services.ServiceDefinition, ViewModels.IViewModel<Models.Services.ServiceDefinition> {
        department: ViewModels.DepartmentViewModel;
        audienceViewModels: ViewModels.ServiceAudienceViewModel[];
    }

    interface StockStateViewModel extends Models.StockState, ViewModels.IViewModel<Models.StockState> {
        stock: ViewModels.StockViewModel;
        audience: ViewModels.ServiceAudienceViewModel[];
    }

    interface StockViewModel extends Models.Stock, ViewModels.IViewModel<Models.Stock> {
        department: ViewModels.DepartmentViewModel;
        locationViewModel: ViewModels.LocationViewModel;
    }

    interface IViewModel<Account> {
        
    }

    interface IViewModel<AttachedEquipment> {
        
    }

    interface IViewModel<ConsumableOrder> {
        
    }

    interface IViewModel<Consumable> {
        
    }

    interface IViewModel<Department> {
        
    }

    interface IViewModel<Institution> {
        
    }

    interface IViewModel<LocationReference> {
        
    }

    interface IViewModel<Resource> {
        
    }

    interface IViewModel<ServiceAudience> {
        
    }

    interface IViewModel<ServiceDefinition> {
        
    }

    interface IViewModel<StockState> {
        
    }

    interface IViewModel<Stock> {
        
    }
}
