using System.ComponentModel.DataAnnotations;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
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
