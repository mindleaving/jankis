namespace JanKIS.API.Models
{
    public class PermissionModifier
    {
        public PermissionModifier(Permission permission,
            PermissionModifierType type)
        {
            Permission = permission;
            Type = type;
        }

        public Permission Permission { get; set; }
        public PermissionModifierType Type { get; set; }
    }
}