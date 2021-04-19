using System;
using System.Collections.Generic;
using Commons.Extensions;
using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class ServiceRequest : IId
    {
        public ServiceRequest(
            string id,
            ServiceDefinition service,
            string requester,
            string note,
            Dictionary<string, ServiceParameterResponse> parameterResponses)
        {
            Id = id;
            Service = service;
            Requester = requester;
            ParameterResponses = parameterResponses;
            Note = note;
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
        public string Note { get; set; }
        public ServiceRequestState State { get; set; }
        public List<ServiceRequestStateChange> Timestamps { get; set; }
        [TypescriptIsOptional]
        public string AssignedTo { get; set; }

        public void SetState(ServiceRequestState newState)
        {
            if(newState == State)
                return;
            if(State.InSet(ServiceRequestState.CancelledByRequester, ServiceRequestState.Declined, ServiceRequestState.Fulfilled))
                throw new Exception($"Service request state cannot be changed away from its final state '{State}'");
            Timestamps.Add(new ServiceRequestStateChange(newState, DateTime.UtcNow));
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