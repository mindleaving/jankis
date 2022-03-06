using System;

namespace HealthModels.Icd.Annotation
{
    public class DiseaseLock
    {
        public string IcdCode { get; set; }
        public string User { get; set; }
        public DateTime CreatedTimestamp { get; set; }
    }
}