using System;
using System.Collections.Generic;

namespace HealthModels
{
    public class Admission : IId, IPersonData
    {
        public Admission(
            string id,
            Person profileData,
            DateTime admissionTime,
            DateTime dischargeTime,
            List<Contact> contactPersons)
        {
            Id = id;
            ProfileData = profileData;
            AdmissionTime = admissionTime;
            DischargeTime = dischargeTime;
            ContactPersons = contactPersons ?? new List<Contact>();
        }

        public string Id { get; set; }
        public string PersonId => ProfileData.Id;
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