﻿using System;
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
        Task<bool> ExistsAsync(string id);
        Task<T> GetByIdAsync(string id);
        Task<List<T>> SearchAsync(
            Expression<Func<T, bool>> filter,
            int? count = null,
            int? skip = null,
            Expression<Func<T, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending);
        Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> filter);
    }
}