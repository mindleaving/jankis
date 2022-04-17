namespace HealthSharingPortal.API.Models
{
    public enum AccountType
    {
        Undefined = 0, // For validation
        Sharer = 1,
        HealthProfessional = 2,
        Researcher = 3,
        EmergencyGuest = 4,
        Admin = 5
    }
}