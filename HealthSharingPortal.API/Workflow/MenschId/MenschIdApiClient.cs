using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using HealthSharingPortal.API.Workflow.MenschId.Models;
using Newtonsoft.Json;

namespace HealthSharingPortal.API.Workflow.MenschId
{
    public class MenschIdApiClientSettings
    {
        public string AccessToken { get; set; }
    }

    public class MenschIdApiClient : IMenschIdApiClient
    {
        private readonly HttpClient httpClient;
        private readonly MenschIdApiClientSettings settings;

        public MenschIdApiClient(
            HttpClient httpClient,
            MenschIdApiClientSettings settings)
        {
            this.httpClient = httpClient;
            this.settings = settings;
        }

        public async Task<MenschIdChallenge> CreateChallenge(string menschId)
        {
            var url = $"https://mensch.id/api/id/{menschId}/challenge";
            var response = await httpClient.PostAsync(url, new StringContent("{}", Encoding.UTF8, "application/json"));
            if (!response.IsSuccessStatusCode)
                throw new Exception($"Could not create mensch.ID challenge. mensch.ID returned status {response.StatusCode}");
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<MenschIdChallenge>(json);
        }
    }
}
