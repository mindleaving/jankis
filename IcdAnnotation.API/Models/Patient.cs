using System;
using System.Collections.Generic;
using HealthModels;
using HealthModels.Icd.Annotation.Symptoms;
using HealthModels.Observations;

namespace IcdAnnotation.API.Models
{
    public class Patient : IId
    {
        public string Id { get; }
        public List<Symptom> Symptoms { get; }
        public List<Observation> Observations { get; set; }

        public Patient(string id)
        {
            Id = id;
            throw new NotImplementedException();
        }
    }
}