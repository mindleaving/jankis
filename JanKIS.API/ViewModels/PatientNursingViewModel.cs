using System.Collections.Generic;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class PatientNursingViewModel
    {
        public PatientNursingViewModel(
            Person profileData,
            Admission currentAdmission,
            List<AttachedEquipmentViewModel> equipments)
        {
            ProfileData = profileData;
            CurrentAdmission = currentAdmission;
            Equipments = equipments;
        }

        public Person ProfileData { get; set; }
        public Admission CurrentAdmission { get; set; }
        public List<AttachedEquipmentViewModel> Equipments { get; set; }
    }
}
