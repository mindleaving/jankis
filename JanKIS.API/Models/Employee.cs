using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace JanKIS.API.Models
{
    public class Employee : Person
    {
        public Employee(string id,
            string firstName,
            string lastName,
            DateTime birthDate,
            string institutionId)
            : base(id, firstName, lastName, birthDate)
        {
            InstitutionId = institutionId;
            Roles = new List<string>();
            PermissionModifiers = new List<PermissionModifier>();
        }

        public string InstitutionId { get; set; }
        public List<string> Roles { get; set; }
        public List<PermissionModifier> PermissionModifiers { get; set; }
        [JsonIgnore]
        public string PasswordHash { get; set; }
        [JsonIgnore]
        public string Salt { get; set; }
        public bool IsPasswordChangeRequired { get; set; }
    }
}