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

    interface Author extends Models.Person {
        orcId: string;
        organizations: string[];
    }

    interface AutocompleteCacheItem {
        context: string;
        value: string;
    }

    interface AutoCompleteContextGenerator {
        
    }

    interface Publication {
        title: string;
        abstract: string;
        authors: Models.Author[];
        journal: string;
        publicationDate: Date;
    }

    interface Study extends Models.IId {
        title: string;
        description: string;
        contactPersons: Models.Contact[];
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
