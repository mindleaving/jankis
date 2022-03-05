using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthModels
{
    public interface IId
    {
        [BsonId]
        [Required]
        string Id { get; }
    }
}