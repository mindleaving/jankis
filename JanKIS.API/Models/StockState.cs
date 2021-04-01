using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Stock : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public LocationReference Location { get; set; }
        public string DepartmentId { get; set; }
    }
    public class StockState
    {
        public string StockId { get; set; }
        public int Quantity { get; set; }
        public bool IsOrderable { get; set; }
        public bool IsUnlimitedOrderable { get; set; }
        public List<ServiceAudience> OrderableBy { get; set; }
    }
}