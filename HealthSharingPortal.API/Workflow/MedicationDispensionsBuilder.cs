using System;
using System.Collections.Generic;
using System.Linq;
using HealthModels.Medication;

namespace HealthSharingPortal.API.Workflow
{
    public class MedicationDispensionsBuilder : MedicationDispensionsBuilderBase
    {
        public void BuildForTimeRange(
            MedicationScheduleItem scheduleItem,
            DateTime endTime,
            string personId,
            string createdBy)
        {
            if(scheduleItem.IsPaused)
            {
                scheduleItem.PlannedDispensions.Clear();
                return;
            }
            var startTime = DateTime.UtcNow;

            var dispensionBuilderInfos = new DispensionBuilderInfos(
                scheduleItem.Pattern,
                new MedicationDosage(scheduleItem.Drug.AmountValue, scheduleItem.Drug.AmountUnit),
                scheduleItem.Drug,
                personId,
                createdBy,
                administeredBy: null);
            var candidateDispensions = BuildForWholeDays(
                startTime.Date,
                endTime.Date,
                dispensionBuilderInfos);
            candidateDispensions = candidateDispensions
                .Where(x => x.Timestamp > startTime && x.Timestamp < endTime)
                .ToList();

            foreach (var candidateDispension in candidateDispensions)
            {
                var existingDispension = GetDispensionWithin(
                    scheduleItem.PlannedDispensions, 
                    candidateDispension.Timestamp,
                    TimeSpan.FromMinutes(30));
                if (existingDispension == null)
                {
                    scheduleItem.PlannedDispensions.Add(candidateDispension);
                }
            }
        }

        private MedicationDispension GetDispensionWithin(
            List<MedicationDispension> plannedDispensions,
            DateTime timestamp,
            TimeSpan timeTolerance)
        {
            return plannedDispensions.FirstOrDefault(x => (x.Timestamp - timestamp).Duration() < timeTolerance);
        }
    }
}
