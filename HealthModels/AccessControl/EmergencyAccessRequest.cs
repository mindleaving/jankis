using System;

namespace HealthModels.AccessControl
{
    public class EmergencyAccessRequest : IAccessRequest
    {
        public string Id { get; set; }
        public SharedAccessType Type => SharedAccessType.Emergency;
        /// <summary>
        /// Person ID of person requesting the emergency access
        /// </summary>
        public string RequesterId { get; set; }
        /// <summary>
        /// Person ID of person that is in distress and which profile is requested.
        /// If the person ID is not provided, the first name, last name and birthdate must be provided
        /// </summary>
        public string TargetPersonId { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedTimestamp { get; set; }
        public string TargetPersonFirstName { get; set; }
        public string TargetPersonLastName { get; set; }
        public DateTime TargetPersonBirthdate { get; set; }
    }
}
