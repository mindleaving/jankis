using System.Collections.Generic;

namespace HealthModels.MedicalTextEditor
{
    public class MedicalText : IId
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public Person Author { get; set; }
        public Contact Recipient { get; set; }
        public List<MedicalTextPart> Parts { get; set; }
    }
}
