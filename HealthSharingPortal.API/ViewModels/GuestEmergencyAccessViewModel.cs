using HealthModels.AccessControl;

namespace HealthSharingPortal.API.ViewModels
{
    public class GuestEmergencyAccessViewModel
    {
        public GuestViewModel User { get; set; }
        public EmergencyAccess AccessInfo { get; set; }
    }
}
