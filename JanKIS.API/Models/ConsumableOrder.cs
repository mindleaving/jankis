using System;
using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class ConsumableOrder : IId
    {
        public string Id { get; set; }
        public string ConsumableId { get; set; }
        public string Requester { get; set; }
        public int Quantity { get; set; }
        public List<string> PreferredSources { get; set; }
        public string Note { get; set; }

        public OrderState State { get; set; }
        public Dictionary<OrderState, DateTime> Timestamps { get; set; }
    }
}