using System.Linq;
using System.Security.Cryptography;

namespace HealthSharingPortal.API.AccessControl
{
    public class EmergencyTokenGenerator : IEmergencyTokenGenerator
    {
        private const string Characterset = "ACDEFGHJKLMNPQRSTUVWXYZ2345679";
        private const int TokenLength = 26;

        public string Generate()
        {
            return new string(
                Enumerable.Range(0, TokenLength)
                .Select(_ => RandomNumberGenerator.GetInt32(Characterset.Length))
                .Select(characterIndex => Characterset[characterIndex])
                .ToArray()
            );
        }
    }
}
