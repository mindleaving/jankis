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

    interface Admission {
        id: string;
        patientId: string;
        profileData: Models.Person;
        isReadmission: boolean;
        admissionTime: Date;
        dischargeTime?: Date | null;
        contactPersons: Models.Contact[];
    }

    interface Constants {
        
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

    interface HealthInsurance {
        insurerName: string;
        insurerNumber: string;
        insuranceNumber: string;
    }

    interface IId {
        id: string;
    }

    interface Institution {
        id: string;
        name: string;
        roomIds: string[];
        departmentIds: string[];
    }

    interface IPatientEvent {
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
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

    interface Person {
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
        sex: Enums.Sex;
        addresses: Models.Address[];
        healthInsurance?: Models.HealthInsurance;
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

    interface InstitutionPolicy {
        id: string;
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

    interface PatientAccount {
        accountType: Enums.AccountType;
        id: string;
        personId: string;
        username: string;
        isPasswordChangeRequired: boolean;
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

    interface PersonServiceAudience {
        type: Enums.ServiceAudienceType;
        personId: string;
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

    export namespace Symptoms {
        interface BodyStructure {
            id: string;
            icdCode: string;
            name: string;
            categoryIcdCode: string;
        }
    
        interface LocalizedSymptom {
            bodyStructures: Models.Symptoms.BodyStructure[];
            id: string;
            type: Enums.SymptomType;
            name: string;
        }
    
        interface Symptom {
            id: string;
            type: Enums.SymptomType;
            name: string;
        }
    
        interface SystemicSymptom {
            id: string;
            type: Enums.SymptomType;
            name: string;
        }
    }

    export namespace Observations {
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
    
        interface Observation {
            measurementType: string;
            id: string;
            type: Enums.PatientEventType;
            patientId: string;
            admissionId?: string;
            createdBy: string;
            timestamp: Date;
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
    }

    export namespace Medication {
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
    
        interface MedicationDispension {
            id: string;
            type: Enums.PatientEventType;
            patientId: string;
            admissionId?: string;
            createdBy: string;
            timestamp: Date;
            drug: Models.Medication.Drug;
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
            items: Models.Medication.MedicationScheduleItem[];
            note: string;
            isPaused: boolean;
            isDispendedByPatient: boolean;
        }
    
        interface MedicationScheduleItem {
            id: string;
            drug: Models.Medication.Drug;
            dispensions: Models.Medication.MedicationDispension[];
            note: string;
            isPaused: boolean;
            isDispendedByPatient: boolean;
        }
    }

    export namespace MedicalTextEditor {
        interface AbbreviationMedicalTextPart {
            type: Enums.MedicalTextPartType;
            abbreviation: string;
            fullText: string;
        }
    
        interface DiseaseMedicalTextPart {
            type: Enums.MedicalTextPartType;
            icd11Code: string;
        }
    
        interface MedicalText {
            id: string;
            title: string;
            author: Models.Person;
            recipient: Models.Contact;
            parts: Models.MedicalTextEditor.MedicalTextPart[];
        }
    
        interface MedicalTextPart {
            type: Enums.MedicalTextPartType;
        }
    
        interface PersonalizedAbbreviation {
            id: string;
            username: string;
            abbreviation: string;
            fullText: string;
        }
    
        interface TextMedicalTextPart {
            type: Enums.MedicalTextPartType;
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
        interface IcdBlock {
            name: string;
            subEntries: Models.Icd.IcdEntry[];
        }
    
        interface IcdCategory {
            id: string;
            code: string;
            name: string;
            subEntries: Models.Icd.IcdEntry[];
        }
    
        interface IcdChapter {
            id: string;
            name: string;
            subEntries: Models.Icd.IcdEntry[];
        }
    
        interface IcdEntry {
            name: string;
            subEntries: Models.Icd.IcdEntry[];
        }
    
        interface IIcdEntry {
            name: string;
            subEntries: Models.Icd.IcdEntry[];
        }
    
        export namespace Annotation {
            interface Disease {
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
        
            interface InfectiousDisease {
                pathogens: Models.Icd.Annotation.Epidemiology.Microb[];
                hosts: Models.Icd.Annotation.Epidemiology.DiseaseHost[];
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
        
            export namespace Epidemiology {
                interface DiseaseEpidemiology {
                    incidenceDataPoints: Models.Icd.Annotation.Epidemiology.IncidenceDataPoint[];
                    prevalenceDataPoints: Models.Icd.Annotation.Epidemiology.PrevalenceDataPoint[];
                    mortalityDataPoints: Models.Icd.Annotation.Epidemiology.MortalityDataPoint[];
                }
            
                interface DiseaseHost {
                    id: string;
                    name: string;
                }
            
                interface ILocation {
                    type: Enums.LocationType;
                    name: string;
                    coordinate: MongoDB.Driver.GeoJsonObjectModel.GeoJson2DGeographicCoordinates;
                }
            
                interface IncidenceDataPoint {
                    id: string;
                    incidence: number;
                    location: Models.Icd.Annotation.Epidemiology.Location;
                    timeOfYear?: Enums.TimeOfYear[];
                    sex?: Enums.Sex | null;
                    ageRange?: Commons.Mathematics.Range<number>;
                    preexistingCondition?: string;
                }
            
                interface Location {
                    id: string;
                    type: Enums.LocationType;
                    name: string;
                    country: string;
                    countryCode: string;
                    coordinate: MongoDB.Driver.GeoJsonObjectModel.GeoJson2DGeographicCoordinates;
                }
            
                interface Microb {
                    icdCode: string;
                    type: Enums.MicrobType;
                    name: string;
                    categoryIcdCode: string;
                }
            
                interface MortalityDataPoint {
                    id: string;
                    mortality: number;
                    yearsAfterDiagnosis: number;
                    sex?: Enums.Sex | null;
                    ageRange?: Commons.Mathematics.Range<number>;
                }
            
                interface PrevalenceDataPoint {
                    id: string;
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
                interface DiagnosticCriteria {
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                    scaleType: Enums.DiagnosticTestScaleType;
                }
            
                interface DiagnosticTest {
                    id: string;
                    loincCode: string;
                    name: string;
                    description: string;
                    scaleType: Enums.DiagnosticTestScaleType;
                    bodyStructure: string;
                    methodType: string;
                    category: string;
                    timeAspect: string;
                    measuredProperty: string;
                    formula: string;
                }
            
                interface DocumentDiagnosticCriteria {
                    scaleType: Enums.DiagnosticTestScaleType;
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                }
            
                interface FreetextDiagnosticCriteria {
                    scaleType: Enums.DiagnosticTestScaleType;
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                }
            
                interface IDiagnosticCriteria {
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                    scaleType: Enums.DiagnosticTestScaleType;
                }
            
                interface IDiagnosticTest {
                    loincCode: string;
                    name: string;
                    scaleType: Enums.DiagnosticTestScaleType;
                }
            
                interface NominalDiagnosticCriteria {
                    scaleType: Enums.DiagnosticTestScaleType;
                    expectedResponses: string[];
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                }
            
                interface Observation {
                    id: string;
                    name: string;
                    bodyStructure?: Models.Symptoms.BodyStructure;
                }
            
                interface OrdinalDiagnosticCriteria {
                    scaleType: Enums.DiagnosticTestScaleType;
                    expectedResponses: string[];
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                }
            
                interface OrdinalQuantativeDiagnosticCriteria {
                    scaleType: Enums.DiagnosticTestScaleType;
                    expectedResponses: string[];
                    rangeStart?: math.Unit;
                    rangeEnd?: math.Unit;
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                }
            
                interface QuantativeDiagnosticCriteria {
                    scaleType: Enums.DiagnosticTestScaleType;
                    rangeStart?: math.Unit;
                    rangeEnd?: math.Unit;
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                }
            
                interface SetDiagnosticCriteria {
                    scaleType: Enums.DiagnosticTestScaleType;
                    expectedResponses: string[];
                    diagnosticTestLoincCode: string;
                    diagnosticTestName: string;
                }
            }
        }
    }

    export namespace Extensions {
        interface JObjectExtensions {
            
        }
    }

    export namespace DiagnosticTestResults {
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
    
        interface IDiagnosticTestResult {
            testCodeLoinc: string;
            testCodeLocal: string;
            testName: string;
            scaleType: Enums.DiagnosticTestScaleType;
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
    }

    export namespace Converters {
        interface DiagnosticCriteriaJsonConverter {
            canWrite: boolean;
            canRead: boolean;
        }
    
        interface DiagnosticTestResultJsonConverter {
            canWrite: boolean;
            canRead: boolean;
        }
    
        interface DiseaseJsonConverter {
            canWrite: boolean;
            canRead: boolean;
        }
    
        interface ObservationsJsonConverter {
            canWrite: boolean;
            canRead: boolean;
        }
    
        interface SymptomJsonConverter {
            canWrite: boolean;
            canRead: boolean;
        }
    }

    export namespace Attributes {
        interface OfferAutocompleteAttribute {
            context: string;
            typeId: any;
        }
    }

    export namespace AccessControl {
        interface DateAccessFilter {
            type: Enums.AccessFilterType;
            startDate?: Date | null;
            endDate?: Date | null;
        }
    
        interface EmergencyAccess {
            id: string;
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            accessGrantedTimestamp: Date;
            accessEndTimestamp?: Date | null;
            isRevoked: boolean;
        }
    
        interface EmergencyAccessRequest {
            id: string;
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            createdTimestamp: Date;
            isCompleted: boolean;
            completedTimestamp?: Date | null;
            targetPersonFirstName: string;
            targetPersonLastName: string;
            targetPersonBirthdate: Date;
        }
    
        interface HealthProfessionalAccess {
            id: string;
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            accessGrantedTimestamp: Date;
            accessEndTimestamp?: Date | null;
            isRevoked: boolean;
        }
    
        interface HealthProfessionalAccessRequest {
            id: string;
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            createdTimestamp: Date;
            isCompleted: boolean;
            completedTimestamp?: Date | null;
        }
    
        interface IAccessFilter {
            type: Enums.AccessFilterType;
        }
    
        interface CategoryAccessFilter {
            type: Enums.AccessFilterType;
            categories: Enums.PatientInformationCategory[];
        }
    
        interface IAccessRequest {
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            createdTimestamp: Date;
            isCompleted: boolean;
            completedTimestamp?: Date | null;
        }
    
        interface ISharedAccess {
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            accessGrantedTimestamp: Date;
            accessEndTimestamp?: Date | null;
            isRevoked: boolean;
        }
    
        interface ResearchAccess {
            id: string;
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            studyId: string;
            accessFilters: Models.AccessControl.IAccessFilter[];
            accessGrantedTimestamp: Date;
            accessEndTimestamp?: Date | null;
            isRevoked: boolean;
        }
    
        interface ResearchAccessRequest {
            id: string;
            type: Enums.SharedAccessType;
            requesterId: string;
            targetPersonId: string;
            createdTimestamp: Date;
            isCompleted: boolean;
            completedTimestamp?: Date | null;
            studyId: string;
            accessFilters: Models.AccessControl.IAccessFilter[];
        }
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
export namespace MongoDB {
    export namespace Driver {
        export namespace GeoJsonObjectModel {
            interface GeoJson2DGeographicCoordinates {
                values: number[];
                longitude: number;
                latitude: number;
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
