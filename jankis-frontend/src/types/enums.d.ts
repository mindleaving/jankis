export enum BedState {
    Empty = "Empty",
    Occupied = "Occupied",
    Reserved = "Reserved",
    Unavailable = "Unavailable"
}
export enum OrderState {
    Ordered = "Ordered",
    Accepted = "Accepted",
    Declined = "Declined",
    Delivered = "Delivered",
    CancelledByRequester = "CancelledByRequester"
}
export enum DietaryCharacteristic {
    Vegetarian = "Vegetarian",
    Vegan = "Vegan",
    HighFiber = "HighFiber",
    LowFiber = "LowFiber",
    Soft = "Soft"
}
export enum LocationType {
    Room = "Room",
    Ward = "Ward",
    Department = "Department",
    External = "External"
}
export enum MealState {
    Ordered = "Ordered",
    InPreparation = "InPreparation",
    DeliveredToWard = "DeliveredToWard",
    DeliveredToPatient = "DeliveredToPatient",
    Cancelled = "Cancelled",
    Discarded = "Discarded"
}
export enum MedicationDispensionState {
    Scheduled = "Scheduled",
    Dispensed = "Dispensed",
    Missed = "Missed"
}
export enum Permission {
    ListEmployees = "ListEmployees",
    ViewEmployeeDetails = "ViewEmployeeDetails",
    CreateEmployees = "CreateEmployees",
    DeleteEmployees = "DeleteEmployees",
    ChangeEmployeePermissions = "ChangeEmployeePermissions",
    ResetPasswords = "ResetPasswords",
    ViewAllBedStates = "ViewAllBedStates",
    ViewWardBedStates = "ViewWardBedStates",
    ManageDepartmentServices = "ManageDepartmentServices",
    ManageDepartments = "ManageDepartments",
    ViewResources = "ViewResources",
    ModifyResources = "ModifyResources"
}
export enum PermissionModifierType {
    Grant = "Grant",
    Deny = "Deny"
}
export enum PersonType {
    Employee = "Employee",
    Patient = "Patient"
}
export enum ServiceAudienceType {
    All = "All",
    Role = "Role",
    Employee = "Employee",
    Patient = "Patient"
}
export enum ServiceParameterValueType {
    Text = "Text",
    Number = "Number",
    Patient = "Patient"
}
export enum ServiceRequestState {
    Requested = "Requested",
    CancelledByRequester = "CancelledByRequester",
    Declined = "Declined",
    Accepted = "Accepted",
    ReadyWhenYouAre = "ReadyWhenYouAre",
    InProgress = "InProgress",
    Fulfilled = "Fulfilled"
}
