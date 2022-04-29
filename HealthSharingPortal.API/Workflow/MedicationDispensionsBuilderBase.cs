using System;
using System.Collections.Generic;
using HealthModels;
using HealthModels.Medication;

namespace HealthSharingPortal.API.Workflow
{
    public abstract class MedicationDispensionsBuilderBase
    {
        public class DispensionBuilderInfos
        {
            public DispensionBuilderInfos(
                MedicationSchedulePattern pattern,
                MedicationDosage dosage,
                Drug drug,
                string personId,
                string createdBy,
                string administeredBy)
            {
                Pattern = pattern;
                Dosage = dosage;
                Drug = drug;
                PersonId = personId;
                CreatedBy = createdBy;
                AdministeredBy = administeredBy;
            }

            public MedicationSchedulePattern Pattern { get; }
            public MedicationDosage Dosage { get; }
            public Drug Drug { get; }
            public string PersonId { get; }
            public string CreatedBy { get; }
            public string AdministeredBy { get; }
        }

        public IEnumerable<MedicationDispension> BuildForWholeDays(
            DateTime startDate,
            DateTime endDate,
            DispensionBuilderInfos vm)
        {
            var pattern = vm.Pattern;
            var dosage = vm.Dosage;

            endDate = endDate.Date.AddDays(1);
            var date = startDate.Date;
            while (date < endDate)
            {
                MedicationDispension BuildDispensionForTimeOfDay(
                    DateTime timestamp,
                    int patternMultiplier)
                {
                    var multipliedDosage = ApplyPatternMultiplier(pattern.PatternType, patternMultiplier, pattern.Unit, dosage);
                    return BuildDispension(vm, multipliedDosage, timestamp);
                }
                if (pattern.Morning > 0)
                {
                    var timestamp = date.Add(Constants.MorningTime);
                    yield return BuildDispensionForTimeOfDay(timestamp, pattern.Morning);
                }
                if (pattern.Noon > 0)
                {
                    var timestamp = date.Add(Constants.NoonTime);
                    yield return BuildDispensionForTimeOfDay(timestamp, pattern.Noon);
                }
                if (pattern.Evening > 0)
                {
                    var timestamp = date.Add(Constants.EveningTime);
                    yield return BuildDispensionForTimeOfDay(timestamp, pattern.Evening);
                }
                if (pattern.Night > 0)
                {
                    var timestamp = date.Add(Constants.NightTime);
                    yield return BuildDispensionForTimeOfDay(timestamp, pattern.Night);
                }
                date += TimeSpan.FromDays(1);
            }
        }

        private MedicationDosage ApplyPatternMultiplier(
            MedicationSchedulePatternType patternType,
            int patternMultiplier,
            string patternUnit,
            MedicationDosage dosage)
        {
            switch (patternType)
            {
                case MedicationSchedulePatternType.PillCount:
                    return new MedicationDosage(patternMultiplier * dosage.Value, dosage.Unit);
                case MedicationSchedulePatternType.Amount:
                    return new MedicationDosage(patternMultiplier, patternUnit);
                default:
                    throw new ArgumentOutOfRangeException(nameof(patternType), patternType, null);
            }
        }

        private MedicationDispension BuildDispension(
            DispensionBuilderInfos vm,
            MedicationDosage dosage,
            DateTime timestamp)
        {
            var drug = vm.Drug;
            var personId = vm.PersonId;
            var createdBy = vm.CreatedBy;
            var administeredBy = vm.AdministeredBy;
            return new MedicationDispension
            {
                Id = Guid.NewGuid().ToString(),
                Drug = drug,
                CreatedBy = createdBy,
                Timestamp = timestamp,
                AdministeredBy = administeredBy,
                PersonId = personId,
                HasBeenSeenBySharer = true,
                IsVerified = false,
                Note = string.Empty,
                State = MedicationDispensionState.Dispensed,
                Value = dosage.Value,
                Unit = dosage.Unit,
            };
        }
    }
}