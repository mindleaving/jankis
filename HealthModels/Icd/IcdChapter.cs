using System;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthModels.Icd
{
    public class IcdChapter : IcdEntry, IId
    {
        public IcdChapter(string name)
            : base(name)
        {
            Id = Guid.NewGuid().ToString();
        }

        [BsonId]
        public string Id { get; private set; }

        public override string ToString()
        {
            return Name;
        }
    }
}