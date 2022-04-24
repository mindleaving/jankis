using System;
using System.Collections.Generic;
using System.Linq;
using HealthModels.Medication;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow
{
    public class MedicationDispensionsBuilder
    {
        public static readonly TimeSpan MorningTime = TimeSpan.FromHours(7);
        public static readonly TimeSpan NoonTime = TimeSpan.FromHours(12);
        public static readonly TimeSpan EveningTime = TimeSpan.FromHours(18);
        public static readonly TimeSpan NightTime = TimeSpan.FromHours(22);

        public List<MedicationDispension> Build(PastMedicationViewModel pastMedication)
        {
            var dispensions = BuildForWholeDays(
                pastMedication.StartTimestamp.Date,
                pastMedication.EndTimestamp.Date.AddDays(1),
                pastMedication);
            return dispensions
                .Where(x => x.Timestamp > pastMedication.StartTimestamp && x.Timestamp < pastMedication.EndTimestamp)
                .ToList();
        }

        private IEnumerable<MedicationDispension> BuildForWholeDays(
            DateTime startDate,
            DateTime endDate,
            PastMedicationViewModel vm)
        {
            var pattern = vm.Pattern;
            var dosage = vm.Dosage;

            endDate = endDate.Date;
            var date = startDate;
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
                    var timestamp = date.Add(MorningTime);
                    yield return BuildDispensionForTimeOfDay(timestamp, pattern.Morning);
                }
                if (pattern.Noon > 0)
                {
                    var timestamp = date.Add(NoonTime);
                    yield return BuildDispensionForTimeOfDay(timestamp, pattern.Noon);
                }
                if (pattern.Evening > 0)
                {
                    var timestamp = date.Add(EveningTime);
                    yield return BuildDispensionForTimeOfDay(timestamp, pattern.Evening);
                }
                if (pattern.Night > 0)
                {
                    var timestamp = date.Add(NightTime);
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
            PastMedicationViewModel vm,
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
