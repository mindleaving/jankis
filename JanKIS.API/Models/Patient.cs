using System;
using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class Patient : PersonWithLogin
    {
        public Patient(
            string id,
            string firstName,
            string lastName,
            DateTime birthDate,
            HealthInsurance healthInsurance,
            string salt,
            string passwordHash)
            : base(id, firstName, lastName, birthDate, salt, passwordHash)
        {
            HealthInsurance = healthInsurance;
            ContactPersons = new List<Employee>();
            AttachedEquipment = new List<MedicalEquipment>();
        }

        public HealthInsurance HealthInsurance { get; set; }
        public AdmissionInfo AdmissionInfo { get; set; }
        public List<Employee> ContactPersons { get; }
        public List<MedicalEquipment> AttachedEquipment { get; }
    }
}
