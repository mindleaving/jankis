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
export enum Language {
    ab = "ab",
    aa = "aa",
    af = "af",
    ak = "ak",
    sq = "sq",
    am = "am",
    ar = "ar",
    an = "an",
    hy = "hy",
    as = "as",
    av = "av",
    ae = "ae",
    ay = "ay",
    az = "az",
    bm = "bm",
    ba = "ba",
    eu = "eu",
    be = "be",
    bn = "bn",
    bi = "bi",
    bs = "bs",
    br = "br",
    bg = "bg",
    my = "my",
    ca = "ca",
    ch = "ch",
    ce = "ce",
    ny = "ny",
    zh = "zh",
    cu = "cu",
    cv = "cv",
    kw = "kw",
    co = "co",
    cr = "cr",
    hr = "hr",
    cs = "cs",
    da = "da",
    dv = "dv",
    nl = "nl",
    dz = "dz",
    en = "en",
    eo = "eo",
    et = "et",
    ee = "ee",
    fo = "fo",
    fj = "fj",
    fi = "fi",
    fr = "fr",
    fy = "fy",
    ff = "ff",
    gd = "gd",
    gl = "gl",
    lg = "lg",
    ka = "ka",
    de = "de",
    el = "el",
    kl = "kl",
    gn = "gn",
    gu = "gu",
    ht = "ht",
    ha = "ha",
    he = "he",
    hz = "hz",
    hi = "hi",
    ho = "ho",
    hu = "hu",
    is = "is",
    io = "io",
    ig = "ig",
    id = "id",
    ia = "ia",
    ie = "ie",
    iu = "iu",
    ik = "ik",
    ga = "ga",
    it = "it",
    ja = "ja",
    jv = "jv",
    kn = "kn",
    kr = "kr",
    ks = "ks",
    kk = "kk",
    km = "km",
    ki = "ki",
    rw = "rw",
    ky = "ky",
    kv = "kv",
    kg = "kg",
    ko = "ko",
    kj = "kj",
    ku = "ku",
    lo = "lo",
    la = "la",
    lv = "lv",
    li = "li",
    ln = "ln",
    lt = "lt",
    lu = "lu",
    lb = "lb",
    mk = "mk",
    mg = "mg",
    ms = "ms",
    ml = "ml",
    mt = "mt",
    gv = "gv",
    mi = "mi",
    mr = "mr",
    mh = "mh",
    mn = "mn",
    na = "na",
    nv = "nv",
    nd = "nd",
    nr = "nr",
    ng = "ng",
    ne = "ne",
    no = "no",
    nb = "nb",
    nn = "nn",
    ii = "ii",
    oc = "oc",
    oj = "oj",
    or = "or",
    om = "om",
    os = "os",
    pi = "pi",
    ps = "ps",
    fa = "fa",
    pl = "pl",
    pt = "pt",
    pa = "pa",
    qu = "qu",
    ro = "ro",
    rm = "rm",
    rn = "rn",
    ru = "ru",
    se = "se",
    sm = "sm",
    sg = "sg",
    sa = "sa",
    sc = "sc",
    sr = "sr",
    sn = "sn",
    sd = "sd",
    si = "si",
    sk = "sk",
    sl = "sl",
    so = "so",
    st = "st",
    es = "es",
    su = "su",
    sw = "sw",
    ss = "ss",
    sv = "sv",
    tl = "tl",
    ty = "ty",
    tg = "tg",
    ta = "ta",
    tt = "tt",
    te = "te",
    th = "th",
    bo = "bo",
    ti = "ti",
    to = "to",
    ts = "ts",
    tn = "tn",
    tr = "tr",
    tk = "tk",
    tw = "tw",
    ug = "ug",
    uk = "uk",
    ur = "ur",
    uz = "uz",
    ve = "ve",
    vi = "vi",
    vo = "vo",
    wa = "wa",
    cy = "cy",
    wo = "wo",
    xh = "xh",
    yi = "yi",
    yo = "yo",
    za = "za",
    zu = "zu"
}
export enum QuestionResponseType {
    FreeText = "FreeText",
    SingleChoice = "SingleChoice",
    MultipleChoice = "MultipleChoice",
    Number = "Number",
    Date = "Date",
    Time = "Time",
    DateTime = "DateTime",
    TrueFalse = "TrueFalse"
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
    Unknown = "Unknown",
    HealthProfessional = "HealthProfessional",
    Emergency = "Emergency"
}
export enum AccountType {
    Patient = "Patient",
    Employee = "Employee"
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
export enum InstitutionLocationType {
    Room = "Room",
    Department = "Department",
    External = "External"
}
export enum MaterialType {
    Consumable = "Consumable",
    Resource = "Resource"
}
export enum MealState {
    Ordered = "Ordered",
    InPreparation = "InPreparation",
    DeliveredToWard = "DeliveredToWard",
    DeliveredToPatient = "DeliveredToPatient",
    Cancelled = "Cancelled",
    Discarded = "Discarded"
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
    PartiallyDelivered = "PartiallyDelivered",
    CancelledByRequester = "CancelledByRequester"
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
export enum StorageOperation {
    Created = "Created",
    Changed = "Changed"
}
export enum NotificationType {
    NewPatientEvent = "NewPatientEvent",
    NewService = "NewService",
    NewServiceRequest = "NewServiceRequest",
    ServiceRequestStateChange = "ServiceRequestStateChange",
    NewAdmission = "NewAdmission",
    NewBedOccupancy = "NewBedOccupancy"
}
export enum SubscriptionObjectType {
    Patient = "Patient",
    Service = "Service",
    ServiceRequest = "ServiceRequest",
    Stock = "Stock",
    Resource = "Resource",
    Department = "Department",
    Institution = "Institution",
    ConsumableOrder = "ConsumableOrder"
}
export enum AuthenticationErrorType {
    Ok = "Ok",
    UserNotFound = "UserNotFound",
    InvalidPassword = "InvalidPassword",
    AuthenticationMethodNotAvailable = "AuthenticationMethodNotAvailable"
}