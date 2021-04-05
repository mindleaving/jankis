using System;
using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class Employee : PersonWithLogin
    {
        public Employee(string id,
            string firstName,
            string lastName,
            DateTime birthDate,
            string institutionId,
            string salt,
            string passwordHash)
            : base(id, firstName, lastName, birthDate, salt, passwordHash)
        {
            InstitutionId = institutionId;
            Roles = new List<string>();
            PermissionModifiers = new List<PermissionModifier>();
            DepartmentIds = new List<string>();
        }

        public override PersonType Type => PersonType.Employee;
        public string InstitutionId { get; set; }
        public List<string> DepartmentIds { get; set; }
    }
}