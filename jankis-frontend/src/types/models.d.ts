import * as Enums from './enums.d';

export namespace Models {
    interface Address {
        role: Enums.AddressRole;
        street: string;
        houseNumber: string;
        postalCode: string;
        city: string;
        country: string;
        firstStayDate?: Date | null;
        lastStayDate?: Date | null;
    }

    interface Admission extends Models.IId {
        patientId: string;
        profileData: Models.Person;
        isReadmission: boolean;
        admissionTime: Date;
        dischargeTime?: Date | null;
        contactPersons: Models.Contact[];
    }

    interface Constants {
        
    }

    interface Contact extends Models.IId {
        name: string;
        phoneNumber?: string;
        email?: string;
        note?: string;
    }

    interface Department extends Models.IId {
        name: string;
        institutionId: string;
        parentDepartmentId?: string;
        roomIds: string[];
    }

    interface HealthInsurance {
        insurerName: string;
        insurerNumber: string;
        insuranceNumber: string;
    }

    interface IId {
        id: string;
    }

    interface Institution extends Models.IId {
        name: string;
        roomIds: string[];
        departmentIds: string[];
    }

    interface IPatientEvent extends Models.IId {
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
    }

    interface PatientDocument extends Models.IPatientEvent {
        note: string;
        fileName: string;
    }

    interface PatientNote extends Models.IPatientEvent {
        message: string;
    }

    interface Person extends Models.IId {
        firstName: string;
        lastName: string;
        birthDate: Date;
        sex: Enums.Sex;
        addresses: Models.Address[];
        healthInsurance?: Models.HealthInsurance;
    }

    interface AllServiceAudience extends Models.ServiceAudience {
        
    }

    interface AttachedEquipment extends Models.IPatientEvent {
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

    interface BedOccupancy extends Models.IId {
        state: Enums.BedState;
        department: Models.Department;
        room: Models.Room;
        bedPosition: string;
        patient?: Models.Person;
        startTime: Date;
        endTime?: Date | null;
        unavailabilityReason?: string;
    }

    interface BooleanServiceParameter extends Models.ServiceParameter {
        
    }

    interface BooleanServiceParameterResponse extends Models.ServiceParameterResponse {
        isTrue: boolean;
    }

    interface Consumable extends Models.IId {
        name: string;
        stockStates: Models.StockState[];
    }

    interface ConsumableOrder extends Models.IId {
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

    interface DiagnosticTestDefinition extends Models.ServiceDefinition {
        testCodeLoinc: string;
        testCodeLocal: string;
        category: string;
        scaleType: Enums.DiagnosticTestScaleType;
    }

    interface QuantitativeDiagnosticTestDefinition extends Models.DiagnosticTestDefinition {
        unit: string;
        referenceRangeStart: number;
        referenceRangeEnd: number;
    }

    interface DrugOrder {
        
    }

    interface EmployeeAccount extends Models.Account {
        roles: string[];
        permissionModifiers: Models.PermissionModifier[];
        departmentIds: string[];
    }

    interface InstitutionPolicy extends Models.IId {
        usersFromSameDepartmentCanChangeServiceRequests: boolean;
    }

    interface LocationReference {
        type: Enums.InstitutionLocationType;
        id: string;
    }

    interface MaterialReference {
        type: Enums.MaterialType;
        id: string;
    }

    interface Meal extends Models.MealMenuItem {
        patientId: string;
        state: Enums.MealState;
    }

    interface MealMenuItem {
        title: string;
        description: string;
        ingredients: string[];
        dietaryCharacteristics: Enums.DietaryCharacteristic[];
        deliveryTime: Date;
    }

    interface NewsItem extends Models.IId {
        publishTimestamp: Date;
        title: string;
        summary: string;
        content: string;
    }

    interface NumberServiceParameter extends Models.ServiceParameter {
        value: number;
        lowerLimit?: number | null;
        upperLimit?: number | null;
    }

    interface NumberServiceParameterResponse extends Models.ServiceParameterResponse {
        value: number;
    }

    interface OptionsServiceParameter extends Models.ServiceParameter {
        options: string[];
    }

