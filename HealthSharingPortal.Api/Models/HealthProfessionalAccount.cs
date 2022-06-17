﻿using HealthModels;
using HealthModels.Interview;
using TypescriptGenerator.Attributes;

namespace HealthSharingPortal.API.Models
{
    public class HealthProfessionalAccount : Account
    {
        public HealthProfessionalAccount() {}
        public HealthProfessionalAccount(
            string id,
            string personId = null,
            Language preferedLanguage = Language.en)
            : base(id, AccountType.HealthProfessional, personId, preferedLanguage)
        {
        }

        [TypescriptIsOptional]
        public Address WorkAddress { get; set; }
        [TypescriptIsOptional]
        public string PhoneNumber { get; set; }
        [TypescriptIsOptional]
        public string Email { get; set; }

        public bool CanRequestEmergencyAccess { get; set; }
    }
}