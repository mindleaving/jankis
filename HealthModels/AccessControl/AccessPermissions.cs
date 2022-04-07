namespace HealthModels.AccessControl
{
    public enum AccessPermissions
    {
        None = 0,
        Read = 1 << 0,
        Create = 1 << 1,
        Modify = 1 << 2
    }
}