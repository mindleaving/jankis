using System;

namespace JanKIS.API.Models
{
    public class BedOccupancy
    {
        public string DepartmentId { get; set; }
        public string RoomId { get; set; }
        public string BedIndex { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}