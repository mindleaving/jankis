using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Icd;
using HealthModels.Icd.Annotation;
using IcdAnnotation.API.Models;
using IcdAnnotation.API.Models.Filters;
using MongoDB.Bson;
using MongoDB.Driver;

namespace IcdAnnotation.API.Data
{
    public class DiseaseStore : GenericStore<Disease>, IDiseaseStore
    {
        private static readonly TimeSpan MaximumLockTime = TimeSpan.FromMinutes(30);

        public DiseaseStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<List<Disease>> GetMany(
            DiseaseFilter filter,
            int? count,
            int? skip,
            Expression<Func<InfectiousDisease, object>> orderBy)
        {
            var collection = database.GetCollection<InfectiousDisease>(nameof(Disease));
            var filterParts = new List<FilterDefinition<InfectiousDisease>>();
            var filterBuilder = Builders<InfectiousDisease>.Filter;
            if (filter.HasIncidenceData.HasValue)
                filterParts.Add(CreateExistanceFilter(filter.HasIncidenceData.Value, x => x.Epidemiology.IncidenceDataPoints, filterBuilder));
            if (filter.HasPrevalenceData.HasValue)
                filterParts.Add(CreateExistanceFilter(filter.HasPrevalenceData.Value, x => x.Epidemiology.PrevalenceDataPoints, filterBuilder));
            if (filter.HasMortalityData.HasValue)
                filterParts.Add(CreateExistanceFilter(filter.HasMortalityData.Value, x => x.Epidemiology.MortalityDataPoints, filterBuilder));
            if (filter.HasSymptoms.HasValue)
                filterParts.Add(CreateExistanceFilter(filter.HasSymptoms.Value, x => x.Symptoms, filterBuilder));
            if (filter.HasObservations.HasValue)
                filterParts.Add(CreateExistanceFilter(filter.HasObservations.Value, x => x.Observations, filterBuilder));
            if (filter.HasDiagnosticCriteria.HasValue)
                filterParts.Add(CreateExistanceFilter(filter.HasDiagnosticCriteria.Value, x => x.DiagnosticCriteria, filterBuilder));
            if (filter.HasAffectedBodyStructures.HasValue)
                filterParts.Add(CreateExistanceFilter(filter.HasAffectedBodyStructures.Value, x => x.AffectedBodyStructures, filterBuilder));
            if (filter.IsInfectiousDisease.HasValue)
                filterParts.Add(filterBuilder.Exists(x => x.Pathogens, filter.IsInfectiousDisease.Value));
            if (filter.HasDiseaseHosts.HasValue)
                filterParts.Add(CreateExistanceFilter(filter.HasDiseaseHosts.Value, x => x.Hosts, filterBuilder));
            if (filter.HasPathogens.HasValue)
                filterParts.Add(CreateExistanceFilter(filter.HasPathogens.Value, x => x.Pathogens, filterBuilder));

            var combinedFilter = filterParts.Count > 1 
                ? filterBuilder.And(filterParts)
                : filterParts.Count > 0 ? filterParts[0] : FilterDefinition<InfectiousDisease>.Empty;
            return (await collection
                .Find(combinedFilter)
                .SortBy(orderBy)
                .Skip(skip)
                .Limit(count)
                .ToListAsync())
                .Cast<Disease>()
                .ToList();
        }

        private static FilterDefinition<InfectiousDisease> CreateExistanceFilter(
            bool dataExists,
            Expression<Func<InfectiousDisease, object>> fieldSelector,
            FilterDefinitionBuilder<InfectiousDisease> builder)
        {
            return dataExists ? builder.SizeGt(fieldSelector, 0) : builder.Size(fieldSelector, 0);
        }

