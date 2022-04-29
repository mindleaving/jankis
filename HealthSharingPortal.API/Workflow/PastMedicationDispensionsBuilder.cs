using System.Collections.Generic;
using System.Linq;
using HealthModels.Medication;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow
{
    public class PastMedicationDispensionsBuilder : MedicationDispensionsBuilderBase
    {
        public List<MedicationDispension> Build(PastMedicationViewModel pastMedication)
        {
            var dispensionBuilderInfos = new DispensionBuilderInfos(
                pastMedication.Pattern,
                pastMedication.Dosage,
                pastMedication.Drug,
                pastMedication.PersonId,
                pastMedication.CreatedBy,
                pastMedication.AdministeredBy);
            var dispensions = BuildForWholeDays(
                pastMedication.StartTimestamp.Date,
                pastMedication.EndTimestamp.Date,
                dispensionBuilderInfos);
            return dispensions
                .Where(x => x.Timestamp > pastMedication.StartTimestamp && x.Timestamp < pastMedication.EndTimestamp)
                .ToList();
        }
    }
}
