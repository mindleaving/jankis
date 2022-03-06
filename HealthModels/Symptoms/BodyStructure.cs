using MongoDB.Bson.Serialization.Attributes;

namespace HealthModels.Symptoms
{
    public class BodyStructure : IId
    {
        [BsonId]
        public string Id => IcdCode;
        public string IcdCode { get; set; }
        public string Name { get; set; }
        
        /// <summary>
        /// ICD-Code of parent category. E.g. if this is Femoral nerve (XA11D4), its parent is Peripheral nerve (XA06U6).
        /// </summary>
        public string CategoryIcdCode { get; set; }
    }
}