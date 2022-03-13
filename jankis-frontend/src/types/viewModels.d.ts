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
        roles: Models.Role[];
        permissionModifiers: Models.PermissionModifier[];
        departments: Models.Department[];
    }

    interface AttachedEquipmentViewModel {
        materialViewModels: ViewModels.MaterialViewModel[];
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId: string;
        createdBy: string;
        timestamp: Date;
        equipmentType: string;
        materials: Models.MaterialReference[];
        attachmentTime: Date;
        detachmentTime?: Date | null;
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
        assignedTo?: string;
        followUpOrderId?: string;
        timestamps: Models.ConsumableOrderStateChange[];
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
        rooms: Models.Room[];
        departments: ViewModels.DepartmentViewModel[];
        id: string;
        name: string;
        roomIds: string[];
        departmentIds: string[];
    }

    interface IViewModel<T> {
        
    }

    interface LocationViewModel {
        department?: ViewModels.DepartmentViewModel;
        room?: Models.Room;
        type: Enums.InstitutionLocationType;
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
        audienceViewModels: ViewModels.ServiceAudienceViewModel[];
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
}
