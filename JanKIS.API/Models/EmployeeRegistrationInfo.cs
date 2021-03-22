using System;

namespace JanKIS.API.Models
{
    public class EmployeeRegistrationInfo : Person
    {
        public EmployeeRegistrationInfo(
            string id,
            string firstName,
            string lastName,
            DateTime birthDate,
            string institutionId,
            string password)
            : base(id, firstName, lastName, birthDate)
        {
            InstitutionId = institutionId;
            Password = password;
        }

        public string Password { get; set; }
        public string InstitutionId { get; set; }
    }
}
