using System;
using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class Patient : Person
    {
        public Patient(
            string id,
            string firstName,
            string lastName,
            DateTime birthDate,
            HealthInsurance healthInsurance)
            : base(id, firstName, lastName, birthDate)
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
