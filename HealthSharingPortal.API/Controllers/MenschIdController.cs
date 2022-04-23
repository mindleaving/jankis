using System;
using System.Net;
using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models.RequestBodies;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow.MenschId;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenschIdController : ControllerBase
    {
        private readonly ILoginStore loginStore;
        private readonly IMenschIdChallengeStore challengeStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMenschIdApiClient menschIdApiClient;
        private readonly IMenschIdVerifier menschIdVerifier;

        public MenschIdController(
            ILoginStore loginStore,
            IHttpContextAccessor httpContextAccessor,
            IMenschIdChallengeStore challengeStore,
            IMenschIdApiClient menschIdApiClient,
            IMenschIdVerifier menschIdVerifier)
        {
            this.loginStore = loginStore;
            this.httpContextAccessor = httpContextAccessor;
            this.challengeStore = challengeStore;
            this.menschIdApiClient = menschIdApiClient;
            this.menschIdVerifier = menschIdVerifier;
        }

        [Authorize]
        [HttpGet("{menschId}/challenge/create")]
        public async Task<IActionResult> CreateChallenge([FromRoute] string menschId)
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            var currentLogin = await loginStore.GetFromClaimsAsync(claims);
            var menschIdChallenge = await menschIdApiClient.CreateChallenge(menschId);
            var localChallengeData = new MenschIdChallenge
            {
                Id = menschIdChallenge.Id,
                MenschId = menschId,
                LoginId = currentLogin.Id,
                ChallengeShortId = menschIdChallenge.ChallengeShortId,
                ChallengeSecret = menschIdChallenge.ChallengeSecret,
                CreatedTimestamp = menschIdChallenge.CreatedTimestamp
            };
            await challengeStore.StoreAsync(localChallengeData);
            var challengeViewModel = new MenschIdChallengeViewModel
            {
                ChallengeId = menschIdChallenge.Id,
                ChallengeShortId = menschIdChallenge.ChallengeShortId,
                MenschId = menschId
            };
            return Ok(challengeViewModel);
        }

        [HttpPost("{menschId}/challenges/{challengeShortId}/answer")]
        public async Task<IActionResult> ProofOwnership(
            [FromRoute] string menschId,
            [FromRoute] string challengeShortId,
            [FromBody] MenschIdChallengeAnswer body)
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            var currentLogin = await loginStore.GetFromClaimsAsync(claims);
            var challenge = await challengeStore.FirstOrDefaultAsync(x => 
                x.MenschId == menschId 
                && x.ChallengeShortId == challengeShortId.ToUpper()
                && x.LoginId == currentLogin.Id);
            if (challenge == null)
                return NotFound();
            var isCompleted = await menschIdVerifier.TryCompleteChallenge(challenge.Id, body.Secret);
            return isCompleted ? Ok() : StatusCode((int)HttpStatusCode.Forbidden, "Incorrect secret");
        }


    }
}
