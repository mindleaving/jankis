namespace JanKIS.API.Helpers
{
    public static class StringExtensions
    {
        public static string FirstLetterToLowerInvariant(this string str)
        {
            if (string.IsNullOrEmpty(str))
                return str;
            return char.ToLowerInvariant(str[0]) + str.Substring(1);
        }
    }
}
