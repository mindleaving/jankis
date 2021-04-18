export enum OrderDirection {
    Ascending = "asc",
    Descending = "desc"
}

export interface ContactsListFilter {
    searchText?: string;
    departmentId?: string;
}
export interface ServicesFilter {
    searchText?: string;
    departmentId?: string;
}
export interface ServiceRequestsFilter {
    searchText?: string;
    departmentId?: string;
}
export interface DepartmentsFilter {
    searchText?: string;
}
export interface AccountsFilter {
    searchText?: string;
}
export interface AdmissionsFilter {
    searchText?: string;
}

interface PatientParams {
    patientId?: string;
}