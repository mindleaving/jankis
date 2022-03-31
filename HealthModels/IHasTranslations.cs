using System.Collections.Generic;
using HealthModels.Interview;

namespace HealthModels
{
    public interface IHasTranslations
    {
        string Name { get; set; }
        Dictionary<Language, string> Translations { get; }
    }
}