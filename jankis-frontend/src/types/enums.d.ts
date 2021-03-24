export enum BedState {
    Empty = "Empty",
    Occupied = "Occupied",
    Reserved = "Reserved",
    Unavailable = "Unavailable"
}
export enum DietaryCharacteristic {
    Vegetarian = "Vegetarian",
    Vegan = "Vegan",
    HighFiber = "HighFiber",
    LowFiber = "LowFiber",
    Soft = "Soft"
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
    ManageDepartments = "ManageDepartments"
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
    Number = "Number"
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
