using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Contact : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }
}
