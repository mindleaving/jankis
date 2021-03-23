using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    public class AutocompleteCacheItem
    {
        [BsonId]
        private string Id => $"{Context}_{Value}";
        public string Context { get; set; }
        public string Value { get; set; }
    }
}