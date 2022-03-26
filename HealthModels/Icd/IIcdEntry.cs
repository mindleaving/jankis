using System.Collections.Generic;
using HealthModels.Interview;

namespace HealthModels.Icd
{
    public interface IIcdEntry
    {
        string Version { get; }
        string Name { get; set; }
        Dictionary<Language,string> Translations { get; }
        List<IcdEntry> SubEntries { get; }
    }
}