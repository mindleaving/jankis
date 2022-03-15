using HealthModels;
using Newtonsoft.Json;

namespace HealthSharingPortal.API.Models
{
    public class Account : IId
    {
        public Account(
            string personId,
            string username,
            AccountType accountType,
            string salt,
            string passwordHash)
        {
            PersonId = personId;
            Username = username;
            AccountType = accountType;
            Salt = salt;
            PasswordHash = passwordHash;
            IsPasswordChangeRequired = true;
        }

        public string Id => Username;
        public string PersonId { get; set; }
        public AccountType AccountType { get; set; }
        public string Username { get; set; }

        #region Login-information
        [JsonIgnore]
        public string PasswordHash { get; set; }
        [JsonIgnore]
        public string Salt { get; set; }
        public bool IsPasswordChangeRequired { get; set; }
        #endregion
    }
}