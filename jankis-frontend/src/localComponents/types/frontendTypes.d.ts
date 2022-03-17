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
export interface StocksFilter {
    searchText?: string;
}
export interface ConsumablesFilter {
    searchText?: string;
}
export interface ResourcessFilter {
    searchText?: string;
}
export interface ConsumableOrdersFilter {
    searchText?: string;
    consumableId?: string;
}