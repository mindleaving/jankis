using System;

namespace JanKIS.API.Models
{
    public class ServiceRequestStateChange
    {
        public ServiceRequestStateChange(
            ServiceRequestState newState,
            DateTime timestamp)
        {
            NewState = newState;
            Timestamp = timestamp;
        }

        public ServiceRequestState NewState { get; set; }
        public DateTime Timestamp { get; set; }
    }
}