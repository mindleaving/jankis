using System.Collections.Generic;

namespace HealthModels.Symptoms
{
    public class LocalizedSymptom : Symptom
    {
        public List<BodyStructure> BodyStructures { get; set; }

        public LocalizedSymptom() : base(SymptomType.Localized) {}
        public LocalizedSymptom(string name, List<BodyStructure> bodyStructures)
            : base(SymptomType.Localized, name)
        {
            BodyStructures = bodyStructures;
        }
    }
}