using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Storage
{
    public interface IId
    {
        [BsonId]
        string Id { get; }
    }
}