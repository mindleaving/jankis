﻿namespace JanKIS.API.Models
{
    public class Meal : MealMenuItem
    {
        public string PatientId { get; set; }
        public MealState State { get; set; }
    }
}
