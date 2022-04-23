using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.Models;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class GenericReadonlyStore<T> : IReadonlyStore<T> where T : IId
    {
        protected readonly IMongoDatabase database;
        protected readonly IMongoCollection<T> collection;

        public GenericReadonlyStore(
            IMongoDatabase mongoDatabase, 
            string collectionName = null,
            bool bypassPersonDataTypeCheck = false)
        {
            if (!bypassPersonDataTypeCheck && typeof(T).GetInterfaces().Contains(typeof(IPersonData)))
                throw new SecurityException("GenericReadonlyStore cannot be used for person data, use GenericPersonDataReadonlyStore instead");
            database = mongoDatabase;
            collection = mongoDatabase.GetCollection<T>(collectionName ?? typeof(T).Name);
        }

        public Task<List<T>> GetAllAsync()
        {
            return collection.Find(FilterDefinition<T>.Empty).ToListAsync();
        }

        public Task<List<T>> SearchAsync(
            Expression<Func<T, bool>> filter,
            int? count = null,
            int? skip = null,
            Expression<Func<T, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            var findExpression = collection.Find(filter ?? (x => true));
            if (orderBy != null)
            {
                findExpression = orderDirection == OrderDirection.Ascending 
                    ? findExpression.SortBy(orderBy) 
                    : findExpression.SortByDescending(orderBy);
            }
            return findExpression.Skip(skip).Limit(count).ToListAsync();
        }

        public Task<bool> ExistsAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) 
                throw new ArgumentException("ID cannot be null or whitespace.", nameof(id));
            return collection.Find(x => x.Id == id).AnyAsync();
        }

        public Task<T> GetByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) 
                throw new ArgumentException("ID cannot be null or whitespace.", nameof(id));
            return collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public Task<T> FirstOrDefaultAsync(
            Expression<Func<T, bool>> filter)
        {
            return collection.Find(filter).FirstOrDefaultAsync();
        }
    }
}