    interface OptionsServiceParameterResponse extends Models.ServiceParameterResponse {
        selectedOption: string;
    }

    interface PatientAccount extends Models.Account {
        
    }

    interface PatientServiceParameter extends Models.ServiceParameter {
        
    }

    interface PatientServiceParameterResponse extends Models.ServiceParameterResponse {
        patient: Models.Person;
    }

    interface PermissionModifier {
        permission: Enums.Permission;
        type: Enums.PermissionModifierType;
    }

    interface PersonServiceAudience extends Models.ServiceAudience {
        personId: string;
    }

    interface Resource extends Models.IId {
        name: string;
        location?: Models.LocationReference;
        groupName?: string;
        note: string;
    }

    interface Role extends Models.IId {
        name: string;
        permissions: Enums.Permission[];
        isSystemRole: boolean;
    }

    interface RoleServiceAudience extends Models.ServiceAudience {
        roleId: string;
    }

    interface Room extends Models.IId {
        name: string;
        bedPositions: string[];
    }

    interface ServiceAudience {
        type: Enums.ServiceAudienceType;
    }

    interface ServiceBatchOrder extends Models.IId {
        requests: Models.ServiceRequest[];
    }

    interface ServiceDefinition extends Models.IId {
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
        name: string;
        description: string;
        valueType: Enums.ServiceParameterValueType;
    }

    interface ServiceParameterResponse {
        parameterName: string;
        valueType: Enums.ServiceParameterValueType;
    }

    interface ServiceRequest extends Models.IId {
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

    interface Stock extends Models.IId {
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

    interface TextServiceParameter extends Models.ServiceParameter {
        value: string;
    }

    interface TextServiceParameterResponse extends Models.ServiceParameterResponse {
        value: string;
    }

    export namespace Symptoms {
        interface BodyStructure extends Models.IId {
            icdCode: string;
            name: string;
            categoryIcdCode: string;
        }
    
        interface LocalizedSymptom extends Models.Symptoms.Symptom {
            bodyStructures: Models.Symptoms.BodyStructure[];
        }
    
        interface Symptom extends Models.IId {
            type: Enums.SymptomType;
            name: string;
        }
    
        interface SystemicSymptom extends Models.Symptoms.Symptom {
            
        }
    }

    export namespace Observations {
        interface BloodPressureObservation extends Models.Observations.Observation {
            systolic: number;
            diastolic: number;
        }
    
        interface GenericObservation extends Models.Observations.Observation {
            value: string;
            unit: string;
        }
    
        interface Observation extends Models.IPatientEvent {
            measurementType: string;
        }
    
        interface PulseObservation extends Models.Observations.Observation {
            bpm: number;
            location: string;
        }
    
        interface TemperatureObservation extends Models.Observations.Observation {
            value: number;
            unit: string;
            bodyPart: string;
        }
    }

    export namespace Medication {
        interface Drug extends Models.IId {
            brand: string;
            productName: string;
            activeIngredients: string[];
            dispensionForm: string;
            amountUnit: string;
            amountValue: number;
            applicationSite: string;
        }
    
        interface MedicationDispension extends Models.IPatientEvent {
            drug: Models.Medication.Drug;
            unit: string;
            value: number;
            state: Enums.MedicationDispensionState;
            note?: string;
        }
    
        interface MedicationSchedule extends Models.IId {
            name?: string;
            patientId: string;
            admissionId?: string;
            items: Models.Medication.MedicationScheduleItem[];
            note: string;
            isPaused: boolean;
            isDispendedByPatient: boolean;
        }
    
        interface MedicationScheduleItem extends Models.IId {
            drug: Models.Medication.Drug;
            dispensions: Models.Medication.MedicationDispension[];
            note: string;
            isPaused: boolean;
            isDispendedByPatient: boolean;
        }
    }

    export namespace MedicalTextEditor {
        interface AbbreviationMedicalTextPart extends Models.MedicalTextEditor.MedicalTextPart {
            abbreviation: string;
            fullText: string;
        }
    
        interface DiseaseMedicalTextPart extends Models.MedicalTextEditor.MedicalTextPart {
            icd11Code: string;
        }
    
