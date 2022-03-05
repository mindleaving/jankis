using System;
using System.Collections.Generic;
using HealthModels;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class AttachedEquipment : IPatientEvent
    {
        public AttachedEquipment(
            string id,
            string patientId,
            string createdBy,
            string equipmentType,
            List<MaterialReference> materials,
            DateTime attachmentTime,
            DateTime? detachmentTime,
            string admissionId = null)
        {
            Id = id;
            PatientId = patientId;
            AdmissionId = admissionId;
            CreatedBy = createdBy;
            Timestamp = attachmentTime;
            EquipmentType = equipmentType;
            Materials = materials ?? new List<MaterialReference>();
            DetachmentTime = detachmentTime;
        }

        public string Id { get; set; }
        public PatientEventType Type => PatientEventType.Equipment;
        public string PatientId { get; set; }
        public string AdmissionId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }

        public string EquipmentType { get; set; }
        public List<MaterialReference> Materials { get; set; }
        public DateTime AttachmentTime => Timestamp;
        [TypescriptIsOptional]
        public DateTime? DetachmentTime { get; set; }
    }
}