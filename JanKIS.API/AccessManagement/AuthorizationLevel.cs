namespace JanKIS.API.AccessManagement
{
    public enum AuthorizationLevel
    {
        Unauthorized, // No access at all
        FilteredAuthorization, // Access to some data or modified data
        FullyAuthorized // No access restrictions
    }
}