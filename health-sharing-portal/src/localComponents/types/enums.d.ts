export enum AddressRole {
    Primary = "Primary",
    Secondary = "Secondary",
    Temporary = "Temporary"
}
export enum HealthRecordEntryType {
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
export enum AccountType {
    Sharer = "Sharer",
    HealthProfessional = "HealthProfessional",
    Researcher = "Researcher",
    Admin = "Admin"
}
export enum AuthenticationErrorType {
    Ok = "Ok",
    UserNotFound = "UserNotFound",
    InvalidPassword = "InvalidPassword",
    AuthenticationMethodNotAvailable = "AuthenticationMethodNotAvailable"
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
export enum StudyEnrollementState {
    Undefined = "Undefined",
    ParticipationOffered = "ParticipationOffered",
    Eligible = "Eligible",
    Enrolled = "Enrolled",
    Excluded = "Excluded",
    Rejected = "Rejected",
    Left = "Left"
}
export enum StudyStaffRole {
    Undefined = "Undefined",
    Investigator = "Investigator"
}
