namespace JanKIS.API.Models
{
    public class Meal : MealMenuItem
    {
        public string PersonId { get; set; }
        public MealState State { get; set; }
    }
}
