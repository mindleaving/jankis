using System;
using System.Collections.Generic;
using HealthModels;

namespace HealthSharingPortal.API.Models
{
    public class StudyEnrollment : IId
    { 
        public string Id { get; set; }
        public string StudyId { get; set; }
        public string PersonId { get; set; }
        public StudyEnrollementState State { get; set; }
        public List<StudyEnrollmentTimestamp> Timestamps { get; set; }

        public void SetState(StudyEnrollementState state, DateTime timestamp)
        {
            State = state;
            if (Timestamps == null)
                Timestamps = new List<StudyEnrollmentTimestamp>();
            Timestamps.Add(new StudyEnrollmentTimestamp { Timestamp = timestamp, NewEnrollmentState = state });
        }
    }

    public class StudyEnrollmentTimestamp
    {
        public DateTime Timestamp { get; set; }
        public StudyEnrollementState NewEnrollmentState { get; set; }
    }
}
