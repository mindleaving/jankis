using System.ComponentModel.DataAnnotations;
using HealthModels;
using HealthSharingPortal.API.Models;
using TypescriptGenerator.Attributes;

namespace HealthSharingPortal.API.ViewModels
{
    public class AccountCreationInfo
    {
        [Required]
        public AccountType AccountType { get; set; }

        /// <summary>
        /// Your profile information
        /// </summary>
        [Required]
        public Person Person { get; set; }

        /// <summary>
        /// Response to mensch.ID challenge which proves that the person controls the claimed ID
        /// </summary>
        [TypescriptIsOptional]
        public string MenschIdChallengeResponse { get; set; }
        [TypescriptIsOptional]
        public string MenschIdChallengeId { get; set; }
    }
}
