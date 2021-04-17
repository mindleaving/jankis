import * as Enums from './enums.d';

export namespace Models {
    interface Admission {
        id: string;
        patientId: string;
        profileData: Models.Person;
        isReadmission: boolean;
        admissionTime: Date;
        dischargeTime?: Date | null;
        contactPersons: Models.Contact[];
        bedOccupancies: Models.BedOccupancy[];
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

    interface BedOccupancy {
        departmentId: string;
        roomId: string;
        bedIndex: string;
        startTime: Date;
        endTime: Date;
    }

    interface BloodPressureObservation {
        measurementType: string;
        systolic: number;
        diastolic: number;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
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
        id: string;
        consumableId: string;
        requester: string;
        quantity: number;
        preferredSources: string[];
        note: string;
        state: Enums.OrderState;
        timestamps: { [key: Enums.OrderState]: Date };
    }

    interface Contact {
        id: string;
        name: string;
        phoneNumber?: string;
        email?: string;
        note?: string;
    }

    interface Department {
        id: string;
        name: string;
        institutionId: string;
        parentDepartment?: string;
        rooms: Models.Room[];
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
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
        scaleType: Enums.DiagnosticTestScaleType;
    }

    interface DocumentDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        documentId: string;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
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

    interface EmployeeAccount {
        accountType: Enums.AccountType;
        roles: string[];
        permissionModifiers: Models.PermissionModifier[];
        departmentIds: string[];
        id: string;
        personId: string;
        username: string;
        isPasswordChangeRequired: boolean;
    }

    interface FreetextDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        text: string;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
    }

    interface GenericObservation {
        measurementType: string;
        value: string;
        unit: string;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
    }

    interface HealthInsurance {
        insurerName: string;
        insurerNumber: string;
        insuranceNumber: string;
    }

    interface HealthRecord {
        personId: string;
        admissions: Models.Admission[];
        observations: Models.Observation[];
        testResults: Models.DiagnosticTestResult[];
        notes: Models.PatientNote[];
        documents: Models.PatientDocument[];
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
        rooms: Models.Room[];
        departments: Models.Department[];
    }

    interface InstitutionPolicy {
        id: string;
        usersFromSameDepartmentCanChangeServiceRequests: boolean;
    }

    interface IPatientEvent {
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
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
        value: string;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
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
        measurementType: string;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
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
        value: string;
        numericalValue: number;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
        testCodeLoinc: string;
        testCodeLocal: string;
        testName: string;
    }

    interface PatientAccount {
        accountType: Enums.AccountType;
        id: string;
        personId: string;
        username: string;
        isPasswordChangeRequired: boolean;
    }

    interface PatientDocument {
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
        note: string;
    }

    interface PatientNote {
        type: Enums.PatientEventType;
        id: string;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
        message: string;
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
        sex: Enums.Sex;
        healthInsurance?: Models.HealthInsurance;
    }

    interface PersonServiceAudience {
        personId: string;
        type: Enums.ServiceAudienceType;
    }

    interface PulseObservation {
        measurementType: string;
        bpm: number;
        location: string;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
    }

    interface QuantitativeDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        value: number;
        unit: string;
        referenceRangeStart: number;
        referenceRangeEnd: number;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
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
        roleId: string;
        type: Enums.ServiceAudienceType;
    }

    interface Room {
        id: string;
        name: string;
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
        requester: string;
        parameterResponses: { [key: string]: Models.ServiceParameterResponse };
        note: string;
        state: Enums.ServiceRequestState;
        timestamps: { [key: Enums.ServiceRequestState]: Date };
    }

    interface SetDiagnosticTestResult {
        scaleType: Enums.DiagnosticTestScaleType;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
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

    interface TemperatureObservation {
        measurementType: string;
        value: number;
        unit: string;
        bodyPart: string;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
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
