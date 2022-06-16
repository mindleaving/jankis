using System;
using System.Collections.Generic;
using TypescriptGenerator.Attributes;

namespace HealthModels
{
    public class Person : IPersonData
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
        public string PersonId
        {
            get => Id;
            set => Id = value;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public Sex Sex { get; set; }
        public List<Address> Addresses { get; set; }
        [TypescriptIsOptional]
        public string PhoneNumber { get; set; }
        [TypescriptIsOptional]
        public string Email { get; set; }

        [TypescriptIsOptional]
        public HealthInsurance HealthInsurance { get; set; }
    }
}