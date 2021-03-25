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

    interface Department {
        id: string;
        name: string;
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

    interface NumberServiceParameter {
        value: number;
        lowerLimit?: number | null;
        upperLimit?: number | null;
        name: string;
        description: string;
        valueType: Enums.ServiceParameterValueType;
    }

    interface NumberServiceParameterResponse {
        value: number;
        parameterName: string;
        valueType: Enums.ServiceParameterValueType;
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
        contactPersons: Models.Employee[];
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

    interface SystemRoles {
        
    }

    interface Role {
        id: string;
        name: string;
        permissions: Enums.Permission[];
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
        departmentId: string;
        audience: Models.ServiceAudience[];
    }

    interface ServiceParameter {
        name: string;
        description: string;
        valueType: Enums.ServiceParameterValueType;
    }

    interface ServiceParameterResponse {
        parameterName: string;
        valueType: Enums.ServiceParameterValueType;
    }

    interface ServiceRequest {
        id: string;
        serviceId: string;
        requester: Models.PersonReference;
        parameterResponses: { [key: string]: Models.ServiceParameterResponse };
        state: Enums.ServiceRequestState;
        timestamps: { [key: Enums.ServiceRequestState]: Date };
    }

    interface TextServiceParameter {
        value: string;
        name: string;
        description: string;
        valueType: Enums.ServiceParameterValueType;
    }

    interface TextServiceParameterResponse {
        value: string;
        parameterName: string;
        valueType: Enums.ServiceParameterValueType;
    }

    interface Ward {
        id: string;
        institutionId: string;
        rooms: Models.Room[];
    }
}
