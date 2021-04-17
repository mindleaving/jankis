using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    public class AutocompleteCacheItem
    {
        public AutocompleteCacheItem(string context,
            string value)
        {
            Context = context;
            Value = value;
        }

        [BsonId]
        private ObjectId Id { get; set; } 
        public string Context { get; set; }
        public string Value { get; set; }
    }
}