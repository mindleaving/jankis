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
export interface DepartmentsFilter {
    searchText?: string;
}
export interface EmployeesFilter {
    searchText?: string;
}