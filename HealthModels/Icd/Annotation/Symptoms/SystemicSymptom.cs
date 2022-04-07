namespace HealthModels.Icd.Annotation.Symptoms
{
    public class SystemicSymptom : Symptom
    {
        public SystemicSymptom() : base(SymptomType.Systemic) {}
        public SystemicSymptom(string name)
            : base(SymptomType.Systemic, name)
        {
        }
    }
}