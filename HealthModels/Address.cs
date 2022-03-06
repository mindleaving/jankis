using System;

namespace HealthModels
{
    public class Address
    {
        public AddressRole Role { get; set; }

        public string Street { get; set; }
        public string HouseNumber { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public DateTime? FirstStayDate { get; set; }
        public DateTime? LastStayDate { get; set; }
    }
}