using System;

namespace JanKIS.API.Models
{
    public class PatientRegistrationInfo
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public HealthInsurance HealthInsurance { get; set; }
    }
}