using System.Collections.Generic;
using HealthModels;
using HealthModels.Interview;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthSharingPortal.API.Models
{
    [BsonKnownTypes(
        typeof(HealthProfessionalAccount)
    )]
    public class Account : IId
    {
        public Account() {}
        public Account(
            string id,
            AccountType accountType,
            string personId = null,
            Language preferedLanguage = Language.en)
        {
            Id = id;
            AccountType = accountType;
            PersonId = personId;
            PreferedLanguage = preferedLanguage;
            LoginIds = new List<string>();
        }

        public string Id { get; set; }
        public AccountType AccountType { get; set; }
        public string PersonId { get; set; }
        public Language PreferedLanguage { get; set; }
        public List<string> LoginIds { get; set; }
    }
}