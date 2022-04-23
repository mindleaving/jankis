using System.ComponentModel.DataAnnotations;

namespace HealthSharingPortal.API.Models.RequestBodies
{
    public class MenschIdChallengeAnswer
    {
        public string ChallengeId { get; set; }
        [Required]
        public string Secret { get; set; }
    }
}
