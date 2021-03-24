namespace JanKIS.API.Models
{
    public class NumberServiceParameter : ServiceParameter
    {
        public int Value { get; set; }
        public int? LowerLimit { get; set; }
        public int? UpperLimit { get; set; }
    }
}