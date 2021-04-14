using System;
using System.Collections.Generic;
using Commons.Extensions;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class ServiceRequest : IId
    {
        public ServiceRequest(
            string serviceId,
            string requester,
            Dictionary<string, ServiceParameterResponse> parameterResponses)
        {
            Id = Guid.NewGuid().ToString();
            ServiceId = serviceId;
            Requester = requester;
            ParameterResponses = parameterResponses;
            SetState(ServiceRequestState.Requested);
        }

        public string Id { get; set; }
        public string ServiceId { get; set; }
        /// <summary>
        /// ID of person requesting the service
        /// </summary>
        public string Requester { get; set; }
        public Dictionary<string, ServiceParameterResponse> ParameterResponses { get; set; }
        public string Note { get; set; }

        public ServiceRequestState State { get; set; }
        public Dictionary<ServiceRequestState, DateTime> Timestamps { get; set; }

        private void SetState(ServiceRequestState newState)
        {
            if(newState == State)
                return;
            if(State.InSet(ServiceRequestState.CancelledByRequester, ServiceRequestState.Declined, ServiceRequestState.Fulfilled))
                throw new Exception($"Service request state cannot be changed away from its final state '{State}'");
            Timestamps[newState] = DateTime.UtcNow;
        }
    }
}