using System.Collections.Generic;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class PatientNursingViewModel
    {
        public PatientNursingViewModel(
            Person profileData,
            Admission currentAdmission,
            List<AttachedEquipmentViewModel> equipments,
            List<Observation> observations)
        {
            ProfileData = profileData;
            CurrentAdmission = currentAdmission;
            Equipments = equipments;
            Observations = observations;
        }

        public Person ProfileData { get; set; }
        public Admission CurrentAdmission { get; set; }
        public List<AttachedEquipmentViewModel> Equipments { get; set; }
        public List<Observation> Observations { get; set; }
    }
}
