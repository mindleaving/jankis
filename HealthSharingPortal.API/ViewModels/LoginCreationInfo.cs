using System.ComponentModel.DataAnnotations;

namespace HealthSharingPortal.API.ViewModels
{
    public class LoginCreationInfo
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; }
        [Required]
        [MinLength(8)]
        public string Password { get; set; }
    }
}
