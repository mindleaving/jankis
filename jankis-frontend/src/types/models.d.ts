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
    }

    interface AllServiceAudience {
        type: Enums.ServiceAudienceType;
    }

    interface AttachedEquipment {
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

    interface AuthenticationResult {
        isAuthenticated: boolean;
        accessToken?: string;
        error: Enums.AuthenticationErrorType;
    }

    interface AutocompleteCacheItem {
        context: string;
        value: string;
    }

    interface AutoCompleteContextGenerator {
        
    }

    interface BedOccupancy {
        id: string;
        state: Enums.BedState;
        department: Models.Department;
        room: Models.Room;
        bedPosition: string;
        patient?: Models.Person;
        startTime: Date;
        endTime?: Date | null;
        unavailabilityReason?: string;
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

    interface ConsumableOrderStateChange {
        newState: Enums.OrderState;
        timestamp: Date;
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
        parentDepartmentId?: string;
        roomIds: string[];
    }

    interface DiagnosticTestDefinition {
        testCodeLoinc: string;
        testCodeLocal: string;
        category: string;
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

    interface QuantitativeDiagnosticTestDefinition {
        unit: string;
        referenceRangeStart: number;
        referenceRangeEnd: number;
        testCodeLoinc: string;
        testCodeLocal: string;
        category: string;
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
        roomIds: string[];
        departmentIds: string[];
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

    interface MaterialReference {
        type: Enums.MaterialType;
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

    interface MedicationDispension {
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
        drug: Models.Drug;
        unit: string;
        value: number;
        state: Enums.MedicationDispensionState;
        note?: string;
    }

    interface MedicationSchedule {
        id: string;
        name?: string;
        patientId: string;
        admissionId?: string;
        items: Models.MedicationScheduleItem[];
        note: string;
        isPaused: boolean;
        isDispendedByPatient: boolean;
    }

    interface MedicationScheduleItem {
        id: string;
        drug: Models.Drug;
        dispensions: Models.MedicationDispension[];
        note: string;
        isPaused: boolean;
        isDispendedByPatient: boolean;
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
        fileName: string;
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
        patient: Models.Person;
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
        type: Enums.ServiceAudienceType;
        personId: string;
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
        location?: Models.LocationReference;
        groupName?: string;
        note: string;
    }

    interface Role {
        id: string;
        name: string;
        permissions: Enums.Permission[];
        isSystemRole: boolean;
    }

    interface RoleServiceAudience {
        type: Enums.ServiceAudienceType;
        roleId: string;
    }

    interface Room {
        id: string;
        name: string;
        bedPositions: string[];
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
        service: Models.ServiceDefinition;
        requester: string;
        parameterResponses: { [key: string]: Models.ServiceParameterResponse };
        requesterNote: string;
        state: Enums.ServiceRequestState;
        timestamps: Models.ServiceRequestStateChange[];
        assignedTo?: string;
        handlerNote: string;
    }

    interface ServiceRequestStateChange {
        newState: Enums.ServiceRequestState;
        timestamp: Date;
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
        interface AdmissionNotification {
            notificationType: Enums.NotificationType;
            admission: Models.Admission;
            id: string;
            subscription: Models.Subscriptions.SubscriptionBase;
            isDismissed: boolean;
            submitter: string;
            timestamp: Date;
        }
    
        interface BedOccupancyNotification {
            notificationType: Enums.NotificationType;
            bedOccupancy: Models.BedOccupancy;
            id: string;
            subscription: Models.Subscriptions.SubscriptionBase;
            isDismissed: boolean;
            submitter: string;
            timestamp: Date;
        }
    
        interface ConsumableOrderSubscription {
            type: Enums.SubscriptionObjectType;
            orderId: string;
            id: string;
            username: string;
            mutedUntil?: Date | null;
        }
    
        interface DepartmentSubscription {
            type: Enums.SubscriptionObjectType;
            departmentId: string;
            id: string;
            username: string;
            mutedUntil?: Date | null;
        }
    
        interface INotification {
            notificationType: Enums.NotificationType;
            subscription: Models.Subscriptions.SubscriptionBase;
            isDismissed: boolean;
            submitter: string;
            timestamp: Date;
        }
    
        interface InstitutionSubscription {
            type: Enums.SubscriptionObjectType;
            institutionId: string;
            id: string;
            username: string;
            mutedUntil?: Date | null;
        }
    
        interface NotificationBase {
            notificationType: Enums.NotificationType;
            id: string;
            subscription: Models.Subscriptions.SubscriptionBase;
            isDismissed: boolean;
            submitter: string;
            timestamp: Date;
        }
    
        interface PatientEventNotification {
            notificationType: Enums.NotificationType;
            patient: Models.Person;
            eventType: Enums.PatientEventType;
            objectId: string;
            storageOperation: Enums.StorageOperation;
            id: string;
            subscription: Models.Subscriptions.SubscriptionBase;
            isDismissed: boolean;
            submitter: string;
            timestamp: Date;
        }
    
        interface PatientSubscription {
            type: Enums.SubscriptionObjectType;
            patientId: string;
            cancelSubscriptionOnDischarge: boolean;
            id: string;
            username: string;
            mutedUntil?: Date | null;
        }
    
        interface ResourceSubscription {
            type: Enums.SubscriptionObjectType;
            resourceId: string;
            id: string;
            username: string;
            mutedUntil?: Date | null;
        }
    
        interface ServiceNotification {
            notificationType: Enums.NotificationType;
            service: Models.ServiceDefinition;
            id: string;
            subscription: Models.Subscriptions.SubscriptionBase;
            isDismissed: boolean;
            submitter: string;
            timestamp: Date;
        }
    
        interface ServiceRequestNotification {
            notificationType: Enums.NotificationType;
            requestId: string;
            id: string;
            subscription: Models.Subscriptions.SubscriptionBase;
            isDismissed: boolean;
            submitter: string;
            timestamp: Date;
        }
    
        interface ServiceRequestSubscription {
            type: Enums.SubscriptionObjectType;
            requestId: string;
            id: string;
            username: string;
            mutedUntil?: Date | null;
        }
    
        interface ServiceSubscription {
            type: Enums.SubscriptionObjectType;
            serviceId: string;
            id: string;
            username: string;
            mutedUntil?: Date | null;
        }
    
        interface StockSubscription {
            type: Enums.SubscriptionObjectType;
            stockId: string;
            id: string;
            username: string;
            mutedUntil?: Date | null;
        }
    
        interface SubscriptionBase {
            type: Enums.SubscriptionObjectType;
            id: string;
            username: string;
            mutedUntil?: Date | null;
        }
    }
}
