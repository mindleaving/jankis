using System.Linq;
using System.Security.Cryptography;

namespace HealthSharingPortal.API.AccessControl
{
    public class TemporaryPasswordGenerator
    {
        public string AllowedCharacters { get; set; } = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!.,-_%&#?";

        public string Generate(int length = 16)
        {
            var chars = Enumerable.Range(0, length).Select(_ => GetRandomCharacter()).ToArray();
            return new string(chars);
        }

        private char GetRandomCharacter()
        {
            return AllowedCharacters[RandomNumberGenerator.GetInt32(AllowedCharacters.Length)];
        }
    }
}
