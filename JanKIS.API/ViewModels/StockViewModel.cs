using HealthSharingPortal.API.ViewModels;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class StockViewModel : Stock, IViewModel<Stock>
    {
        public StockViewModel(Stock model)
            : base(model.Id, model.Name, model.DepartmentId, model.Location)
        {
        }

        public DepartmentViewModel Department { get; set; }
        public LocationViewModel LocationViewModel { get; set; }
    }
}
