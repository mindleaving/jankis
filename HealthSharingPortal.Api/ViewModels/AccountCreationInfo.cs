using System.ComponentModel.DataAnnotations;
using HealthSharingPortal.Api.Models;

namespace HealthSharingPortal.Api.ViewModels
{
    public class AccountCreationInfo
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string PersonId { get; set; }
        [Required]
        public AccountType AccountType { get; set; }
    }
}
