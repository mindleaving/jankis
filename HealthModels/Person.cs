using System;
using TypescriptGenerator.Attributes;

namespace HealthModels
{
    public class Person : IId
    {
        public Person(
            string id,
            string firstName,
            string lastName,
            DateTime birthDate,
            Sex sex)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            BirthDate = birthDate;
            Sex = sex;
        }

        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public Sex Sex { get; set; }

        [TypescriptIsOptional]
        public HealthInsurance HealthInsurance { get; set; }
    }
}