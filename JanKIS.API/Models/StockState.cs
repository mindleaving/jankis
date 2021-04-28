using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class StockState
    {
        public StockState() {}
        public StockState(
            string stockId,
            bool isOrderable,
            bool isUnlimitedOrderable,
            List<ServiceAudience> orderableBy,
            int quantity)
        {
            StockId = stockId;
            IsOrderable = isOrderable;
            IsUnlimitedOrderable = isUnlimitedOrderable;
            OrderableBy = orderableBy;
            Quantity = quantity;
        }

        public string StockId { get; set; }
        public int Quantity { get; set; }
        public bool IsOrderable { get; set; }
        public bool IsUnlimitedOrderable { get; set; }
        public List<ServiceAudience> OrderableBy { get; set; }
    }
}