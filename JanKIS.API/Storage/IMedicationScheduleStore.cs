using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
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
