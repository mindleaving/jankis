namespace HealthSharingPortal.API.Models
{
    public class StudyEnrollmentStatistics
    {
        public int OpenOffers { get; set; }
        public int Enrolled { get; set; }
        public int Excluded { get; set; }
        public int Rejected { get; set; }
        public int Left { get; set; }
    }
}
