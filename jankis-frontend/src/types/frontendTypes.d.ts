export enum OrderDirection {
    Ascending = "asc",
    Descending = "desc"
}

export interface ContactsListFilter {
    searchText?: string;
    departmentId?: string;
}