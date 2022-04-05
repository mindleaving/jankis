using HealthModels;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(
        typeof(EmployeeAccount),
        typeof(PatientAccount))]
    public abstract class Account : IId
    {
        public Account(
            string personId,
            string username,
            string salt,
            string passwordHash)
        {
            PersonId = personId;
            Username = username;
            Salt = salt;
            PasswordHash = passwordHash;
            IsPasswordChangeRequired = true;
        }

        public string Id => Username;
        public string PersonId { get; set; }
        public abstract AccountType AccountType { get; }
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