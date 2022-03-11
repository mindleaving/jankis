namespace HealthModels.MedicalTextEditor
{
    public class TextMedicalTextPart : MedicalTextPart
    {
        public override MedicalTextPartType Type => MedicalTextPartType.Text;
        public string Text { get; set; }
    }
}