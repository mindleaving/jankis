using System.Collections.Generic;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class AttachedEquipmentViewModel : AttachedEquipment, IViewModel<AttachedEquipment>
    {
        public AttachedEquipmentViewModel(AttachedEquipment model)
            : base(
                model.Id,
                model.PatientId,
                model.CreatedBy,
                model.EquipmentType,
                model.Materials,
                model.AttachmentTime,
                model.DetachmentTime,
                model.AdmissionId)
        {
        }

        public List<MaterialViewModel> MaterialViewModels { get; set; }
    }
}
