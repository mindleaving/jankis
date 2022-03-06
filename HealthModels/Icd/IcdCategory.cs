namespace HealthModels.Icd
{
    public class IcdCategory : IcdEntry, IId
    {
        public IcdCategory(string code, string name)
            : base(name)
        {
            Code = code;
        }

        public string Id => Code;
        public string Code { get; private set; }

        public override string ToString()
        {
            return Name;
        }
    }
}