using System;

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
        }

        public override PersonType Type => PersonType.Patient;
        public HealthInsurance HealthInsurance { get; set; }
    }
}
