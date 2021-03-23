namespace JanKIS.API.Models
{
    public class Bed
    {
        public BedState State { get; set; }
        public string RoomId { get; set; }
        public string PatientId { get; set; }
        public string UnavailabilityReason { get; set; }
        public string Note { get; set; }
    }
}