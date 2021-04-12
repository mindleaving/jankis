using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class Contact : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [TypescriptIsOptional]
        public string PhoneNumber { get; set; }
        [TypescriptIsOptional]
        public string Email { get; set; }
        [TypescriptIsOptional]
        public string Note { get; set; }
    }
}
