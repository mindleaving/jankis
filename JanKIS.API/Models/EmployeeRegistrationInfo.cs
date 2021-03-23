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
            string institutionId)
            : base(id, firstName, lastName, birthDate)
        {
            InstitutionId = institutionId;
        }

        public string InstitutionId { get; set; }
    }
}
