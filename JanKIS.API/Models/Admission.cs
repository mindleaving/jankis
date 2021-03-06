using System;
using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Admission : IId
    {
        public Admission(
            string id,
            string patientId,
            Person profileData,
            DateTime admissionTime,
            DateTime dischargeTime,
            List<Contact> contactPersons)
        {
            Id = id;
            PatientId = patientId;
            ProfileData = profileData;
            AdmissionTime = admissionTime;
            DischargeTime = dischargeTime;
            ContactPersons = contactPersons ?? new List<Contact>();
        }

        public string Id { get; set; }
        public string PatientId { get; set; }
        public Person ProfileData { get; set; }
        public bool IsReadmission { get; set; }
        public DateTime AdmissionTime { get; set; }
        public DateTime? DischargeTime { get; set; }
        public List<Contact> ContactPersons { get; set; }
    }
}