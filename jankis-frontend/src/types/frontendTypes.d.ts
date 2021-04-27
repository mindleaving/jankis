export interface PersonsFilter {
    searchText?: string;
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
    serviceId?: string;
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
export interface DrugsFilter {
    searchText?: string;
}
export interface StocksFilter {
    searchText?: string;
}
export interface ConsumablesFilter {
    searchText?: string;
}
export interface ResourcessFilter {
    searchText?: string;
}

interface PatientParams {
    patientId?: string;
}