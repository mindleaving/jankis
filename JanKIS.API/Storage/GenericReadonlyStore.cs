using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public class GenericReadonlyStore<T> : IReadonlyStore<T> where T : IId
    {
        protected readonly IMongoDatabase database;
        protected readonly IMongoCollection<T> collection;

        public GenericReadonlyStore(IMongoDatabase mongoDatabase)
        {
            this.database = mongoDatabase;
            collection = mongoDatabase.GetCollection<T>(typeof(T).Name);
        }

        public Task<List<T>> GetAllAsync()
        {
            return collection.Find(FilterDefinition<T>.Empty).ToListAsync();
        }

        public Task<List<T>> GetMany(
            int? count,
            int? skip,
            Expression<Func<T, object>> orderBy,
            OrderDirection orderDirection)
        {
            var findExpression = collection.Find(x => true).Skip(skip).Limit(count);
            findExpression = orderDirection == OrderDirection.Ascending 
                ? findExpression.SortBy(orderBy) 
                : findExpression.SortByDescending(orderBy);
            return findExpression.ToListAsync();
        }

        public Task<bool> ExistsAsync(string id)
        {
            return collection.Find(x => x.Id == id).AnyAsync();
        }

        public Task<T> GetByIdAsync(string id)
        {
            return collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public Task<List<T>> SearchAsync(
            Expression<Func<T, bool>> filter,
            int? count = null, 
            int? skip = 0)
        {
            return collection.Find(filter).Skip(skip).Limit(count).ToListAsync();
        }
    }
}