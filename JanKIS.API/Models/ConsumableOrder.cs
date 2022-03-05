using System;
using System.Collections.Generic;
using Commons.Extensions;
using HealthModels;
using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class ConsumableOrder : IId
    {
        public ConsumableOrder() {}
        protected ConsumableOrder(
            string id,
            string consumableId,
            string consumableName,
            int quantity,
            OrderState state,
            string note,
            string requester,
            List<string> preferredSources,
            List<ConsumableOrderStateChange> timestamps)
        {
            Id = id;
            ConsumableId = consumableId;
            ConsumableName = consumableName;
            Quantity = quantity;
            State = state;
            Note = note;
            Requester = requester;
            PreferredSources = preferredSources ?? new List<string>();
            Timestamps = timestamps ?? new List<ConsumableOrderStateChange>();
        }

        public string Id { get; set; }
        public string ConsumableId { get; set; }
        public string ConsumableName { get; set; }
        public string Requester { get; set; }
        public int Quantity { get; set; }
        public List<string> PreferredSources { get; set; }
        public string Note { get; set; }

        public OrderState State { get; set; }
        [TypescriptIsOptional]
        public string AssignedTo { get; set; }
        /// <summary>
        /// ID of new order if this one was partially delivered
        /// </summary>
        [TypescriptIsOptional]
        public string FollowUpOrderId { get; set; }
        public List<ConsumableOrderStateChange> Timestamps { get; set; }

        public void SetState(OrderState newState)
        {
            if(newState == State)
                return;
            if(State.InSet(OrderState.CancelledByRequester, OrderState.Declined, OrderState.Delivered, OrderState.PartiallyDelivered))
                throw new Exception($"Order state cannot be changed away from its final state '{State}'");
            Timestamps.Add(new ConsumableOrderStateChange(newState, DateTime.UtcNow));
            State = newState;
        }

        public bool TrySetState(
            OrderState newState,
            out string error)
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