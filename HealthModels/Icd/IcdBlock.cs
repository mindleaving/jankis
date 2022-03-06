namespace HealthModels.Icd
{
    public class IcdBlock : IcdEntry
    {
        public IcdBlock(string name)
            : base(name)
        {
        }

        public override string ToString()
        {
            return Name;
        }
    }
}