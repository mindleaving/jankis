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