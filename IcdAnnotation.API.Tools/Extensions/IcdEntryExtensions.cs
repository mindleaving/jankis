using System;
using System.Collections.Generic;
using System.Linq;
using HealthModels.Icd;

namespace IcdAnnotation.API.Tools.Extensions
{
    public static class IcdEntryExtensions
    {
        public static IIcdEntry FindSection(
            this List<IcdChapter> icdChapters,
            string sectionName)
        {
            var pendingSections = new Queue<IIcdEntry>(icdChapters);
            while (pendingSections.Any())
            {
                var section = pendingSections.Dequeue();
                if (section.Name == sectionName)
                    return section;
                section.SubEntries.ForEach(pendingSections.Enqueue);
            }

            throw new Exception($"Section with name '{sectionName}' not found");
        }
    }
}
