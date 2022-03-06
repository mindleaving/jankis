using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Medication;
using MongoDB.Driver;

namespace HealthSharingPortal.Api.Storage
{
    public interface IMedicationScheduleStore : IStore<MedicationSchedule>
    {
        Task<List<MedicationSchedule>> GetForPatient(string patientId);
    }

    public class MedicationScheduleStore : GenericStore<MedicationSchedule>, IMedicationScheduleStore
    {
        public MedicationScheduleStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public Task<List<MedicationSchedule>> GetForPatient(string patientId)
        {
            return collection.Find(x => x.PatientId == patientId).ToListAsync();
        }
    }
}