        interface MedicalText extends Models.IId {
            title: string;
            author: Models.Person;
            recipient: Models.Contact;
            parts: Models.MedicalTextEditor.MedicalTextPart[];
        }
    
        interface MedicalTextPart {
            type: Enums.MedicalTextPartType;
        }
    
        interface PersonalizedAbbreviation extends Models.IId {
            username: string;
            abbreviation: string;
            fullText: string;
        }
    
        interface TextMedicalTextPart extends Models.MedicalTextEditor.MedicalTextPart {
            text: string;
        }
    }

    export namespace Interview {
        interface Question {
            text: string;
            responseType: Enums.QuestionResponseType;
            options: string[];
            unit: string;
        }
    }

    export namespace Icd {
        interface IcdBlock extends Models.Icd.IcdEntry {
            
        }
    
        interface IcdCategory extends Models.Icd.IcdEntry, Models.IId {
            code: string;
        }
    
        interface IcdChapter extends Models.Icd.IcdEntry, Models.IId {
            
        }
    
        interface IcdEntry extends Models.Icd.IIcdEntry {
            
        }
    
        interface IIcdEntry {
            name: string;
            subEntries: Models.Icd.IcdEntry[];
        }
    
        export namespace Annotation {
            interface Disease extends Models.IId {
                icdCode: string;
                name: string;
                editLock?: Models.Icd.Annotation.DiseaseLock;
                categoryIcdCode: string;
                affectedBodyStructures: Models.Symptoms.BodyStructure[];
                symptoms: Models.Symptoms.Symptom[];
                observations: Models.Icd.Annotation.Diagnostics.Observation[];
                diagnosticCriteria: Models.Icd.Annotation.Diagnostics.DiagnosticCriteria[];
                epidemiology: Models.Icd.Annotation.Epidemiology.DiseaseEpidemiology;
                riskFactors: Models.Icd.Annotation.Epidemiology.RiskFactor[];
                references: string[];
            }
        
            interface DiseaseLock {
                icdCode: string;
                user: string;
                createdTimestamp: Date;
            }
        
            interface InfectiousDisease extends Models.Icd.Annotation.Disease {
                pathogens: Models.Icd.Annotation.Epidemiology.Microb[];
                hosts: Models.Icd.Annotation.Epidemiology.DiseaseHost[];
            }
        
            export namespace Epidemiology {
                interface DiseaseEpidemiology {
                    incidenceDataPoints: Models.Icd.Annotation.Epidemiology.IncidenceDataPoint[];
                    prevalenceDataPoints: Models.Icd.Annotation.Epidemiology.PrevalenceDataPoint[];
                    mortalityDataPoints: Models.Icd.Annotation.Epidemiology.MortalityDataPoint[];
                }
            
                interface DiseaseHost extends Models.IId {
                    name: string;
                }
            
                interface ILocation extends Models.IId {
                    type: Enums.LocationType;
                    name: string;
                    coordinate: MongoDB.Driver.GeoJsonObjectModel.GeoJson2DGeographicCoordinates;
                }
            
                interface IncidenceDataPoint extends Models.IId {
                    incidence: number;
                    location: Models.Icd.Annotation.Epidemiology.Location;
                    timeOfYear?: Enums.TimeOfYear[];
                    sex?: Enums.Sex | null;
                    ageRange?: Commons.Mathematics.Range<number>;
                    preexistingCondition?: string;
                }
            
                interface Location extends Models.Icd.Annotation.Epidemiology.ILocation {
                    country: string;
                    countryCode: string;
                }
            
                interface Microb extends Models.IId {
                    icdCode: string;
                    type: Enums.MicrobType;
                    name: string;
                    categoryIcdCode: string;
                }
            
                interface MortalityDataPoint extends Models.IId {
                    mortality: number;
                    yearsAfterDiagnosis: number;
                    sex?: Enums.Sex | null;
                    ageRange?: Commons.Mathematics.Range<number>;
                }
            
                interface PrevalenceDataPoint extends Models.IId {
                    prevalence: number;
                    location: Models.Icd.Annotation.Epidemiology.Location;
                    sex?: Enums.Sex | null;
                    ageRange?: Commons.Mathematics.Range<number>;
                }
            
