namespace JanKIS.API.Models
{
    public class NumberServiceParameter : SeriveParameter
    {
        public int Value { get; set; }
        public int? LowerLimit { get; set; }
        public int? UpperLimit { get; set; }
    }
}