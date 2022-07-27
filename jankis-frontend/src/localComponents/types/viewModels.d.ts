import { Models, MongoDB, Commons, System } from './models.d';
import * as Enums from './enums.d';

export namespace ViewModels {
    interface AccountCreationInfo {
        username: string;
        personId: string;
        accountType: Enums.AccountType;
    }

    interface AccountViewModel extends ViewModels.IViewModel<Models.Account> {
        accountId: string;
        accountType: Enums.AccountType;
        profileData: Models.Person;
        roles: Models.Role[];
        permissionModifiers: Models.PermissionModifier[];
        departments: Models.Department[];
    }

    interface AttachedEquipmentViewModel extends Models.AttachedEquipment, ViewModels.IViewModel<Models.AttachedEquipment> {
        materialViewModels: ViewModels.MaterialViewModel[];
    }

    interface ConsumableOrderViewModel extends Models.ConsumableOrder, ViewModels.IViewModel<Models.ConsumableOrder> {
        consumable: Models.Consumable;
        stockViewModels: ViewModels.StockViewModel[];
        requesterViewModel: ViewModels.AccountViewModel;
    }

    interface ConsumableViewModel extends Models.Consumable, ViewModels.IViewModel<Models.Consumable> {
        stockStateViewModels: ViewModels.StockStateViewModel[];
    }

    interface DepartmentViewModel extends Models.Department, ViewModels.IViewModel<Models.Department> {
        parentDepartment?: ViewModels.DepartmentViewModel;
    }

    interface InstitutionViewModel extends Models.Institution, ViewModels.IViewModel<Models.Institution> {
        rooms: Models.Room[];
        departments: ViewModels.DepartmentViewModel[];
    }

    interface LocationViewModel extends Models.LocationReference, ViewModels.IViewModel<Models.LocationReference> {
        department?: ViewModels.DepartmentViewModel;
        room?: Models.Room;
    }

    interface LoggedInUserViewModel extends ViewModels.IUserViewModel {
        account: Models.Account;
        authenticationResult: Models.AuthenticationResult;
        isPasswordResetRequired: boolean;
        roles: Models.Role[];
        permissions: Enums.Permission[];
        departments: Models.Department[];
    }

    interface MaterialViewModel {
        type: Enums.MaterialType;
        consumable?: Models.Consumable;
        resource?: Models.Resource;
    }

    interface PatientNursingViewModel {
        profileData: Models.Person;
        currentAdmission: Models.Admission;
        equipments: ViewModels.AttachedEquipmentViewModel[];
        observations: Models.Observations.Observation[];
    }

    interface HealthRecordViewModel extends ViewModels.HealthRecordViewModel {
        currentBedOccupancy: Models.BedOccupancy;
        subscription: Models.Subscriptions.PatientSubscription;
    }

    interface ResourceViewModel extends Models.Resource, ViewModels.IViewModel<Models.Resource> {
        locationViewModel?: ViewModels.LocationViewModel;
    }

    interface ServiceAudienceViewModel extends Models.Services.ServiceAudience, ViewModels.IViewModel<Models.Services.ServiceAudience> {
        role?: Models.Role;
        person?: Models.Person;
    }

    interface ServiceViewModel extends Models.Services.ServiceDefinition, ViewModels.IViewModel<Models.Services.ServiceDefinition> {
        department: ViewModels.DepartmentViewModel;
        audienceViewModels: ViewModels.ServiceAudienceViewModel[];
    }

    interface StockStateViewModel extends Models.StockState, ViewModels.IViewModel<Models.StockState> {
        stock: ViewModels.StockViewModel;
        audience: ViewModels.ServiceAudienceViewModel[];
    }

    interface StockViewModel extends Models.Stock, ViewModels.IViewModel<Models.Stock> {
        department: ViewModels.DepartmentViewModel;
        locationViewModel: ViewModels.LocationViewModel;
    }

    interface AccessViewModel extends ViewModels.IViewModel<Models.AccessControl.ISharedAccess> {
        sharerProfileData: Models.Person;
        access: Models.AccessControl.ISharedAccess;
        hasEmergencyToken: boolean;
    }

