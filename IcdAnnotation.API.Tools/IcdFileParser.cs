using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using HealthModels.Icd;

namespace IcdAnnotation.API.Tools
{
    public class IcdFileParser
    {
        private readonly string filePath;

        public IcdFileParser(string filePath)
        {
            this.filePath = filePath;
        }

        public List<IcdChapter> Parse()
        {
            var chapters = new List<IcdChapter>();
            var hierarchy = new Stack<IIcdEntry>();
            var lineNumber = 1;
            foreach (var line in File.ReadLines(filePath).Skip(1))
            {
                lineNumber++;
                var splittedLine = ParserHelpers.QuoteAwareSplit(line, ';');
                var icdCode = splittedLine[0];
                var blockId = splittedLine[1];
                var nameWithLevels = splittedLine[2];
                var sectionType = (IcdSectionType) Enum.Parse(typeof(IcdSectionType), splittedLine[3], ignoreCase: true);
                var chapterNumber = splittedLine[7];
                var level = ParseLevel(nameWithLevels);
                var name = nameWithLevels.Substring(2 * level);

                IcdEntry icdEntry;
                switch (sectionType)
                {
                    case IcdSectionType.Chapter:
                    {
                        var chapter = new IcdChapter(name);
                        chapters.Add(chapter);
                        icdEntry = chapter;
                        break;
                    }
                    case IcdSectionType.Block:
                        icdEntry = new IcdBlock(name);
                        break;
                    case IcdSectionType.Category:
                        icdEntry = new IcdCategory(icdCode, name);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                if (level > hierarchy.Count +1)
                {
                    throw new Exception("Jump in levels by more than one detected!");
                }
                
                while (hierarchy.Count > level)
                {
                    hierarchy.Pop();
                }
                if (hierarchy.Any()) 
                    hierarchy.Peek().SubEntries.Add(icdEntry);
                hierarchy.Push(icdEntry);
            }

            return chapters;
        }

        private int ParseLevel(string name)
        {
            return name.TakeWhile(c => c == '-' || c == ' ').Count(c => c == '-');
        }
    }
}
