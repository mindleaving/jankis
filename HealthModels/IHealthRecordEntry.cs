using System;
using System.ComponentModel.DataAnnotations;

namespace HealthModels
{
    public interface IHealthRecordEntry : IId
    {
        [Required]
        HealthRecordEntryType Type { get; }
        [Required]
        string PersonId { get; set; }
        string CreatedBy { get; set; }
        DateTime Timestamp { get; set; }
    }
}