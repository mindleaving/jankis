using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace JanKIS.API.Models
{
    public abstract class PersonWithLogin : Person
    {
        public PersonWithLogin(
            string id,
            string firstName,
            string lastName,
            DateTime birthDate,
            string salt,
            string passwordHash)
            : base(id, firstName, lastName, birthDate)
        {
            Salt = salt;
            PasswordHash = passwordHash;
            IsPasswordChangeRequired = true;
            Roles = new List<string>();
            PermissionModifiers = new List<PermissionModifier>();
        }

        public abstract PersonType Type { get; }

        #region Login-information
        [JsonIgnore]
        public string PasswordHash { get; set; }
        [JsonIgnore]
        public string Salt { get; set; }
        public bool IsPasswordChangeRequired { get; set; }
        #endregion

        #region Permission-system
        public List<string> Roles { get; set; }
        public List<PermissionModifier> PermissionModifiers { get; set; }
        #endregion
    }
}