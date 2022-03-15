using System.Linq;
using Commons;

namespace HealthSharingPortal.API.AccessControl
{
    public static class TemporaryPasswordGenerator
    {
        private const string AllowedCharacters = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!.,-_%&#?";

        public static string Generate(int length = 16)
        {
            var chars = Enumerable.Range(0, length).Select(_ => GetRandomCharacter()).ToArray();
            return new string(chars);
        }

        private static char GetRandomCharacter()
        {
            // Ideally a crypto-grade random number generate should be used,
            // but this is a temporary password that is printed on paper anyway
            return AllowedCharacters[StaticRandom.Rng.Next(AllowedCharacters.Length)];
        }
    }
}