        public Task<List<IcdCategory>> GetDiseaseHierarchy(string prefix = null, int? maxDepth = null)
        {
            return Task.Run(() =>
                {
                    var filter = prefix != null
                        ? Builders<Disease>.Filter.Regex(x => x.IcdCode, new BsonRegularExpression($"/^{prefix}.*/i"))
                        : FilterDefinition<Disease>.Empty;
                    var diseases = collection.Find(filter)
                        .SortBy(x => x.IcdCode)
                        .Project(x => new {x.IcdCode, x.Name})
                        .ToEnumerable();
                    var hierarchy = new List<IcdCategory>();
                    var stack = new Stack<IcdCategory>();
                    foreach (var disease in diseases)
                    {
                        var hierarchyItem = new IcdCategory(disease.IcdCode, disease.Name);
                        while (stack.Any() && !hierarchyItem.Code.StartsWith(stack.Peek().Code))
                        {
                            stack.Pop();
                        }

                        if (stack.Any())
                        {
                            if (maxDepth.HasValue && stack.Count >= maxDepth)
                                continue;
                            stack.Peek().SubEntries.Add(hierarchyItem);
                        }
                        else
                        {
                            hierarchy.Add(hierarchyItem);
                        }

                        stack.Push(hierarchyItem);
                    }

                    return hierarchy;
                });
        }

        public async Task<DiseaseLock> GetLock(string icdCode)
        {
            return await collection.Find(x => x.IcdCode == icdCode).Project(x => x.EditLock).FirstOrDefaultAsync();
        }

        public async Task<bool> TryLock(
            string icdCode,
            DiseaseLock diseaseLock)
        {
            var filterBuilder = Builders<Disease>.Filter;
            var filter = filterBuilder.And(
                filterBuilder.Eq(x => x.IcdCode, icdCode),
                filterBuilder.Or(
                    filterBuilder.Exists(x => x.EditLock, false),
                    filterBuilder.Eq(x => x.EditLock, null),
                    filterBuilder.Lt(x => x.EditLock.CreatedTimestamp, DateTime.UtcNow - MaximumLockTime),
                    filterBuilder.Eq(x => x.EditLock.User, diseaseLock.User)
                )
            );
            var result = await collection.UpdateOneAsync(
                filter, 
                Builders<Disease>.Update.Set(x => x.EditLock, diseaseLock));
            return result.IsAcknowledged && result.ModifiedCount == 1;
        }

        public async Task<bool> TryUnlock(
            string icdCode,
            string username)
        {
            var filterBuilder = Builders<Disease>.Filter;
            var filter = filterBuilder.And(
                filterBuilder.Eq(x => x.IcdCode, icdCode),
                filterBuilder.Or(
                    filterBuilder.Exists(x => x.EditLock, false),
                    filterBuilder.Eq(x => x.EditLock, null),
                    filterBuilder.Lt(x => x.EditLock.CreatedTimestamp, DateTime.UtcNow - MaximumLockTime),
                    filterBuilder.Eq(x => x.EditLock.User, username)
                )
            );
            var result = await collection.UpdateOneAsync(
                filter,
                Builders<Disease>.Update.Set(x => x.EditLock, null));
            return result.IsAcknowledged && result.MatchedCount == 1;
        }

        public Task BatchAssign<TDisease,TItem>(
            Expression<Func<TDisease, bool>> diseaseSelector,
            Expression<Func<TDisease, IEnumerable<TItem>>> listSelector,
            TItem item)
            where TDisease: Disease
        {
            var collection = database.GetCollection<TDisease>(nameof(Disease));
            return collection.UpdateManyAsync(
                diseaseSelector,
                Builders<TDisease>.Update.Push(listSelector, item));
        }

        public Task BatchRemove<TDisease,TItem>(
            Expression<Func<TDisease, IEnumerable<TItem>>> listSelector,
            Expression<Func<TItem,bool>> itemFilter,
            List<string> diseaseIcdCodes = null)
            where TDisease: Disease
        {
            var collection = database.GetCollection<TDisease>(nameof(Disease));
            var filter = diseaseIcdCodes != null 
                ? Builders<TDisease>.Filter.Where(disease => diseaseIcdCodes.Contains(disease.IcdCode)) 
                : FilterDefinition<TDisease>.Empty;
            var listSelector2 = new ExpressionFieldDefinition<TDisease>(listSelector);
            var itemFilter2 = new ExpressionFilterDefinition<TItem>(itemFilter);
            return collection.UpdateManyAsync(
                filter,
                Builders<TDisease>.Update.PullFilter(listSelector2, itemFilter2));
        }
    }
}
