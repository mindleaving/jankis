using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class ServiceBatchOrder : IId
    {
        public string Id { get; set; }
        public List<ServiceRequest> Requests { get; set; }
    }
}
