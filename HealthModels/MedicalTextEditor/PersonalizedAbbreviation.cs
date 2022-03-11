namespace HealthModels.MedicalTextEditor
{
    public class PersonalizedAbbreviation : IId
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Abbreviation { get; set; }
        public string FullText { get; set; }
    }
}
