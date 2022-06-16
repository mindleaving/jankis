namespace HealthSharingPortal.API.Models
{
    public static class AutoCompleteContextGenerator
    {
        public static string GetAutoCompleteContextForDiagnosticTestOptions(string testId)
        {
            return $"DiagnosticTest_{testId}_Options";
        }
        public static string GetAutoCompleteContextForDiagnosticTestUnit(string testId)
        {
            return $"DiagnosticTest_{testId}_Unit";
        }
    }
    public enum AutoCompleteContext
    {
        MeasurementType,
        Unit,
        DrugBrand,
        DrugActiveIngredient,
        DrugApplicationSite,
        DrugDispensionForm,
        ResourceGroup,
        ExternalLocation,
        Country
    }
}
