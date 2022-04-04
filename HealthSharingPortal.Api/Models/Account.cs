using HealthModels;
using HealthModels.Interview;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace HealthSharingPortal.API.Models
{
    [BsonKnownTypes(
        typeof(HealthProfessionalAccount)
    )]
    public class Account : IId, IPersonData
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
        public Language PreferedLanguage { get; set; } = Language.en;

        #region Login-information
        [JsonIgnore]
        public string PasswordHash { get; set; }
        [JsonIgnore]
        public string Salt { get; set; }
        public bool IsPasswordChangeRequired { get; set; }
        #endregion
    }
}