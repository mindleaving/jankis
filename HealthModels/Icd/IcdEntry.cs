using System.Collections.Generic;
using HealthModels.Interview;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthModels.Icd
{
    [BsonKnownTypes(typeof(IcdChapter), typeof(IcdBlock), typeof(IcdCategory))]
    public abstract class IcdEntry : IIcdEntry, IHasTranslations
    {
        protected IcdEntry(
            string version,
            string name,
            Dictionary<Language, string> translations = null,
            List<IcdEntry> subEntries = null)
        {
            Version = version;
            Name = name;
            Translations = translations ?? new Dictionary<Language, string>();
            SubEntries = subEntries ?? new List<IcdEntry>();
        }

        public string Version { get; private set; }
        public string Name { get; set; }
        public Dictionary<Language, string> Translations { get; private set; }
        public List<IcdEntry> SubEntries { get; private set; }
    }
}