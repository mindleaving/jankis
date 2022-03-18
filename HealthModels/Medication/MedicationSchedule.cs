using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TypescriptGenerator.Attributes;

namespace HealthModels.Medication
{
    public class MedicationSchedule : IId
    {
        public MedicationSchedule(
            string personId,
            string name = null)
        {
            PersonId = personId;
            Name = name;
            Items = new List<MedicationScheduleItem>();
        }

        public string Id { get; set; }
        [TypescriptIsOptional]
        public string Name { get; set; }
        [Required]
        public string PersonId { get; set; }
        public List<MedicationScheduleItem> Items { get; set; }
        public string Note { get; set; }
        public bool IsPaused { get; set; }
        public bool IsDispendedByPatient { get; set; }
    }
}