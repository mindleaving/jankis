using TypescriptGenerator.Attributes;

namespace HealthModels
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
