import * as Enums from './enums.d';

export namespace Models {
    interface AdmissionInfo {
        ward: string;
        room: string;
        bed: string;
    }

    interface AllServiceAudience {
        type: Enums.ServiceAudienceType;
    }

    interface AutocompleteCacheItem {
        context: string;
        value: string;
    }

    interface Bed {
        state: Enums.BedState;
        roomId: string;
        patientId: string;
        unavailabilityReason: string;
        note: string;
    }

    interface BloodPressureObservation {
        systolic: number;
        diastolic: number;
        id: string;
        patientId: string;
        type: string;
    }

    interface Consumable {
        id: string;
        name: string;
        stockStates: Models.StockState[];
    }

    interface ConsumableOrder {
        consumableId: string;
        requester: Models.PersonReference;
        quantity: number;
        preferredSources: Models.LocationReference[];
        note: string;
        state: Enums.OrderState;
        timestamps: { [key: Enums.OrderState]: Date };
    }

    interface Department {
        id: string;
        name: string;
        parentDepartment: string;
    }

    interface DischargeInfo {
        
    }

    interface Drug {
        
    }

    interface DrugOrder {
        
    }

    interface Employee {
        type: Enums.PersonType;
        institutionId: string;
        departmentIds: string[];
        isPasswordChangeRequired: boolean;
        roles: string[];
        permissionModifiers: Models.PermissionModifier[];
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
    }

    interface EmployeeRegistrationInfo {
        institutionId: string;
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
    }

    interface EmployeeServiceAudience {
        employeeId: string;
        type: Enums.ServiceAudienceType;
    }

    interface HealthInsurance {
        
    }

    interface Institution {
        id: string;
        name: string;
        wards: Models.Ward[];
    }

    interface InstitutionPolicy {
        id: string;
        usersFromSameDepartmentCanChangeServiceRequests: boolean;
    }

    interface LocationReference {
        type: Enums.LocationType;
        id: string;
    }

    interface Meal {
        patientId: string;
        state: Enums.MealState;
        title: string;
        description: string;
        ingredients: string[];
        dietaryCharacteristics: Enums.DietaryCharacteristic[];
        deliveryTime: Date;
    }

    interface MealMenuItem {
        title: string;
        description: string;
        ingredients: string[];
        dietaryCharacteristics: Enums.DietaryCharacteristic[];
        deliveryTime: Date;
    }

    interface MedicalEquipment {
        id: string;
    }

    interface MedicationDispension {
        time: Date;
        state: Enums.MedicationDispensionState;
    }

    interface MedicationPlan {
        patientId: string;
        drug: Models.Drug;
        dispensions: Models.MedicationDispension[];
    }

    interface NewsItem {
        id: string;
        publishTimestamp: Date;
        title: string;
        summary: string;
        content: string;
    }

    interface NumberServiceParameter {
        valueType: Enums.ServiceParameterValueType;
        value: number;
        lowerLimit?: number | null;
        upperLimit?: number | null;
        name: string;
        description: string;
    }

    interface NumberServiceParameterResponse {
        valueType: Enums.ServiceParameterValueType;
        value: number;
        parameterName: string;
    }

    interface Observation {
        id: string;
        patientId: string;
        type: string;
    }

    interface Patient {
        type: Enums.PersonType;
        healthInsurance: Models.HealthInsurance;
        admissionInfo: Models.AdmissionInfo;
        contactPersons: Models.PersonReference[];
        attachedEquipment: Models.MedicalEquipment[];
        isPasswordChangeRequired: boolean;
        roles: string[];
        permissionModifiers: Models.PermissionModifier[];
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
    }

    interface PatientRegistrationInfo {
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
        healthInsurance: Models.HealthInsurance;
    }

    interface PatientServiceAudience {
        patientId: string;
        type: Enums.ServiceAudienceType;
    }

    interface PermissionModifier {
        permission: Enums.Permission;
        type: Enums.PermissionModifierType;
    }

    interface Person {
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
    }

    interface PersonReference {
        type: Enums.PersonType;
        id: string;
    }

    interface PersonWithLogin {
        type: Enums.PersonType;
        isPasswordChangeRequired: boolean;
        roles: string[];
        permissionModifiers: Models.PermissionModifier[];
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
    }

    interface PulseObservation {
        bpm: number;
        location: string;
        id: string;
        patientId: string;
        type: string;
    }

    interface Resource {
        id: string;
        name: string;
        location: Models.LocationReference;
        groupId?: string;
    }

    interface ResourceGroup {
        id: string;
        name: string;
        parentGroup?: string;
    }

    interface SystemRoles {
        
    }

    interface Role {
        id: string;
        name: string;
        permissions: Enums.Permission[];
        isSystemRole: boolean;
    }

    interface RoleServiceAudience {
        roleName: string;
        type: Enums.ServiceAudienceType;
    }

    interface Room {
        id: string;
        wardId: string;
        beds: Models.Bed[];
    }

    interface ServiceAudience {
        type: Enums.ServiceAudienceType;
    }

    interface ServiceDefinition {
        id: string;
        name: string;
        description: string;
        parameters: Models.ServiceParameter[];
        audience: Models.ServiceAudience[];
        departmentId: string;
    }

    interface ServiceParameter {
        valueType: Enums.ServiceParameterValueType;
        name: string;
        description: string;
    }

    interface PatientServiceParameter {
        valueType: Enums.ServiceParameterValueType;
        name: string;
        description: string;
    }

    interface ServiceParameterResponse {
        valueType: Enums.ServiceParameterValueType;
        parameterName: string;
    }

    interface PatientServiceParameterResponse {
        valueType: Enums.ServiceParameterValueType;
        patientId: string;
        parameterName: string;
    }

    interface ServiceRequest {
        id: string;
        serviceId: string;
        requester: Models.PersonReference;
        parameterResponses: { [key: string]: Models.ServiceParameterResponse };
        note: string;
        state: Enums.ServiceRequestState;
        timestamps: { [key: Enums.ServiceRequestState]: Date };
    }

    interface Stock {
        id: string;
        location: Models.LocationReference;
        departmentId: string;
    }

    interface StockState {
        stockId: string;
        quantity: number;
        isOrderable: boolean;
        isUnlimitedOrderable: boolean;
        orderableBy: Models.ServiceAudience[];
    }

    interface TextServiceParameter {
        valueType: Enums.ServiceParameterValueType;
        value: string;
        name: string;
        description: string;
    }

    interface TextServiceParameterResponse {
        valueType: Enums.ServiceParameterValueType;
        value: string;
        parameterName: string;
    }

    interface Ward {
        id: string;
        institutionId: string;
        rooms: Models.Room[];
    }

    export namespace Subscriptions {
        interface ServiceSubscription {
            serviceId: string;
            employeeId: string;
        }
    
        interface SubscriptionBase {
            employeeId: string;
        }
    }
}
