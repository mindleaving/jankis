using HealthModels;

namespace IcdAnnotation.API.Models
{
    public class User : IId
    {
        public string Id => Username;
        public string Username { get; set; }
    }
}
