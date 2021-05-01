using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public interface IServiceRequestsStore : IStore<ServiceRequest>
    {
        Task<List<ServiceRequest>> GetManyFilteredAsync(
            int? count = null,
            int? skip = null,
            Expression<Func<ServiceRequest, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending,
            string departmentId = null,
            string serviceId = null);

        Task<bool> TrySetStateAsync(
            string requestId,
            ServiceRequestState expectedCurrentState,
            ServiceRequestState newState);
    }

    public class ServiceRequestsStore : GenericStore<ServiceRequest>, IServiceRequestsStore
    {
        public ServiceRequestsStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public Task<List<ServiceRequest>> GetManyFilteredAsync(
            int? count = null,
            int? skip = null,
            Expression<Func<ServiceRequest, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending,
            string departmentId = null,
            string serviceId = null)
        {
            var filterExpressions = new List<Expression<Func<ServiceRequest, bool>>>();
            if(departmentId != null)
                filterExpressions.Add(x => x.Service.DepartmentId == departmentId);
            if(serviceId != null)
                filterExpressions.Add(x => x.Service.Id == serviceId);

            var combinedFilter = filterExpressions.Count == 0 ? x => true
                : filterExpressions.Count == 1 ? filterExpressions[0]
                : SearchExpressionBuilder.And(filterExpressions.ToArray());
            var findExpression = collection.Find(combinedFilter);
            findExpression = orderDirection == OrderDirection.Ascending 
                ? findExpression.SortBy(orderBy) 
                : findExpression.SortByDescending(orderBy);
            return findExpression.Skip(skip).Limit(count).ToListAsync();
        }

        public async Task<bool> TrySetStateAsync(
            string requestId,
            ServiceRequestState expectedCurrentState,
            ServiceRequestState newState)
        {
            if (expectedCurrentState == newState)
                return true;
            var result = await collection.UpdateOneAsync(
                x => x.Id == requestId && x.State == expectedCurrentState,
                Builders<ServiceRequest>.Update.Set(x => x.State, newState));
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }
    }
}