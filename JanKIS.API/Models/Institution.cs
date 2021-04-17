using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
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
            Rooms = new List<Room>();
            Departments = new List<Department>();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public List<Room> Rooms { get; set; }
        public List<Department> Departments { get; set; }
    }
}
