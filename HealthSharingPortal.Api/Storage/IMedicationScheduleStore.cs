using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels.Medication;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public interface IMedicationScheduleStore : IStore<MedicationSchedule>
    {
        Task<List<MedicationSchedule>> GetForPerson(string personId);
    }

    public class MedicationScheduleStore : GenericStore<MedicationSchedule>, IMedicationScheduleStore
    {
        public MedicationScheduleStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public Task<List<MedicationSchedule>> GetForPerson(string personId)
        {
            return collection.Find(x => x.PersonId == personId).ToListAsync();
        }
    }
}
