using System;

namespace JanKIS.API.Models
{
    public class ConsumableOrderStateChange
    {
        public ConsumableOrderStateChange(
            OrderState newState,
            DateTime timestamp)
        {
            NewState = newState;
            Timestamp = timestamp;
        }

        public OrderState NewState { get; set; }
        public DateTime Timestamp { get; set; }
    }
}