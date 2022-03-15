export enum AddressRole {
    Primary = "Primary",
    Secondary = "Secondary",
    Temporary = "Temporary"
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
    Both = "Both",
    Male = "Male",
    Female = "Female",
    Other = "Other"
}
export enum SymptomType {
    Undefined = "Undefined",
    Localized = "Localized",
    Systemic = "Systemic"
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
export enum MedicalTextPartType {
    Text = "Text",
    Disease = "Disease",
    Abbreviation = "Abbreviation"
}
export enum QuestionResponseType {
    FreeText = "FreeText",
    SingleChoice = "SingleChoice",
    MultipleChoice = "MultipleChoice",
    Number = "Number",
    Date = "Date",
    Time = "Time",
    DateTime = "DateTime"
}
export enum IcdSectionType {
    Chapter = "Chapter",
    Block = "Block",
    Category = "Category"
}
export enum LocationType {
    Country = "Country",
    City = "City"
}
export enum MicrobType {
    Undefined = "Undefined",
    Bacteria = "Bacteria",
    Virus = "Virus",
    Fungi = "Fungi",
    Helminths = "Helminths",
    Protozoa = "Protozoa",
    LiceMites = "LiceMites",
    Other = "Other"
}
export enum RiskFactorType {
    Undefined = "Undefined",
    Disease = "Disease",
    Behavior = "Behavior"
}
export enum TimeOfYear {
    Spring = "Spring",
    Summer = "Summer",
    Autumn = "Autumn",
    Winter = "Winter"
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
export enum AccessFilterType {
    Undefined = "Undefined",
    Date = "Date",
    Category = "Category"
}
export enum PatientInformationCategory {
    Undefined = "Undefined",
    BasicInformation = "BasicInformation",
    FamilyInformation = "FamilyInformation",
    Observations = "Observations",
    AdmissionHistory = "AdmissionHistory",
    Documents = "Documents",
    Notes = "Notes",
    Medications = "Medications",
    Diagnosis = "Diagnosis",
    Genome = "Genome"
}
export enum SharedAccessType {
    Unknonw = "Unknonw",
    Research = "Research",
    HealthProfessional = "HealthProfessional",
    Emergency = "Emergency"
}
