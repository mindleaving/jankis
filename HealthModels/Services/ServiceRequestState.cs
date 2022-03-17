namespace HealthModels.Services
{
    public enum ServiceRequestState
    {
        Requested,
        CancelledByRequester,
        Declined,
        Accepted,
        ReadyWhenYouAre, // Example of usage: Operating team is ready for patient and need the patient to be brought to the operating room from ward
        InProgress,
        Fulfilled
    }
}