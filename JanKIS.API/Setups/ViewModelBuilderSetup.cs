using HealthModels;
using HealthModels.Diagnoses;
using HealthModels.Interview;
using HealthModels.Services;
using JanKIS.API.Models;
using JanKIS.API.Workflow.ViewModelBuilders;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JanKIS.API.Setups
{
    public class ViewModelBuilderSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IViewModelBuilder<Account>, AccountViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<AttachedEquipment>, AttachedEquipmentViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Consumable>, ConsumableViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<ConsumableOrder>, ConsumableOrderViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Department>, DepartmentViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Institution>, InstitutionViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<LocationReference>, LocationViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Resource>, ResourceViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<ServiceAudience>, ServiceAudienceViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<ServiceDefinition>, ServiceViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Stock>, StockViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<StockState>, StockStateViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Diagnosis>, DiagnosisViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<QuestionnaireAnswers>, QuestionnaireAnswersViewModelBuilder>();
        }
    }
}
