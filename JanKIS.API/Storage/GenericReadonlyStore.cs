using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Security;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public class GenericReadonlyStore<T> : IReadonlyStore<T> where T : IId
    {
        protected readonly IMongoCollection<T> collection;

        public GenericReadonlyStore(IMongoDatabase mongoDatabase)
        {
            collection = mongoDatabase.GetCollection<T>(typeof(T).Name);
        }

        public async Task<List<T>> GetAllAsync(PermissionFilter<T> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Read);
            if (permissionFilter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                return new List<T>();
            var aggregatePipeline = permissionFilter.AuthorizationLevel == AuthorizationLevel.FullyAuthorized
                ? collection.Find(FilterDefinition<T>.Empty)
                : collection.Find(permissionFilter.Filter);
            return await aggregatePipeline.ToListAsync();
        }

        public async Task<List<T>> GetMany(
            int? count,
            int? skip,
            Expression<Func<T, object>> orderBy,
            OrderDirection orderDirection,
            PermissionFilter<T> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Read);
            if (permissionFilter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                return new List<T>();
            var aggregatePipeline = permissionFilter.AuthorizationLevel == AuthorizationLevel.FullyAuthorized
                ? collection.Find(FilterDefinition<T>.Empty)
                : collection.Find(permissionFilter.Filter);
            aggregatePipeline = orderDirection == OrderDirection.Ascending 
                ? aggregatePipeline.SortBy(orderBy) 
                : aggregatePipeline.SortByDescending(orderBy);
            return await aggregatePipeline.Skip(skip).Limit(count).ToListAsync();
        }

        public Task<bool> ExistsAsync(string id)
        {
            return collection.Find(x => x.Id == id).AnyAsync();
        }

        public async Task<T> GetByIdAsync(string id, PermissionFilter<T> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Read);
            var item = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
            if (item == null)
                return default;
            if (permissionFilter.AuthorizationLevel == AuthorizationLevel.FullyAuthorized)
                return item;
            if (permissionFilter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                return default;
            if (permissionFilter.Filter.Compile().Invoke(item))
                return item;
            return default;
        }

        public async Task<List<T>> SearchAsync(
            Expression<Func<T, bool>> filter,
            PermissionFilter<T> permissionFilter,
            int? count = null, 
            int? skip = 0)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Read);
            if (permissionFilter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                return new List<T>();
            var combinedFilter = permissionFilter.AuthorizationLevel == AuthorizationLevel.FullyAuthorized
                ? filter
                : SearchExpressionBuilder.And(permissionFilter.Filter, filter);
            return await collection.Find(combinedFilter).Skip(skip).Limit(count).ToListAsync();
        }

        protected static void ValidatePermissionFilter(
            PermissionFilter<T> permissionFilter,
            DataAccessType requiredAccessType)
        {
            if (permissionFilter.AccessType != requiredAccessType)
                throw new SecurityException(
                    $"Invalid permission filter. Access type '{requiredAccessType}' is required, but filter is for '{permissionFilter.AccessType}'");
            if(permissionFilter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                throw new SecurityException($"You are not authorized to {requiredAccessType.ToString().ToLower()} objects of type '{nameof(T)}'");
        }
    }
}