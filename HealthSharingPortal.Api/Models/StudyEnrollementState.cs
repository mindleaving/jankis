namespace HealthSharingPortal.API.Models
{
    public enum StudyEnrollementState
    {
        Undefined = 0, // For validation
        ParticipationOffered = 1, // The data sharer has offered to participate and is waiting to be evaluated by the study team
        Eligible = 2, // The data sharer meets inclusion criteria and no exclusion criteria and is invited to participate
        Enrolled = 3, // The data sharer has accepted the invitation
        Excluded = 4, // The data sharer didn't meet
        Rejected = 5, // The study team rejected enrollment for other reasons other than inclusion/excludion criteria, e.g. maximum number of participants reached
        Left = 6 // The data sharer left
    }
}