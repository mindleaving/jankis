using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class ConsumableOrderViewModelBuilder : IViewModelBuilder<ConsumableOrder>
    {
        private readonly ICachedReadonlyStore<Consumable> consumablesStore;
        private readonly ICachedReadonlyStore<Account> accountsStore;
        private readonly IViewModelBuilder<Account> accountViewModelBuilder;
        private readonly ICachedReadonlyStore<Stock> stocksStore;
        private readonly IViewModelBuilder<Stock> stockViewModelBuilder;

        public ConsumableOrderViewModelBuilder(
            ICachedReadonlyStore<Consumable> consumablesStore,
            ICachedReadonlyStore<Account> accountsStore,
            IViewModelBuilder<Account> accountViewModelBuilder,
            ICachedReadonlyStore<Stock> stocksStore,
            IViewModelBuilder<Stock> stockViewModelBuilder)
        {
            this.consumablesStore = consumablesStore;
            this.accountsStore = accountsStore;
            this.accountViewModelBuilder = accountViewModelBuilder;
            this.stocksStore = stocksStore;
            this.stockViewModelBuilder = stockViewModelBuilder;
        }

        public async Task<IViewModel<ConsumableOrder>> Build(ConsumableOrder model, IViewModelBuilderOptions<ConsumableOrder> options = null)
        {
            var consumable = await consumablesStore.CachedGetByIdAsync(model.ConsumableId);
            var requesterAccount = await accountsStore.CachedGetByIdAsync(model.Requester);
            var requesterViewModel = await accountViewModelBuilder.Build(requesterAccount);
            var stockViewModels = new List<StockViewModel>();
            foreach (var stockId in model.PreferredSources)
            {
                var stock = await stocksStore.CachedGetByIdAsync(stockId);
                var stockViewModel = await stockViewModelBuilder.Build(stock);
                stockViewModels.Add((StockViewModel) stockViewModel);
            }
            return new ConsumableOrderViewModel(model)
            {
                Consumable = consumable,
                RequesterViewModel = (AccountViewModel) requesterViewModel,
                StockViewModels = stockViewModels
            };
        }

        public Task<List<IViewModel<ConsumableOrder>>> BatchBuild(
            List<ConsumableOrder> models,
            IViewModelBuilderOptions<ConsumableOrder> options = null)
        {
            throw new System.NotImplementedException();
        }
    }
}
