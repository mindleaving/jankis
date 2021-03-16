namespace JanKIS.API.Models
{
    public class Meal : MealMenuItem
    {
        public string PatientId { get; set; }
        public MealState State { get; set; }
    }

    public enum MealState
    {
        Ordered,
        InPreparation,
        DeliveredToWard,
        DeliveredToPatient,
        Cancelled, // If cancelled after being ordered
        Discarded // If meal was delivered, but patient didn't receive it
    }

    public enum DietaryCharacteristic
    {
        Vegetarian,
        Vegan,
        HighFiber,
        LowFiber,
        Soft
    }
}
