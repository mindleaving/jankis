using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.ViewModels
{
    public interface IUserViewModel
    {
        Person ProfileData { get; }
        string AccountType { get; }
        string AccountId { get; }
        Language PreferedLanguage { get; }
    }
}