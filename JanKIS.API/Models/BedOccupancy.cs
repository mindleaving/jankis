using System;
using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class BedOccupancy : IId
    {
        public string Id { get; set; }
        public BedState State { get; set; }
        public string DepartmentId { get; set; }
        public string RoomId { get; set; }
        public string BedPosition { get; set; }
        [TypescriptIsOptional]
        public Person Patient { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        [TypescriptIsOptional]
        public string UnavailabilityReason { get; set; }
    }
}