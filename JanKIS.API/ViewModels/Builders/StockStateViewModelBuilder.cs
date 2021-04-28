using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.ViewModels.Builders
{
    public class StockStateViewModelBuilder : IViewModelBuilder<StockState>
    {
        private readonly ICachedReadonlyStore<Stock> stocksStore;
        private readonly IViewModelBuilder<Stock> stockViewModelBuilder;
        private readonly IViewModelBuilder<ServiceAudience> serviceAudienceViewModelBuilder;

        public StockStateViewModelBuilder(
            ICachedReadonlyStore<Stock> stocksStore,
            IViewModelBuilder<Stock> stockViewModelBuilder,
            IViewModelBuilder<ServiceAudience> serviceAudienceViewModelBuilder)
        {
            this.stocksStore = stocksStore;
            this.stockViewModelBuilder = stockViewModelBuilder;
            this.serviceAudienceViewModelBuilder = serviceAudienceViewModelBuilder;
        }

        public async Task<IViewModel<StockState>> Build(StockState model)
        {
            var stock = await stocksStore.CachedGetByIdAsync(model.StockId);
            var stockViewModel = await stockViewModelBuilder.Build(stock);
            var audience = new List<ServiceAudienceViewModel>();
            foreach (var serviceAudience in model.OrderableBy)
            {
                var serviceAudienceViewModel = await serviceAudienceViewModelBuilder.Build(serviceAudience);
                audience.Add((ServiceAudienceViewModel) serviceAudienceViewModel);
            }
            return new StockStateViewModel(model)
            {
                Stock = (StockViewModel) stockViewModel,
                Audience = audience
            };
        }
    }
}
