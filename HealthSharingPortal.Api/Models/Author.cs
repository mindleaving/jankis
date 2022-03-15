using System;
using System.Collections.Generic;
using HealthModels;

namespace HealthSharingPortal.API.Models
{
    public class Author : Person
    {
        public Author(string id, string firstName, string lastName, DateTime birthDate, Sex sex)
            : base(id, firstName, lastName, birthDate, sex)
        {
        }

        public string OrcId { get; set; }
        public List<string> Organizations { get; set; }
    }
}