using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class StockState
    {
        public string StockId { get; set; }
        public int Quantity { get; set; }
        public bool IsOrderable { get; set; }
        public bool IsUnlimitedOrderable { get; set; }
        public List<ServiceAudience> OrderableBy { get; set; }
    }
}