using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class Patient : Person
    {
        public HealthInsurance HealthInsurance { get; set; }
        public List<Employee> ContactPersons { get; }
    }
}
