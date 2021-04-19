using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public interface IServiceStore : IStore<ServiceDefinition>
    {
        Task<List<ServiceDefinition>> GetManyFiltered(
            int? count = null,
            int? skip = null,
            Expression<Func<ServiceDefinition, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending,
            string departmentId = null);
    }

    public class ServiceStore : GenericStore<ServiceDefinition>, IServiceStore
    {
        public ServiceStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public Task<List<ServiceDefinition>> GetManyFiltered(
            int? count = null,
            int? skip = null,
            Expression<Func<ServiceDefinition, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending,
            string departmentId = null)
        {
            var filterExpressions = new List<Expression<Func<ServiceDefinition, bool>>>();
            if(departmentId != null)
                filterExpressions.Add(x => x.DepartmentId == departmentId);

            var combinedFilter = filterExpressions.Count == 0 ? x => true
                : filterExpressions.Count == 1 ? filterExpressions[0]
                : SearchExpressionBuilder.And(filterExpressions.ToArray());
            var findExpression = collection.Find(combinedFilter);
            findExpression = orderDirection == OrderDirection.Ascending 
                ? findExpression.SortBy(orderBy) 
                : findExpression.SortByDescending(orderBy);
            return findExpression.Skip(skip).Limit(count).ToListAsync();
        }
    }
}
