using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IPersonDataReadonlyStore<T> where T: IPersonData
    {
        Task<List<T>> GetAllAsync(List<PersonDataAccessGrant> accessGrants);
        Task<bool> ExistsAsync(string id, List<PersonDataAccessGrant> accessGrants);
        Task<T> GetByIdAsync(string id, List<PersonDataAccessGrant> accessGrants);
        Task<List<T>> SearchAsync(
            Expression<Func<T, bool>> filter,
            List<PersonDataAccessGrant> accessGrants,
            int? count = null,
            int? skip = null,
            Expression<Func<T, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending);
        Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> filter, List<PersonDataAccessGrant> accessGrants);
    }
}