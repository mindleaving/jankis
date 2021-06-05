using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;

namespace JanKIS.API.Storage
{
    public interface IReadonlyStore<T> where T: IId
    {
        Task<List<T>> GetAllAsync(PermissionFilter<T> permissionFilter);
        Task<List<T>> GetMany(int? count, int? skip, Expression<Func<T, object>> orderBy, OrderDirection orderDirection, PermissionFilter<T> permissionFilter);
        Task<bool> ExistsAsync(string id);
        Task<T> GetByIdAsync(string id, PermissionFilter<T> permissionFilter);
        Task<List<T>> SearchAsync(Expression<Func<T, bool>> filter, PermissionFilter<T> permissionFilter, int? count = null, int? skip = null);
    }
}