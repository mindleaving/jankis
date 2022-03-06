using System;
using System.Collections.Generic;
using HealthModels;
using HealthModels.Observations;
using HealthModels.Symptoms;

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