namespace JanKIS.API.Models.MedicalTextEditor
{
    public class AbbreviationMedicalTextPart : MedicalTextPart
    {
        public override MedicalTextPartType Type => MedicalTextPartType.Abbreviation;
        public string Abbreviation { get; set; }
        public string FullText { get; set; }
    }
}