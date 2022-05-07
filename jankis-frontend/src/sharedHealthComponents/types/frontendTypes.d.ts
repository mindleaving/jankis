export interface DrugsFilter {
    searchText?: string;
}
export interface PersonsFilter {
    searchText?: string;
}
export interface DepartmentsFilter {
    searchText?: string;
}
export interface AdmissionsFilter {
    searchText?: string;
}
export interface HealthRecordAction {
    path: string;
    textResourceId: string;
}
export enum TestResultCategories {
    All = "All",
    Imaging = "Imaging",
    Lab = "Lab",
    Dental = "Dental",
    Pathology = "Pathology"
}
export interface HealthRecordEntryFormProps {
    personId: string;
    onStore: () => void;
}
export type MarkHealthRecordEntryAsSeenCallback = (entryType: HealthRecordEntryType, entryId: string, update: Update<Models.IHealthRecordEntry>) => void;
export type MarkHealthRecordEntryAsVerifiedCallback = (entryType: HealthRecordEntryType, entryId: string, update: Update<Models.IHealthRecordEntry>) => void;
export type DispensionStateChangeCallback = (dispensionId: string, oldState: MedicationDispensionState, newState: MedicationDispensionState) => void;