using System.Collections.Generic;
using HealthModels.Services;
using HealthSharingPortal.API.ViewModels;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class ServiceViewModel : ServiceDefinition, IViewModel<ServiceDefinition>
    {
        public ServiceViewModel(ServiceDefinition model)
            : base(
                model.Id,
                model.Name,
                model.Description,
                model.DepartmentId,
                model.Parameters,
                model.Audience,
                model.AutoAcceptRequests,
                model.IsAvailable)
        {
        }

        public DepartmentViewModel Department { get; set; }
        public List<ServiceAudienceViewModel> AudienceViewModels { get; set; }
    }
}