                interface RiskFactor {
                    type: Enums.RiskFactorType;
                    name: string;
                }
            }
        
            export namespace Diagnostics {
                interface DiagnosticCriteria extends Models.Icd.Annotation.Diagnostics.IDiagnosticCriteria {
                    
                }
            
                interface DiagnosticTest extends Models.Icd.Annotation.Diagnostics.IDiagnosticTest {
                    description: string;
                    bodyStructure: string;
                    methodType: string;
                    category: string;
                    timeAspect: string;
                    measuredProperty: string;
                    formula: string;
                }
            
                interface DocumentDiagnosticCriteria extends Models.Icd.Annotation.Diagnostics.DiagnosticCriteria {
                    
                }
            
                interface FreetextDiagnosticCriteria extends Models.Icd.Annotation.Diagnostics.DiagnosticCriteria {
                    
                }
            
                interface IDiagnosticCriteria {
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                    scaleType: Enums.DiagnosticTestScaleType;
                }
            
                interface IDiagnosticTest extends Models.IId {
                    loincCode: string;
                    name: string;
                    scaleType: Enums.DiagnosticTestScaleType;
                }
            
                interface NominalDiagnosticCriteria extends Models.Icd.Annotation.Diagnostics.DiagnosticCriteria {
                    expectedResponses: string[];
                }
            
                interface Observation extends Models.IId {
                    name: string;
                    bodyStructure?: Models.Symptoms.BodyStructure;
                }
            
                interface OrdinalDiagnosticCriteria extends Models.Icd.Annotation.Diagnostics.DiagnosticCriteria {
                    expectedResponses: string[];
                }
            
                interface OrdinalQuantativeDiagnosticCriteria extends Models.Icd.Annotation.Diagnostics.DiagnosticCriteria {
                    expectedResponses: string[];
                    rangeStart?: math.Unit;
                    rangeEnd?: math.Unit;
                }
            
                interface QuantativeDiagnosticCriteria extends Models.Icd.Annotation.Diagnostics.DiagnosticCriteria {
                    rangeStart?: math.Unit;
                    rangeEnd?: math.Unit;
                }
            
                interface SetDiagnosticCriteria extends Models.Icd.Annotation.Diagnostics.DiagnosticCriteria {
                    expectedResponses: string[];
                }
            }
        }
    }

    export namespace Extensions {
        interface JObjectExtensions {
            
        }
    }

    export namespace DiagnosticTestResults {
        interface DiagnosticTestResult extends Models.DiagnosticTestResults.IDiagnosticTestResult {
            
        }
    
        interface DocumentDiagnosticTestResult extends Models.DiagnosticTestResults.DiagnosticTestResult {
            documentId: string;
        }
    
        interface FreetextDiagnosticTestResult extends Models.DiagnosticTestResults.DiagnosticTestResult {
            text: string;
        }
    
        interface IDiagnosticTestResult extends Models.IPatientEvent {
            testCodeLoinc: string;
            testCodeLocal: string;
            testName: string;
            scaleType: Enums.DiagnosticTestScaleType;
        }
    
        interface NominalDiagnosticTestResult extends Models.DiagnosticTestResults.DiagnosticTestResult {
            value: string;
        }
    
        interface OrdinalDiagnosticTestResult extends Models.DiagnosticTestResults.DiagnosticTestResult {
            value: string;
            numericalValue: number;
        }
    
        interface QuantitativeDiagnosticTestResult extends Models.DiagnosticTestResults.DiagnosticTestResult {
            value: number;
            unit: string;
            referenceRangeStart: number;
            referenceRangeEnd: number;
        }
    
        interface SetDiagnosticTestResult extends Models.DiagnosticTestResults.DiagnosticTestResult {
            
        }
    }

    export namespace AccessControl {
        interface DateAccessFilter extends Models.AccessControl.IAccessFilter {
            startDate?: Date | null;
            endDate?: Date | null;
        }
    
        interface EmergencyAccess extends Models.AccessControl.ISharedAccess {
            
        }
    
        interface EmergencyAccessRequest extends Models.AccessControl.IAccessRequest {
            targetPersonFirstName: string;
            targetPersonLastName: string;
            targetPersonBirthdate: Date;
        }
    
