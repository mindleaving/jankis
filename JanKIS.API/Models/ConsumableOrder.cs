using System;
using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class ConsumableOrder
    {
        public string ConsumableId { get; set; }
        public PersonReference Requester { get; set; }
        public int Quantity { get; set; }
        public List<LocationReference> PreferredSources { get; set; }
        public string Note { get; set; }

        public OrderState State { get; set; }
        public Dictionary<OrderState, DateTime> Timestamps { get; set; }
    }

    public enum OrderState
    {
        Ordered,
        Accepted,
        Declined,
        Delivered,
        CancelledByRequester
    }
}