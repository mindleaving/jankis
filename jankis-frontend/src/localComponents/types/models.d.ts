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

    interface Admission extends Models.IPersonData {
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

    interface IHasTranslations {
        name: string;
        translations: { [key: Enums.Language]: string };
    }

    interface IHealthRecordEntry extends Models.IPersonData {
        type: Enums.HealthRecordEntryType;
        createdBy: string;
        timestamp: Date;
        isVerified: boolean;
        hasBeenSeenBySharer: boolean;
    }

    interface IId {
        id: string;
    }

    interface Institution extends Models.IId {
        name: string;
    }

    interface IPersonData extends Models.IId {
        personId: string;
    }

    interface PatientDocument extends Models.IHealthRecordEntry {
        note: string;
        fileName: string;
    }

    interface PatientNote extends Models.IHealthRecordEntry {
        message: string;
    }

    interface Person extends Models.IPersonData {
        firstName: string;
        lastName: string;
        birthDate: Date;
        sex: Enums.Sex;
        addresses: Models.Address[];
        phoneNumber?: string;
        healthInsurance?: Models.HealthInsurance;
    }

    interface PersonDataChange extends Models.IId {
        type: string;
        entryId: string;
        changedByAccountId: string;
        changedByPersonId: string;
        timestamp: Date;
        changeType: Enums.StorageOperation;
    }

    interface Account extends Models.IId {
        accountType: Enums.AccountType;
        personId: string;
        preferedLanguage: Enums.Language;
        loginIds: string[];
    }

    interface AttachedEquipment extends Models.IHealthRecordEntry {
        equipmentType: string;
        materials: Models.MaterialReference[];
        attachmentTime: Date;
        detachmentTime?: Date | null;
    }

    interface BedOccupancy extends Models.IId {
        state: Enums.BedState;
        institutionId: string;
        department: Models.Department;
        room: Models.Room;
        bedPosition: string;
        patient?: Models.Person;
        startTime: Date;
        endTime?: Date | null;
        unavailabilityReason?: string;
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
        personId: string;
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

    interface PatientAccount extends Models.Account {
        
    }

    interface PermissionModifier {
        permission: Enums.Permission;
        type: Enums.PermissionModifierType;
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

    interface Room extends Models.IId {
        name: string;
        bedPositions: string[];
        institutionId: string;
    }

    interface ServiceBatchOrder extends Models.IId {
        requests: Models.Services.ServiceRequest[];
    }

    interface ServicePackage {
        name: string;
        serviceIds: string[];
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
        orderableBy: Models.Services.ServiceAudience[];
    }

    interface SystemRoles {
        
    }

    interface AuthenticationResult {
        isAuthenticated: boolean;
        accessToken?: string;
        isPasswordChangeRequired: boolean;
        error: Enums.AuthenticationErrorType;
    }

    interface AutocompleteCacheItem {
        context: string;
        value: string;
    }

    interface AutoCompleteContextGenerator {
        
    }

    interface GenomeExplorerDeployment extends Models.IPersonData {
        referenceSequences: string[];
        documentIds: string[];
        environmentUrl?: string;
    }

    interface StudyEnrollmentTimestamp {
        timestamp: Date;
        newEnrollmentState: Enums.StudyEnrollementState;
    }

    export namespace Services {
        interface AllServiceAudience extends Models.Services.ServiceAudience {
            
        }
    
        interface BooleanServiceParameter extends Models.Services.ServiceParameter {
            
        }
    
        interface BooleanServiceParameterResponse extends Models.Services.ServiceParameterResponse {
            isTrue: boolean;
        }
    
        interface DiagnosticTestDefinition extends Models.Services.ServiceDefinition {
            testCodeLoinc: string;
            testCodeLocal: string;
            category: string;
            scaleType: Enums.DiagnosticTestScaleType;
        }
    
        interface NumberServiceParameter extends Models.Services.ServiceParameter {
            value: number;
            lowerLimit?: number | null;
            upperLimit?: number | null;
        }
    
        interface NumberServiceParameterResponse extends Models.Services.ServiceParameterResponse {
            value: number;
        }
    
        interface OptionsServiceParameter extends Models.Services.ServiceParameter {
            options: string[];
        }
    
        interface OptionsServiceParameterResponse extends Models.Services.ServiceParameterResponse {
            selectedOption: string;
        }
    
        interface PatientServiceParameter extends Models.Services.ServiceParameter {
            
        }
    
        interface PatientServiceParameterResponse extends Models.Services.ServiceParameterResponse {
            patient: Models.Person;
        }
    
        interface PersonServiceAudience extends Models.Services.ServiceAudience {
            personId: string;
        }
    
        interface QuantitativeDiagnosticTestDefinition extends Models.Services.DiagnosticTestDefinition {
            unit: string;
            referenceRangeStart: number;
            referenceRangeEnd: number;
        }
    
        interface RoleServiceAudience extends Models.Services.ServiceAudience {
            roleId: string;
        }
    
        interface ServiceAudience {
            type: Enums.ServiceAudienceType;
        }
    
        interface ServiceDefinition extends Models.IId, Models.IHasTranslations {
            description: string;
            parameters: Models.Services.ServiceParameter[];
            audience: Models.Services.ServiceAudience[];
            departmentId: string;
            autoAcceptRequests: boolean;
            isAvailable: boolean;
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
            service: Models.Services.ServiceDefinition;
            requester: string;
            parameterResponses: { [key: string]: Models.Services.ServiceParameterResponse };
            requesterNote: string;
            state: Enums.ServiceRequestState;
            timestamps: Models.Services.ServiceRequestStateChange[];
            assignedTo?: string;
            handlerNote: string;
        }
    
        interface ServiceRequestStateChange {
            newState: Enums.ServiceRequestState;
            timestamp: Date;
        }
    
        interface TextServiceParameter extends Models.Services.ServiceParameter {
            value: string;
        }
    
        interface TextServiceParameterResponse extends Models.Services.ServiceParameterResponse {
            value: string;
        }
    }

    export namespace Procedures {
        interface MedicalProcedure extends Models.IHealthRecordEntry {
            snomedCtCode: string;
            snomedCtName: string;
            note: string;
        }
    
        interface MedicalProcedureDefinition extends Models.Services.ServiceDefinition {
            snomedCtCode: string;
            localCode: string;
        }
    }

    export namespace Observations {
        interface BloodPressureObservation extends Models.Observations.Observation {
            systolic: number;
            diastolic: number;
        }
    
        interface GenericObservation extends Models.Observations.Observation {
            value: string;
            unit?: string;
        }
    
        interface Observation extends Models.IHealthRecordEntry {
            measurementType: string;
        }
    
        interface PulseObservation extends Models.Observations.Observation {
            bpm: number;
            location?: string;
        }
    
        interface TemperatureObservation extends Models.Observations.Observation {
            value: number;
            unit: string;
            bodyPart?: string;
        }
    }

    export namespace Medication {
        interface Drug extends Models.IId {
            type: Enums.DrugType;
            brand: string;
            productName: string;
            activeIngredients: string[];
            dispensionForm: string;
            amountUnit: string;
            amountValue: number;
            applicationSite: string;
        }
    
        interface Immunization extends Models.Medication.MedicationDispension {
            batchNumber?: string;
        }
    
        interface MedicationDispension extends Models.IHealthRecordEntry {
            drug: Models.Medication.Drug;
            unit: string;
            value: number;
            state: Enums.MedicationDispensionState;
            note?: string;
            administeredBy?: string;
        }
    
        interface MedicationDosage {
            value: number;
            unit: string;
        }
    
        interface MedicationSchedule extends Models.IPersonData {
            name?: string;
            items: Models.Medication.MedicationScheduleItem[];
            note: string;
            isPaused: boolean;
            isDispendedByPatient: boolean;
            isActive: boolean;
        }
    
        interface MedicationScheduleItem extends Models.IId {
            drug: Models.Medication.Drug;
            plannedDispensions: Models.Medication.MedicationDispension[];
            pattern?: Models.Medication.MedicationSchedulePattern;
            instructions?: Models.Medication.MedicationAdministrationInstructions;
            note: string;
            isPaused: boolean;
            isDispendedByPatient: boolean;
        }
    
        interface MedicationAdministrationInstructions {
            inConjunctionWithMeal: boolean;
        }
    
        interface MedicationSchedulePattern {
            patternType: Enums.MedicationSchedulePatternType;
            unit?: string;
            morning: number;
            noon: number;
            evening: number;
            night: number;
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
            accountId: string;
            abbreviation: string;
            fullText: string;
        }
    
        interface TextMedicalTextPart extends Models.MedicalTextEditor.MedicalTextPart {
            text: string;
        }
    }

    export namespace Interview {
        interface Question extends Models.IId {
            language: string;
            isRequired: boolean;
            title: string;
            text: string;
            responseType: Enums.QuestionResponseType;
            options: string[];
            unit: string;
        }
    
        interface QuestionAnswer {
            question: Models.Interview.Question;
            answer: string;
        }
    
        interface Questionnaire extends Models.IId {
            language: Enums.Language;
            title: string;
            description: string;
            questions: Models.Interview.Question[];
        }
    
        interface QuestionnaireAnswers extends Models.IHealthRecordEntry {
            questionnaireId: string;
            createdTimestamp: Date;
            answers: Models.Interview.QuestionAnswer[];
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
    
        interface IcdEntry extends Models.Icd.IIcdEntry, Models.IHasTranslations {
            
        }
    
        interface IIcdEntry {
            version: string;
            name: string;
            translations: { [key: Enums.Language]: string };
            subEntries: Models.Icd.IcdEntry[];
        }
    
        export namespace Annotation {
            interface Disease extends Models.IId {
                icd11Code: string;
                icd10Code?: string;
                name: string;
                editLock?: Models.Icd.Annotation.DiseaseLock;
                categoryIcdCode: string;
                affectedBodyStructures: Models.Icd.Annotation.Symptoms.BodyStructure[];
                symptoms: Models.Icd.Annotation.Symptoms.Symptom[];
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
        
            export namespace Symptoms {
                interface BodyStructure extends Models.IId {
                    icdCode: string;
                    name: string;
                    categoryIcdCode: string;
                }
            
                interface LocalizedSymptom extends Models.Icd.Annotation.Symptoms.Symptom {
                    bodyStructures: Models.Icd.Annotation.Symptoms.BodyStructure[];
                }
            
                interface Symptom extends Models.IId {
                    type: Enums.SymptomType;
                    name: string;
                }
            
                interface SystemicSymptom extends Models.Icd.Annotation.Symptoms.Symptom {
                    
                }
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
                    bodyStructure?: Models.Icd.Annotation.Symptoms.BodyStructure;
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
    
        interface TranslationsExtensions {
            
        }
    }

    export namespace DiagnosticTestResults {
        interface DiagnosticTestResult extends Models.DiagnosticTestResults.IDiagnosticTestResult {
            testCategory: string;
        }
    
        interface DocumentDiagnosticTestResult extends Models.DiagnosticTestResults.DiagnosticTestResult {
            documentId: string;
        }
    
        interface FreetextDiagnosticTestResult extends Models.DiagnosticTestResults.DiagnosticTestResult {
            text: string;
        }
    
        interface IDiagnosticTestResult extends Models.IHealthRecordEntry {
            testCodeLoinc: string;
            testCodeLocal?: string;
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
            unit?: string;
            referenceRangeStart?: number;
            referenceRangeEnd?: number;
        }
    
        interface SetDiagnosticTestResult extends Models.DiagnosticTestResults.DiagnosticTestResult {
            
        }
    }

    export namespace Diagnoses {
        interface Diagnosis extends Models.IHealthRecordEntry {
            icd10Code?: string;
            icd11Code: string;
            hasResolved: boolean;
            resolvedTimestamp?: Date | null;
        }
    }

    export namespace AccessControl {
        interface DateAccessFilter extends Models.AccessControl.IAccessFilter {
            startDate?: Date | null;
            endDate?: Date | null;
        }
    
        interface EmergencyAccess extends Models.AccessControl.ISharedAccess {
            token?: string;
        }
    
        interface EmergencyAccessRequest extends Models.IId {
            type: Enums.SharedAccessType;
            accessReceiverUsername: string;
            sharerPersonId?: string;
            emergencyToken?: string;
            createdTimestamp: Date;
            isCompleted: boolean;
            completedTimestamp?: Date | null;
            targetPersonFirstName?: string;
            targetPersonLastName?: string;
            targetPersonBirthdate?: Date;
        }
    
        interface HealthProfessionalAccess extends Models.AccessControl.ISharedAccess {
            
        }
    
        interface HealthProfessionalAccessInvite extends Models.AccessControl.IAccessRequest {
            expirationDuration: string;
            codeForSharer: string;
            codeForHealthProfessional: string;
            sharerHasAccepted: boolean;
            sharerHasAcceptedTimestamp?: Date | null;
            healthProfessionalHasAccepted: boolean;
            healthProfessionalHasAcceptedTimestamp?: Date | null;
            isRejected: boolean;
            rejectedTimestamp?: Date | null;
        }
    
        interface IAccessFilter {
            type: Enums.AccessFilterType;
        }
    
        interface CategoryAccessFilter extends Models.AccessControl.IAccessFilter {
            categories: Enums.PatientInformationCategory[];
        }
    
        interface IAccessRequest extends Models.IId {
            type: Enums.SharedAccessType;
            permissions: Enums.AccessPermissions[];
            accessReceiverUsername: string;
            sharerPersonId: string;
            createdTimestamp: Date;
            isCompleted: boolean;
            completedTimestamp?: Date | null;
            isRevoked: boolean;
            revokedTimestamp?: Date | null;
        }
    
        interface ISharedAccess extends Models.IId {
            type: Enums.SharedAccessType;
            permissions: Enums.AccessPermissions[];
            accessReceiverAccountId?: string;
            sharerPersonId: string;
            accessGrantedTimestamp: Date;
            accessEndTimestamp?: Date | null;
            isRevoked: boolean;
        }
    }

    export namespace Subscriptions {
        interface BedOccupancyNotification extends Models.Subscriptions.NotificationBase {
            bedOccupancy: Models.BedOccupancy;
        }
    
        interface ConsumableOrderSubscription extends Models.Subscriptions.SubscriptionBase {
            orderId: string;
        }
    
        interface DepartmentSubscription extends Models.Subscriptions.SubscriptionBase {
            departmentId: string;
        }
    
        interface InstitutionSubscription extends Models.Subscriptions.SubscriptionBase {
            institutionId: string;
        }
    
        interface ResourceSubscription extends Models.Subscriptions.SubscriptionBase {
            resourceId: string;
        }
    
        interface ServiceNotification extends Models.Subscriptions.NotificationBase {
            service: Models.Services.ServiceDefinition;
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
    
        interface INotification extends Models.IId {
            notificationType: string;
            subscription: Models.Subscriptions.SubscriptionBase;
            isDismissed: boolean;
            submitter: string;
            timestamp: Date;
        }
    
        interface MedicationScheduleNotification extends Models.Subscriptions.NotificationBase {
            patient: Models.Person;
            scheduleId: string;
            storageOperation: Enums.StorageOperation;
        }
    
        interface NotificationBase extends Models.Subscriptions.INotification {
            
        }
    
        interface PatientEventNotification extends Models.Subscriptions.NotificationBase {
            patient: Models.Person;
            eventType: Enums.HealthRecordEntryType;
            objectId: string;
            storageOperation: Enums.StorageOperation;
        }
    
        interface PatientSubscription extends Models.Subscriptions.SubscriptionBase {
            personId: string;
            cancelSubscriptionOnDischarge: boolean;
        }
    
        interface SubscriptionBase extends Models.IId {
            accountId: string;
            mutedUntil?: Date | null;
            type: string;
        }
    }

    export namespace RequestBodies {
        interface MenschIdChallengeAnswer {
            challengeId: string;
            secret: string;
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
