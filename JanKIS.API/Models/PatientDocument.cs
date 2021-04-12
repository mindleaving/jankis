using System;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class PatientDocument : IId
    {
        public string Id { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public string Note { get; set; }
    }
}
