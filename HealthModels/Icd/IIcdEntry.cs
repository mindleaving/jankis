using System.Collections.Generic;

namespace HealthModels.Icd
{
    public interface IIcdEntry
    {
        string Name { get; }
        List<IcdEntry> SubEntries { get; }
    }
}