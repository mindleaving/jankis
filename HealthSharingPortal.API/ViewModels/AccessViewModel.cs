using HealthModels;
using HealthModels.AccessControl;

namespace HealthSharingPortal.API.ViewModels
{
    public class AccessViewModel : IViewModel<ISharedAccess>
    {
        public Person SharerProfileData { get; set; }
        public ISharedAccess Access { get; set; }
    }
}