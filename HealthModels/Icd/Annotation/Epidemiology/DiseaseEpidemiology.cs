using System;
using System.Collections.Generic;
using MongoDB.Driver.GeoJsonObjectModel;

namespace HealthModels.Icd.Annotation.Epidemiology
{
    public class DiseaseEpidemiology
    {
        public List<IncidenceDataPoint> IncidenceDataPoints { get; set; } = new List<IncidenceDataPoint>();
        public List<PrevalenceDataPoint> PrevalenceDataPoints { get; set; } = new List<PrevalenceDataPoint>();
        public List<MortalityDataPoint> MortalityDataPoints { get; set; } = new List<MortalityDataPoint>();

        public double GetIncidence(
            GeoJson2DGeographicCoordinates location,
            double age,
            DateTime time)
        {
            throw new NotImplementedException();
        }

        public double GetPrevalence(GeoJson2DGeographicCoordinates location, double age)
        {
            throw new NotImplementedException();
        }

        public double GetMortality(double age)
        {
            throw new NotImplementedException();
        }
    }
}