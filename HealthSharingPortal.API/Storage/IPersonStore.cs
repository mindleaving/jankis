using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IPersonStore : IPersonDataStore<Person>
    {
        Task<List<Person>> SearchAsync(
            Expression<Func<Person, bool>> filter,
            List<IPersonDataAccessGrant> accessGrants,
            int? count = null,
            int? skip = null,
            Expression<Func<Person, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending);

        Task<List<Person>> SearchByName(
            string firstName,
            string lastName,
            List<IPersonDataAccessGrant> accessGrants);
    }
}
