using System;

namespace JanKIS.API.Models
{
    public class AdmissionInfo
    {
        public DateTime AdmissionTime { get; set; }
        public string Ward { get; set; }
        public string Room { get; set; }
        public string Bed { get; set; }
    }
}