using System;
using TypescriptGenerator.Attributes;

namespace HealthModels.AccessControl
{
    public class EmergencyAccessRequest : IId
    {
        public string Id { get; set; }
        public SharedAccessType Type => SharedAccessType.Emergency;
        /// <summary>
        /// Username of health professional account requesting the emergency access
        /// </summary>
        public string AccessReceiverUsername { get; set; }
        /// <summary>
        /// Person ID of person that is in distress and which profile is requested.
        /// If the person ID is not provided, the first name, last name and birthdate must be provided
        /// </summary>
        [TypescriptIsOptional]
        public string SharerPersonId { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedTimestamp { get; set; }
        [TypescriptIsOptional]
        public string TargetPersonFirstName { get; set; }
        [TypescriptIsOptional]
        public string TargetPersonLastName { get; set; }
        [TypescriptIsOptional]
        public DateTime TargetPersonBirthdate { get; set; }
    }
}
