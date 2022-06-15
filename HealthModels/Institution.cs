using System;
using System.Text.RegularExpressions;

namespace HealthModels
{
    public class Institution : IId
    {
        public Institution(
            string id,
            string name)
        {
            if (!Regex.IsMatch(id, "[a-zA-Z0-9_-]+"))
                throw new ArgumentException("Institution-ID must only contain letters, numbers, underscores (_) and dashes (-)");
            if (string.IsNullOrWhiteSpace(name)) 
                throw new ArgumentException("Value cannot be null or whitespace.", nameof(name));
            Id = id;
            Name = name;
        }

        public string Id { get; set; }
        public string Name { get; set; }
    }
}
