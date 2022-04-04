using System.ComponentModel.DataAnnotations;

namespace HealthModels
{
    public interface IPersonData : IId
    {
        [Required]
        string PersonId { get; }
    }
}
