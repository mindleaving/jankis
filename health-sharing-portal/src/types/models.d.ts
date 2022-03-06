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

    interface Observation {
        measurementType: string;
        id: string;
        type: Enums.PatientEventType;
        patientId: string;
        admissionId?: string;
        createdBy: string;
        timestamp: Date;
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

    interface Author {
        orcId: string;
        organizations: string[];
        id: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
        sex: Enums.Sex;
        addresses: Models.Address[];
        healthInsurance?: Models.HealthInsurance;
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

    interface Study {
        id: string;
        title: string;
        description: string;
        contactPersons: Models.Contact[];
    }

    interface StudyParticipation {
        studyId: string;
        personId: string;
    }

    interface UserProfile {
        role: Enums.UserRole;
        username: string;
        personId: string;
    }

    export namespace Converters {
        interface DiagnosticTestResultJsonConverter {
            canWrite: boolean;
            canRead: boolean;
        }
    
        interface ObservationsJsonConverter {
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
}
