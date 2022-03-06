using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Icd;
using HealthModels.Icd.Annotation;
using IcdAnnotation.API.Models;
using IcdAnnotation.API.Models.Filters;

namespace IcdAnnotation.API.Data
{
    public interface IDiseaseStore : IStore<Disease>
    {
        Task<List<Disease>> GetMany(DiseaseFilter filter, int? count, int? skip, Expression<Func<InfectiousDisease, object>> orderBy);
        Task<List<IcdCategory>> GetDiseaseHierarchy(string prefix = null, int? maxDepth = null);

        Task<DiseaseLock> GetLock(string icdCode);
        Task<bool> TryLock(string icdCode, DiseaseLock diseaseLock);
        Task<bool> TryUnlock(string icdCode, string username);

        Task BatchAssign<TDisease, TItem>(
            Expression<Func<TDisease, bool>> diseaseSelector, 
            Expression<Func<TDisease, IEnumerable<TItem>>> listSelector, 
            TItem item) where TDisease: Disease;
        Task BatchRemove<TDisease, TItem>(
            Expression<Func<TDisease, IEnumerable<TItem>>> listSelector, 
            Expression<Func<TItem,bool>> itemSelector, 
            List<string> diseaseIcdCodes = null) where TDisease: Disease;
    }
}