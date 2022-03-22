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

    interface IHealthRecordEntry extends Models.IId {
        type: Enums.HealthRecordEntryType;
        personId: string;
        createdBy: string;
        timestamp: Date;
    }

    interface IId {
        id: string;
    }

    interface Institution extends Models.IId {
        name: string;
        roomIds: string[];
        departmentIds: string[];
    }

    interface PatientDocument extends Models.IHealthRecordEntry {
        note: string;
        fileName: string;
    }

    interface PatientNote extends Models.IHealthRecordEntry {
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

    interface Account extends Models.IId {
        personId: string;
        accountType: Enums.AccountType;
        username: string;
        isPasswordChangeRequired: boolean;
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

    interface HealthProfessionalAccount extends Models.Account {
        workAddress: Models.Address;
        canRequestEmergencyAccess: boolean;
    }

    interface Publication {
        title: string;
        abstract: string;
        authors: Models.ResearchStaff[];
        journal: string;
        publicationDate: Date;
    }

    interface ResearchStaff {
        firstName: string;
        lastName: string;
        orcId: string;
        organizations: string[];
    }

    interface Study extends Models.IId {
        title: string;
        description: string;
        publications: Models.Publication[];
        contactPersons: Models.ResearchStaff[];
        isAcceptingEnrollments: boolean;
        createdBy: string;
        inclusionCriteriaQuestionaireIds: string[];
        exclusionCriteriaQuestionaireIds: string[];
    }

    interface StudyAssociation extends Models.IId {
        username: string;
        studyId: string;
        role: Enums.StudyStaffRole;
    }

    interface StudyEnrollment extends Models.IId {
        studyId: string;
        personId: string;
        state: Enums.StudyEnrollementState;
        timestamps: Models.StudyEnrollmentTimestamp[];
        inclusionCriteriaQuestionnaireAnswers: Models.Interview.QuestionnaireAnswers[];
        exclusionCriteriaQuestionnaireAnswers: Models.Interview.QuestionnaireAnswers[];
    }

    interface StudyEnrollmentTimestamp {
        timestamp: Date;
        newEnrollmentState: Enums.StudyEnrollementState;
    }

    interface StudyEnrollmentStatistics {
        openOffers: number;
        enrolled: number;
        excluded: number;
        rejected: number;
        left: number;
    }

    interface StudyParticipation {
        studyId: string;
        personId: string;
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
    
        interface QuantitativeDiagnosticTestDefinition extends Models.Services.DiagnosticTestDefinition {
            unit: string;
            referenceRangeStart: number;
            referenceRangeEnd: number;
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
    
        interface RoleServiceAudience extends Models.Services.ServiceAudience {
            roleId: string;
        }
    
        interface ServiceAudience {
            type: Enums.ServiceAudienceType;
        }
    
        interface ServiceDefinition extends Models.IId {
            name: string;
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

    export namespace Observations {
        interface BloodPressureObservation extends Models.Observations.Observation {
            systolic: number;
            diastolic: number;
        }
    
        interface GenericObservation extends Models.Observations.Observation {
            value: string;
            unit: string;
        }
    
        interface Observation extends Models.IHealthRecordEntry {
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
    
        interface MedicationDispension extends Models.IHealthRecordEntry {
            drug: Models.Medication.Drug;
            unit: string;
            value: number;
            state: Enums.MedicationDispensionState;
            note?: string;
        }
    
        interface MedicationSchedule extends Models.IId {
            name?: string;
            personId: string;
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
    
        interface QuestionnaireAnswers extends Models.IId {
            questionnaireId: string;
            personId: string;
            timestamp: Date;
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
    
        interface IDiagnosticTestResult extends Models.IHealthRecordEntry {
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
    
        interface EmergencyAccessRequest extends Models.IId {
            type: Enums.SharedAccessType;
            accessReceiverUsername: string;
            sharerPersonId: string;
            createdTimestamp: Date;
            isCompleted: boolean;
            completedTimestamp?: Date | null;
            targetPersonFirstName: string;
            targetPersonLastName: string;
            targetPersonBirthdate: Date;
        }
    
        interface HealthProfessionalAccess extends Models.AccessControl.ISharedAccess {
            
        }
    
        interface HealthProfessionalAccessInvite extends Models.AccessControl.IAccessRequest {
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
            accessReceiverUsername: string;
            sharerPersonId: string;
            accessGrantedTimestamp: Date;
            accessEndTimestamp?: Date | null;
            isRevoked: boolean;
        }
    }

    export namespace Filters {
        interface SharedAccessFilter {
            searchText?: string;
            onlyActive?: boolean;
            startTime?: Date | null;
            endTime?: Date | null;
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
