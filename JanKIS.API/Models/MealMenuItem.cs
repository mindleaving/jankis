using System;
using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class MealMenuItem
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> Ingredients { get; set; }
        public List<DietaryCharacteristic> DietaryCharacteristics { get; set; }
        public DateTime DeliveryTime { get; set; }
    }
}