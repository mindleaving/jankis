using System;
using System.ComponentModel.DataAnnotations;
using TypescriptGenerator.Attributes;

namespace HealthModels
{
    public interface IHealthRecordEntry : IPersonData
    {
        [Required]
        HealthRecordEntryType Type { get; }
        [Required]
        string CreatedBy { get; set; }
        [Required]
        DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        /// <summary>
        /// Hide value of health record entry by default if created by other than sharer.
        /// The sharer must unhide values (in which case the entry is marked as seen).
        /// This is done to give sharers the option to have health professionals communicate
        /// the result to them.
        /// </summary>
        public bool HasBeenSeenBySharer { get; set; }
    }
}