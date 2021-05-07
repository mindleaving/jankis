using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public class GenericReadonlyStore<T> : IReadonlyStore<T> where T : IId
    {
        protected readonly IMongoDatabase database;
        private readonly IPermissionFilterBuilder<T> permissionFilterBuilder;
        protected readonly IMongoCollection<T> collection;

        public GenericReadonlyStore(
            IMongoDatabase mongoDatabase,
            IPermissionFilterBuilder<T> permissionFilterBuilder)
        {
            database = mongoDatabase;
            this.permissionFilterBuilder = permissionFilterBuilder;
            collection = mongoDatabase.GetCollection<T>(typeof(T).Name);
        }

        public async Task<List<T>> GetAllAsync()
        {
            var filter = await permissionFilterBuilder.Build();
            if (filter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                return new List<T>();
            var aggregatePipeline = filter.AuthorizationLevel == AuthorizationLevel.FullyAuthorized
                ? collection.Find(FilterDefinition<T>.Empty)
                : collection.Find(filter.Filter);
            return await aggregatePipeline.ToListAsync();
        }

        public async Task<List<T>> GetMany(
            int? count,
            int? skip,
            Expression<Func<T, object>> orderBy,
            OrderDirection orderDirection)
        {
            var filter = await permissionFilterBuilder.Build();
            if (filter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                return new List<T>();
            var aggregatePipeline = filter.AuthorizationLevel == AuthorizationLevel.FullyAuthorized
                ? collection.Find(FilterDefinition<T>.Empty)
                : collection.Find(filter.Filter);
            aggregatePipeline = orderDirection == OrderDirection.Ascending 
                ? aggregatePipeline.SortBy(orderBy) 
                : aggregatePipeline.SortByDescending(orderBy);
            return await aggregatePipeline.Skip(skip).Limit(count).ToListAsync();
        }

        public Task<bool> ExistsAsync(string id)
        {
            // Allow probing existance
            return collection.Find(x => x.Id == id).AnyAsync();
        }

        public async Task<T> GetByIdAsync(string id)
        {
            var filter = await permissionFilterBuilder.Build();
            var item = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
            if (item == null)
                return default;
            if (filter.AuthorizationLevel == AuthorizationLevel.FullyAuthorized)
                return item;
            if (filter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                return default;
            if (filter.Filter.Compile().Invoke(item))
                return item;
            return default;
        }

        public async Task<List<T>> SearchAsync(
            Expression<Func<T, bool>> filter,
            int? count = null, 
            int? skip = 0)
        {
            var permissionFilter = await permissionFilterBuilder.Build();
            if (permissionFilter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                return new List<T>();
            var combinedFilter = permissionFilter.AuthorizationLevel == AuthorizationLevel.FullyAuthorized
                ? filter
                : SearchExpressionBuilder.And(permissionFilter.Filter, filter);
            return await collection.Find(combinedFilter).Skip(skip).Limit(count).ToListAsync();
        }
    }
}