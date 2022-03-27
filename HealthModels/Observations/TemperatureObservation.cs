﻿using TypescriptGenerator.Attributes;

namespace HealthModels.Observations
{
    public class TemperatureObservation : Observation
    {
        public override string MeasurementType { get; set; } =  Observations.MeasurementType.Temperature.ToString();
        public double Value { get; set; }
        public string Unit { get; set; }
        [TypescriptIsOptional]
        public string BodyPart { get; set; }
    }
}