        interface HealthProfessionalAccess extends Models.AccessControl.ISharedAccess {
            
        }
    
        interface HealthProfessionalAccessRequest extends Models.AccessControl.IAccessRequest {
            
        }
    
        interface IAccessFilter {
            type: Enums.AccessFilterType;
        }
    
        interface CategoryAccessFilter extends Models.AccessControl.IAccessFilter {
            categories: Enums.PatientInformationCategory[];
        }
    
        interface IAccessRequest extends Models.IId {
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            createdTimestamp: Date;
            isCompleted: boolean;
            completedTimestamp?: Date | null;
        }
    
        interface ISharedAccess extends Models.IId {
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            accessGrantedTimestamp: Date;
            accessEndTimestamp?: Date | null;
            isRevoked: boolean;
        }
    
        interface ResearchAccess extends Models.AccessControl.ISharedAccess {
            studyId: string;
            accessFilters: Models.AccessControl.IAccessFilter[];
        }
    
        interface ResearchAccessRequest extends Models.AccessControl.IAccessRequest {
            studyId: string;
            accessFilters: Models.AccessControl.IAccessFilter[];
        }
    }

    export namespace Subscriptions {
        interface AdmissionNotification extends Models.Subscriptions.NotificationBase {
            admission: Models.Admission;
        }
    
        interface BedOccupancyNotification extends Models.Subscriptions.NotificationBase {
            bedOccupancy: Models.BedOccupancy;
        }
    
        interface ConsumableOrderSubscription extends Models.Subscriptions.SubscriptionBase {
            orderId: string;
        }
    
        interface DepartmentSubscription extends Models.Subscriptions.SubscriptionBase {
            departmentId: string;
        }
    
        interface INotification extends Models.IId {
            notificationType: Enums.NotificationType;
            subscription: Models.Subscriptions.SubscriptionBase;
            isDismissed: boolean;
            submitter: string;
            timestamp: Date;
        }
    
        interface InstitutionSubscription extends Models.Subscriptions.SubscriptionBase {
            institutionId: string;
        }
    
        interface NotificationBase extends Models.Subscriptions.INotification {
            
        }
    
        interface PatientEventNotification extends Models.Subscriptions.NotificationBase {
            patient: Models.Person;
            eventType: Enums.PatientEventType;
            objectId: string;
            storageOperation: Enums.StorageOperation;
        }
    
        interface PatientSubscription extends Models.Subscriptions.SubscriptionBase {
            patientId: string;
            cancelSubscriptionOnDischarge: boolean;
        }
    
        interface ResourceSubscription extends Models.Subscriptions.SubscriptionBase {
            resourceId: string;
        }
    
        interface ServiceNotification extends Models.Subscriptions.NotificationBase {
            service: Models.ServiceDefinition;
        }
    
        interface ServiceRequestNotification extends Models.Subscriptions.NotificationBase {
            requestId: string;
        }
    
        interface ServiceRequestSubscription extends Models.Subscriptions.SubscriptionBase {
            requestId: string;
        }
    
        interface ServiceSubscription extends Models.Subscriptions.SubscriptionBase {
            serviceId: string;
        }
    
        interface StockSubscription extends Models.Subscriptions.SubscriptionBase {
            stockId: string;
        }
    
        interface SubscriptionBase extends Models.IId {
            username: string;
            mutedUntil?: Date | null;
            type: Enums.SubscriptionObjectType;
        }
    }
}
export namespace MongoDB {
    export namespace Driver {
        export namespace GeoJsonObjectModel {
            interface GeoJson2DGeographicCoordinates extends MongoDB.Driver.GeoJsonObjectModel.GeoJsonCoordinates {
                longitude: number;
                latitude: number;
            }
        
            interface GeoJsonCoordinates extends System.IEquatable<MongoDB.Driver.GeoJsonObjectModel.GeoJsonCoordinates> {
                values: number[];
            }
        }
    }
}
export namespace Commons {
    export namespace Mathematics {
        interface Range<T> {
            from: T;
            to: T;
        }
    }
}
export namespace System {
    interface IEquatable<GeoJsonCoordinates> {
        
    }
}
