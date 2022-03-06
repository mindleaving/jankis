using Newtonsoft.Json;

namespace HealthModels.Icd.Annotation.Epidemiology
{
    public class Microb : IId
    {
        [JsonIgnore]
        public string Id => IcdCode;
        public string IcdCode { get; set; }
        public MicrobType Type { get; set; }
        public string Name { get; set; }
        
        /// <summary>
        /// ICD-Code of parent category. E.g. if this is Campylobacter coli (XN0BA), its parent is Campylobacter (XN7US).
        /// </summary>
        public string CategoryIcdCode { get; set; }
    }
}