using System;

namespace JanKIS.API.Models
{
    public class AttachedEquipment
    {
        public MedicalEquipment Equipment { get; set; }
        public DateTime AttachmentTime { get; set; }
        public DateTime? DetachmentTime { get; set; }
    }
}