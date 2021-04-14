export enum AccountType {
    Patient = "Patient",
    Employee = "Employee"
}
export enum BedState {
    Empty = "Empty",
    Occupied = "Occupied",
    Reserved = "Reserved",
    Unavailable = "Unavailable"
}
export enum DiagnosticTestScaleType {
    Undefined = "Undefined",
    Quantitative = "Quantitative",
    Ordinal = "Ordinal",
    OrdinalOrQuantitative = "OrdinalOrQuantitative",
    Nominal = "Nominal",
    Freetext = "Freetext",
    Document = "Document",
    Set = "Set"
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
export enum OrderDirection {
    Ascending = "Ascending",
    Descending = "Descending"
}
export enum OrderState {
    Ordered = "Ordered",
    Accepted = "Accepted",
    Declined = "Declined",
    Delivered = "Delivered",
    CancelledByRequester = "CancelledByRequester"
}
export enum PatientEventType {
    Observation = "Observation",
    Note = "Note",
    Diagnostics = "Diagnostics"
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
export enum ServiceAudienceType {
    All = "All",
    Role = "Role",
    Person = "Person"
}
export enum ServiceParameterValueType {
    Text = "Text",
    Number = "Number",
    Patient = "Patient",
    Option = "Option",
    Boolean = "Boolean"
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
export enum Sex {
    Male = "Male",
    Female = "Female",
    Other = "Other"
}
export enum AuthenticationErrorType {
    Ok = "Ok",
    UserNotFound = "UserNotFound",
    InvalidPassword = "InvalidPassword",
    AuthenticationMethodNotAvailable = "AuthenticationMethodNotAvailable"
}
