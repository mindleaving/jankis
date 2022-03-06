using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthModels.Icd
{
    [BsonKnownTypes(typeof(IcdChapter), typeof(IcdBlock), typeof(IcdCategory))]
    public abstract class IcdEntry : IIcdEntry
    {
        protected IcdEntry(
            string name,
            List<IcdEntry> subEntries = null)
        {
            Name = name;
            SubEntries = subEntries ?? new List<IcdEntry>();
        }
        public string Name { get; private set; }
        public List<IcdEntry> SubEntries { get; private set; }
    }
}