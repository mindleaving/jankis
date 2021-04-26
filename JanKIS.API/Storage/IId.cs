using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Storage
{
    public interface IId
    {
        [BsonId]
        [Required]
        string Id { get; }
    }
}