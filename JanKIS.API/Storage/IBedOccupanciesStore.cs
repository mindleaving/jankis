using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public interface IBedOccupanciesStore : IStore<BedOccupancy>
    {
        Task<List<BedOccupancy>> GetAllForDepartmentSince(string departmentId, DateTime startTime);
    }

    public class BedOccupanciesStore : GenericStore<BedOccupancy>, IBedOccupanciesStore
    {
        public BedOccupanciesStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<List<BedOccupancy>> GetAllForDepartmentSince(string departmentId, DateTime startTime)
        {
            return await collection
                .Find(x => x.EndTime == null || x.EndTime > startTime)
                .ToListAsync();
        }
    }
}
