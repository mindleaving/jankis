using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IReadonlyStore<T> where T: IId
    {
        Task<List<T>> GetAllAsync();
        Task<List<T>> GetMany(int? count, int? skip, Expression<Func<T, object>> orderBy, OrderDirection orderDirection);
        Task<bool> ExistsAsync(string id);
        Task<T> GetByIdAsync(string id);
        Task<List<T>> SearchAsync(Expression<Func<T, bool>> filter, int? count = null, int? skip = null);
    }
}