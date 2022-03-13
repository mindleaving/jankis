using System.Collections.Generic;

namespace HealthModels.AccessControl
{
    public interface IAccessFilter
    {
        AccessFilterType Type { get; }
    }

    public class CategoryAccessFilter : IAccessFilter
    {
        public AccessFilterType Type => AccessFilterType.Category;
        public List<PatientInformationCategory> Categories { get; set; }
    }

    public enum PatientInformationCategory
    {
        Undefined = 0, // For validation only
        BasicInformation,
        FamilyInformation,
        Observations,
        AdmissionHistory,
        Documents,
        Notes,
        Medications,
        Diagnosis,
        Genome
    }
}