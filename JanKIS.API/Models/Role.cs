using System.Collections.Generic;
using JanKIS.API.Storage;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    public class Role : IId
    {
        public string Id => Name;
        public string Name { get; set; }
        [BsonRepresentation(BsonType.String)] 
        public List<Permission> Permissions { get; set; }
        public bool IsSystemRole { get; set; }
    }
}
