using System;
using System.ComponentModel.DataAnnotations;

namespace HealthModels
{
    public interface IHealthRecordEntry : IPersonData
    {
        [Required]
        HealthRecordEntryType Type { get; }
        string CreatedBy { get; set; }
        DateTime Timestamp { get; set; }
    }
}