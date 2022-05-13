using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Diagnoses;
using HealthModels.Icd;
using HealthModels.Interview;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow.ViewModelBuilders
{
    public class DiagnosisViewModelBuilderOptions : IViewModelBuilderOptions<Diagnosis>
    {
        public Language Language { get; set; } = Language.en;
    }

    public class DiagnosisViewModelBuilder : IViewModelBuilder<Diagnosis>
    {
        private readonly IReadonlyStore<IcdCategory> icdCategoryStore;

        public DiagnosisViewModelBuilder(
            IReadonlyStore<IcdCategory> icdCategoryStore)
        {
            this.icdCategoryStore = icdCategoryStore;
        }

        public async Task<IViewModel<Diagnosis>> Build(
            Diagnosis model, 
            IViewModelBuilderOptions<Diagnosis> options = null)
        {
            if(options == null)
                options = new DiagnosisViewModelBuilderOptions();
            var icdCategoryFilters = new List<Expression<Func<IcdCategory, bool>>>();
            if(model.Icd11Code != null)
                icdCategoryFilters.Add(x => x.Version == "11" && x.Code == model.Icd11Code);
            if(model.Icd10Code != null)
                icdCategoryFilters.Add(x => x.Version == "10" && x.Code == model.Icd10Code);
            var combinedIcdCategoryFilter = SearchExpressionBuilder.Or(icdCategoryFilters.ToArray());
            var icdCategory = (await icdCategoryStore.SearchAsync(combinedIcdCategoryFilter))
                .FirstOrDefault();
            var name = GetName(icdCategory, options as DiagnosisViewModelBuilderOptions, model.Icd11Code);
            return new DiagnosisViewModel
            {
                Id = model.Id,
                CreatedBy = model.CreatedBy,
                Timestamp = model.Timestamp,
                PersonId = model.PersonId,
                Icd11Code = model.Icd11Code,
                Icd10Code = model.Icd10Code,
                Name = name,
                HasResolved = model.HasResolved,
                ResolvedTimestamp = model.ResolvedTimestamp,
                HasBeenSeenBySharer = model.HasBeenSeenBySharer,
                IsVerified = model.IsVerified
            };
        }

        public async Task<List<IViewModel<Diagnosis>>> BatchBuild(
            List<Diagnosis> models, 
            IViewModelBuilderOptions<Diagnosis> options = null)
        {
            var viewModels = new List<IViewModel<Diagnosis>>();
            foreach (var model in models)
            {
                var viewModel = await Build(model, options);
                viewModels.Add(viewModel);
            }
            return viewModels;
        }

        private string GetName(
            IcdCategory icdCategory,
            DiagnosisViewModelBuilderOptions options,
            string fallbackValue)
        {
            if (icdCategory == null)
                return fallbackValue;
            var hasTranslation = icdCategory.Translations?.ContainsKey(options.Language) ?? false;
            if (hasTranslation)
                return icdCategory.Translations[options.Language];
            return icdCategory.Name;
        }
    }
}