    interface CopyMedicationScheduleItemViewModel {
        sourceScheduleId: string;
        itemId: string;
        targetScheduleId: string;
    }

    interface DiagnosisViewModel extends Models.Diagnoses.Diagnosis, ViewModels.IViewModel<Models.Diagnoses.Diagnosis> {
        name: string;
    }

    interface DispenseMedicationViewModel {
        scheduleId: string;
        itemId: string;
        dispensionId: string;
        dispensionState: Enums.MedicationDispensionState;
        administrationTime?: Date | null;
        administeredBy: string;
        note: string;
        administeredAmount: Models.Medication.MedicationDosage;
    }

    interface GuestEmergencyAccessViewModel {
        user: ViewModels.GuestViewModel;
        accessInfo: Models.AccessControl.EmergencyAccess;
    }

    interface GuestViewModel extends ViewModels.IUserViewModel {
        authenticationResult: Models.AuthenticationResult;
    }

    interface IUserViewModel {
        profileData: Models.Person;
        accountType: string;
        accountId: string;
        preferedLanguage: Enums.Language;
    }

    interface IViewModel<T> {
        
    }

    interface LoginCreationInfo {
        username: string;
        password: string;
    }

    interface MenschIdChallengeViewModel {
        menschId: string;
        challengeId: string;
        challengeShortId: string;
    }

    interface PastMedicationViewModel {
        personId: string;
        drug: Models.Medication.Drug;
        createdBy: string;
        administeredBy?: string;
        dosage: Models.Medication.MedicationDosage;
        startTimestamp: Date;
        endTimestamp: Date;
        pattern: Models.Medication.MedicationSchedulePattern;
    }

    interface HealthRecordViewModel {
        profileData: Models.Person;
        admissions: Models.Admission[];
        notes: Models.PatientNote[];
        diagnoses: ViewModels.DiagnosisViewModel[];
        medicationSchedules: Models.Medication.MedicationSchedule[];
        medicationDispensions: Models.Medication.MedicationDispension[];
        immunizations: Models.Medication.Immunization[];
        testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
        medicalProcedures: Models.Procedures.MedicalProcedure[];
        observations: Models.Observations.Observation[];
        documents: Models.PatientDocument[];
        questionnaires: ViewModels.QuestionnaireAnswersViewModel[];
    }

    interface PersonGenomeSequencesViewModel {
        person: Models.Person;
        referenceSequences: Models.DiagnosticTestResults.NominalDiagnosticTestResult[];
        testResults: Models.DiagnosticTestResults.DocumentDiagnosticTestResult[];
        documents: Models.PatientDocument[];
        deployments: Models.GenomeExplorerDeployment[];
    }

    interface QuestionnaireAnswersViewModel extends Models.Interview.QuestionnaireAnswers, ViewModels.IViewModel<Models.Interview.QuestionnaireAnswers> {
        questionnaireTitle: string;
        questionnaireDescription: string;
        questionnaireLanguage: Enums.Language;
        questionCount: number;
        hasAnswered: boolean;
    }

    interface QuestionnaireSchema {
        questionnaireId: string;
        schema: any;
    }

    interface IViewModel<Account> {
        
    }

    interface IViewModel<AttachedEquipment> {
        
    }

    interface IViewModel<ConsumableOrder> {
        
    }

    interface IViewModel<Consumable> {
        
    }

    interface IViewModel<Department> {
        
    }

    interface IViewModel<Institution> {
        
    }

    interface IViewModel<LocationReference> {
        
    }

    interface IViewModel<Resource> {
        
    }

    interface IViewModel<ServiceAudience> {
        
    }

    interface IViewModel<ServiceDefinition> {
        
    }

    interface IViewModel<StockState> {
        
    }

    interface IViewModel<Stock> {
        
    }

    interface IViewModel<ISharedAccess> {
        
    }

    interface IViewModel<Diagnosis> {
        
    }

    interface IViewModel<QuestionnaireAnswers> {
        
    }
}
