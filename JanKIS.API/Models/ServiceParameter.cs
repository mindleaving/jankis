﻿using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(
        typeof(TextServiceParameter), 
        typeof(NumberServiceParameter),
        typeof(BooleanServiceParameter),
        typeof(OptionsServiceParameter),
        typeof(PatientServiceParameter))]
    public abstract class ServiceParameter
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public abstract ServiceParameterValueType ValueType { get; }
    }
}