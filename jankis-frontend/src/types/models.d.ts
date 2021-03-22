import * as Enums from './enums.d';

export namespace Models {
    interface AdmissionInfo {
        ward: string;
        room: string;
        bed: string;
    }

    interface Bed {
        state: Enums.BedState;
        roomId: string;
        patientId: string;
        unavailabilityReason: string;
        note: string;
    }

    interface DischargeInfo {
        
    }

    interface Drug {
        
    }

    interface DrugOrder {
        
    }

    interface Employee {
        institutionId: string;
        roles: string[];
        permissionModifiers: Models.PermissionModifier[];
        isPasswordChangeRequired: boolean;
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
    }

    interface EmployeeRegistrationInfo {
        password: string;
        institutionId: string;
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
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

    interface Observation {
        id: string;
        patientId: string;
        type: string;
    }

    interface PulseObservation {
        bpm: number;
        location: string;
        id: string;
        patientId: string;
        type: string;
    }

    interface AutocompleteCacheItem {
        context: string;
        value: string;
    }

    interface BloodPressureObservation {
        systolic: number;
        diastolic: number;
        id: string;
        patientId: string;
        type: string;
    }

    interface Patient {
        healthInsurance: Models.HealthInsurance;
        admissionInfo: Models.AdmissionInfo;
        contactPersons: Models.Employee[];
        attachedEquipment: Models.MedicalEquipment[];
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
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

    interface Role {
        id: string;
        name: string;
        permissions: Enums.Permission[];
    }

    interface Room {
        id: string;
        wardId: string;
        beds: Models.Bed[];
    }

    interface ServiceDefinition {
        
    }

    interface ServiceRequest {
        
    }

    interface Ward {
        id: string;
        institutionId: string;
        rooms: Models.Room[];
    }
}
