import * as Enums from './enums.d';

export namespace Models {
    interface Admission {
        id: string;
        patientId: string;
        healthInsurance: Models.HealthInsurance;
        admissionInfo: Models.AdmissionInfo;
        isReadmission: boolean;
        medicationSchedule: Models.MedicationSchedule;
        attachedEquipment: Models.AttachedEquipment[];
        observations: Models.Observation[];
        diagnosticTestResults: Models.DiagnosticTestResult[];
        notes: Models.PatientNote[];
        dischargeInfo: Models.DischargeInfo;
        contactPersons: Models.PersonReference[];
    }

    interface AdmissionInfo {
        admissionTime: Date;
        ward: string;
        room: string;
        bed: string;
    }

    interface AllServiceAudience {
        type: Enums.ServiceAudienceType;
    }

    interface AttachedEquipment {
        equipment: Models.MedicalEquipment;
        attachmentTime: Date;
        detachmentTime?: Date | null;
    }

    interface AuthenticationResult {
        isAuthenticated: boolean;
        user?: Models.PersonWithLogin;
        accessToken?: string;
        error: Enums.AuthenticationErrorType;
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
        createdBy: string;
        timestamp: Date;
        type: string;
    }

    interface BooleanServiceParameter {
        valueType: Enums.ServiceParameterValueType;
        name: string;
        description: string;
    }

    interface BooleanServiceParameterResponse {
        valueType: Enums.ServiceParameterValueType;
        isTrue: boolean;
        parameterName: string;
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
        preferredSources: string[];
        note: string;
        state: Enums.OrderState;
        timestamps: { [key: Enums.OrderState]: Date };
    }

    interface Contact {
        id: string;
        name: string;
        phoneNumber: string;
        email: string;
    }

    interface Department {
        id: string;
        name: string;
        parentDepartment?: string;
    }

    interface DiagnosticTestDefinition {
        testCodeLoinc: string;
        testCodeLocal: string;
        scaleType: Enums.DiagnosticTestScaleType;
        id: string;
        name: string;
        description: string;
        parameters: Models.ServiceParameter[];
        audience: Models.ServiceAudience[];
        departmentId: string;
        autoAcceptRequests: boolean;
        isAvailable: boolean;
    }

    interface DiagnosticTestResult {
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
        scaleType: Enums.DiagnosticTestScaleType;
    }

    interface DischargeInfo {
        dischargeTime: Date;
    }

    interface DocumentDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
    }

    interface Drug {
        id: string;
        brand: string;
        productName: string;
        activeIngredients: string[];
        dispensionForm: string;
        amountUnit: string;
        amountValue: number;
        applicationSite: string;
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

    interface FreetextDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
    }

    interface HealthInsurance {
        
    }

    interface IDiagnosticTestResult {
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
        scaleType: Enums.DiagnosticTestScaleType;
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

    interface IPatientEvent {
        createdBy: string;
        timestamp: Date;
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
        type: string;
    }

    interface MedicationDispension {
        time: Date;
        unit: string;
        value: number;
        state: Enums.MedicationDispensionState;
        note: string;
    }

    interface MedicationSchedule {
        patientId: string;
        items: Models.MedicationScheduleItem[];
        note: string;
    }

    interface MedicationScheduleItem {
        drug: Models.Drug;
        dispensions: Models.MedicationDispension[];
        note: string;
    }

    interface NewsItem {
        id: string;
        publishTimestamp: Date;
        title: string;
        summary: string;
        content: string;
    }

    interface NominalDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
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
        createdBy: string;
        timestamp: Date;
        type: string;
    }

    interface OptionsServiceParameter {
        valueType: Enums.ServiceParameterValueType;
        options: string[];
        name: string;
        description: string;
    }

    interface OptionsServiceParameterResponse {
        valueType: Enums.ServiceParameterValueType;
        selectedOption: string;
        parameterName: string;
    }

    interface OrdinalDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
    }

    interface OrdinalOrQuantitativeDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
    }

    interface Patient {
        type: Enums.PersonType;
        healthInsurance: Models.HealthInsurance;
        isPasswordChangeRequired: boolean;
        roles: string[];
        permissionModifiers: Models.PermissionModifier[];
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
    }

    interface PatientNote {
        createdBy: string;
        timestamp: Date;
        message: string;
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

    interface PatientServiceParameter {
        valueType: Enums.ServiceParameterValueType;
        name: string;
        description: string;
    }

    interface PatientServiceParameterResponse {
        valueType: Enums.ServiceParameterValueType;
        patientId: string;
        parameterName: string;
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
        createdBy: string;
        timestamp: Date;
        type: string;
    }

    interface QuantitativeDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        unit: string;
        referenceRangeStart: number;
        referenceRangeEnd: number;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
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
    }

    interface ServiceAudience {
        type: Enums.ServiceAudienceType;
    }

    interface ServiceBatchOrder {
        id: string;
        requests: Models.ServiceRequest[];
    }

    interface ServiceDefinition {
        id: string;
        name: string;
        description: string;
        parameters: Models.ServiceParameter[];
        audience: Models.ServiceAudience[];
        departmentId: string;
        autoAcceptRequests: boolean;
        isAvailable: boolean;
    }

    interface ServicePackage {
        name: string;
        serviceIds: string[];
    }

    interface ServiceParameter {
        valueType: Enums.ServiceParameterValueType;
        name: string;
        description: string;
    }

    interface ServiceParameterResponse {
        valueType: Enums.ServiceParameterValueType;
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

    interface SetDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
    }

    interface Stock {
        id: string;
        name: string;
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

    interface SystemRoles {
        
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
