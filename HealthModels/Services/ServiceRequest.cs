using System;
using System.Collections.Generic;
using Commons.Extensions;
using TypescriptGenerator.Attributes;

namespace HealthModels.Services
{
    public class ServiceRequest : IId
    {
        public ServiceRequest(
            string id,
            ServiceDefinition service,
            string requester,
            string requesterNote,
            Dictionary<string, ServiceParameterResponse> parameterResponses)
        {
            Id = id;
            Service = service;
            Requester = requester;
            ParameterResponses = parameterResponses;
            RequesterNote = requesterNote;
            Timestamps = new List<ServiceRequestStateChange>();
            SetState(ServiceRequestState.Requested);
        }

        public string Id { get; set; }
        public ServiceDefinition Service { get; set; }
        /// <summary>
        /// ID of person requesting the service
        /// </summary>
        public string Requester { get; set; }
        public Dictionary<string, ServiceParameterResponse> ParameterResponses { get; set; }
        public string RequesterNote { get; set; }
        public ServiceRequestState State { get; set; }
        public List<ServiceRequestStateChange> Timestamps { get; set; }
        [TypescriptIsOptional]
        public string AssignedTo { get; set; }
        public string HandlerNote { get; set; }

        public void SetState(ServiceRequestState newState)
        {
            if(newState == State)
                return;
            if(State.InSet(ServiceRequestState.CancelledByRequester, ServiceRequestState.Declined, ServiceRequestState.Fulfilled))
                throw new Exception($"Service request state cannot be changed away from its final state '{State}'");
            Timestamps.Add(new ServiceRequestStateChange(newState, DateTime.UtcNow));
            State = newState;
        }

        public bool TrySetState(ServiceRequestState newState, out string error)
        {
            try
            {
                SetState(newState);
                error = null;
                return true;
            }
            catch (Exception e)
            {
                error = e.Message;
                return false;
            }
        }
    }
}