using System.Threading.Tasks;
using JanKIS.API.Models;

namespace JanKIS.API.Storage
{
    public interface IPatientStore : IStore<Person>
    {
        Task<bool> AdmitAsync(string patientId, AdmissionInfo admissionInfo);

        Task<bool> AttachEquipmentAsync(string patientId, MedicalEquipment equipment);
        Task<bool> RemoveEquipmentAsync(string patientId, string equipmentId);

        Task<bool> AddObservation(string patientId, Observation observation);
        Task<bool> RemoveObservation(string patientId, string observationId);
    }
}
