namespace JanKIS.API.Models
{
    public enum OrderState
    {
        Ordered,
        Accepted,
        Declined,
        Delivered,
        PartiallyDelivered,
        CancelledByRequester
    }
}