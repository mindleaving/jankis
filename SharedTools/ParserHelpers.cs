using System;
using System.Collections.Generic;
using System.Linq;

namespace SharedTools
{
    public static class ParserHelpers
    {
        public static List<string> QuoteAwareSplit(
            string line,
            char separator,
            StringSplitOptions options = StringSplitOptions.None)
        {
            var rawSplit = new Queue<string>(line.Split(separator, options));
            var split = new List<string>();
            var currentSplit = string.Empty;
            while (rawSplit.Any())
            {
                var part = rawSplit.Dequeue();
                if (currentSplit != string.Empty)
                {
                    if (part.EndsWith('"'))
                    {
                        currentSplit += part;
                        split.Add(currentSplit.Substring(1, currentSplit.Length - 2));
                        currentSplit = string.Empty;
                    }
                    else
                        currentSplit += part;
                }
                else if (part.StartsWith('"'))
                {
                    if (part.EndsWith('"'))
                        split.Add(part.Substring(1, part.Length-2));
                    else
                        currentSplit += part;
                }
                else
                {
                    split.Add(part);
                }
            }
            if(currentSplit != string.Empty)
                split.Add(currentSplit);
            return split;
        }
    }
}
