namespace JanKIS.API.Models
{
    public enum MealState
    {
        Ordered,
        InPreparation,
        DeliveredToWard,
        DeliveredToPatient,
        Cancelled, // If cancelled after being ordered
        Discarded // If meal was delivered, but patient didn't receive it
    }
}