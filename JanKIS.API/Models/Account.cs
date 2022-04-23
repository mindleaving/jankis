using System.Collections.Generic;
using HealthModels;
using HealthModels.Interview;
using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(
        typeof(EmployeeAccount),
        typeof(PatientAccount))]
    public abstract class Account : IId
    {
        public Account() {}
        public Account(
            string id,
            string personId = null,
            Language preferedLanguage = Language.en)
        {
            Id = id;
            PersonId = personId;
            PreferedLanguage = preferedLanguage;
            LoginIds = new List<string>();
        }

        public string Id { get; set; }
        public abstract AccountType AccountType { get; }
        public string PersonId { get; set; }
        public Language PreferedLanguage { get; set; }
        public List<string> LoginIds { get; set; }
    }
}