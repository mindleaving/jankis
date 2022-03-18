using System;
using System.Collections.Generic;
using HealthModels;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class AttachedEquipment : IHealthRecordEntry
    {
        public AttachedEquipment(
            string id,
            string personId,
            string createdBy,
            string equipmentType,
            List<MaterialReference> materials,
            DateTime attachmentTime,
            DateTime? detachmentTime)
        {
            Id = id;
            PersonId = personId;
            CreatedBy = createdBy;
            Timestamp = attachmentTime;
            EquipmentType = equipmentType;
            Materials = materials ?? new List<MaterialReference>();
            DetachmentTime = detachmentTime;
        }

        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Equipment;
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }

        public string EquipmentType { get; set; }
        public List<MaterialReference> Materials { get; set; }
        public DateTime AttachmentTime => Timestamp;
        [TypescriptIsOptional]
        public DateTime? DetachmentTime { get; set; }
    }
}