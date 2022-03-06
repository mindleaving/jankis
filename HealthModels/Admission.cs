using System;
using System.Collections.Generic;

namespace HealthModels
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
        /// <summary>
        /// E.g. relatives, primary care physician, nursing home.
        /// </summary>
        public List<Contact> ContactPersons { get; set; }
    }
}