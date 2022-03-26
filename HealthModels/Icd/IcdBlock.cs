namespace HealthModels.Icd
{
    public class IcdBlock : IcdEntry
    {
        public IcdBlock(string version, string name)
            : base(version, name)
        {
        }

        public override string ToString()
        {
            return Name;
        }
    }
}