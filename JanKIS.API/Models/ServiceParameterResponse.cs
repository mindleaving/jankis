using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(
        typeof(TextServiceParameterResponse), 
        typeof(NumberServiceParameterResponse),
        typeof(PatientServiceParameterResponse))]
    public abstract class ServiceParameterResponse
    {
        public string ParameterName { get; set; }
        public abstract ServiceParameterValueType ValueType { get; }
    }

    public class PatientServiceParameterResponse : ServiceParameterResponse
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Patient;
        public string PatientId { get; set; }
    }
}