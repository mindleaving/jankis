export enum AddressRole {
    Primary = "Primary",
    Secondary = "Secondary",
    Temporary = "Temporary"
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
export enum MeasurementType {
    Pulse = "Pulse",
    BloodPressure = "BloodPressure",
    Temperature = "Temperature",
    OxygenSaturation = "OxygenSaturation",
    Height = "Height",
    Weight = "Weight"
}
export enum MedicationDispensionState {
    Scheduled = "Scheduled",
    Dispensed = "Dispensed",
    Missed = "Missed"
}
export enum PatientEventType {
    Observation = "Observation",
    Note = "Note",
    TestResult = "TestResult",
    Document = "Document",
    MedicationDispension = "MedicationDispension",
    Equipment = "Equipment"
}
export enum Sex {
    Male = "Male",
    Female = "Female",
    Other = "Other"
}
export enum AutoCompleteContext {
    MeasurementType = "MeasurementType",
    Unit = "Unit",
    DrugBrand = "DrugBrand",
    DrugActiveIngredient = "DrugActiveIngredient",
    DrugApplicationSite = "DrugApplicationSite",
    DrugDispensionForm = "DrugDispensionForm",
    ResourceGroup = "ResourceGroup",
    ExternalLocation = "ExternalLocation"
}
export enum OrderDirection {
    Ascending = "Ascending",
    Descending = "Descending"
}
export enum UserRole {
    Sharer = "Sharer",
    HealthProvider = "HealthProvider",
    Researcher = "Researcher",
    Moderator = "Moderator"
}
