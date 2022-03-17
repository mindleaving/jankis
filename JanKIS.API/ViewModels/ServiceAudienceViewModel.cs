using HealthModels;
using HealthModels.Services;
using JanKIS.API.Models;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.ViewModels
{
    public class ServiceAudienceViewModel : ServiceAudience, IViewModel<ServiceAudience>
    {
        public ServiceAudienceViewModel(ServiceAudience model)
        {
            Type = model.Type;
        }

        public override ServiceAudienceType Type { get; }
        [TypescriptIsOptional]
        public Role Role { get; set; }
        [TypescriptIsOptional]
        public Person Person { get; set; }
    }
}
