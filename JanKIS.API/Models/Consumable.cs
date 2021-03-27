using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    /// <summary>
    /// A consumable is material that is used in large quantities and consumed when used or discarded after use.
    /// </summary>
    public class Consumable : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<StockState> StockStates { get; set; }
    }
}