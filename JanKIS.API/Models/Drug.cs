using System.Collections.Generic;
using JanKIS.API.Attributes;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Drug : IId
    {
        public string Id { get; set; }
        public string Brand { get; set; }
        public string ProductName { get; set; }
        [OfferAutocomplete(Context = "DrugActiveIngredients")]
        public List<string> ActiveIngredients { get; set; }
        [OfferAutocomplete(Context = "DrugDispensionForm")]
        public string DispensionForm { get; set; }
        [OfferAutocomplete(Context = "MedicationUnit")]
        public string AmountUnit { get; set; }
        public double AmountValue { get; set; }
        [OfferAutocomplete(Context = "DrugApplicationSite")]
        public string ApplicationSite { get; set; }
    }
}
