using System;
using System.Linq;
using System.Threading.Tasks;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.AccessControl
{
    public class MenschIdVerifier : IMenschIdVerifier
    {
        private readonly IMenschIdChallengeStore challengeStore;
        private readonly IAccountStore accountStore;

        public MenschIdVerifier(
            IMenschIdChallengeStore challengeStore,
            IAccountStore accountStore)
        {
            this.challengeStore = challengeStore;
            this.accountStore = accountStore;
        }

        public async Task<bool> TryCompleteChallenge(
            string challengeId,
            string challengeSecret)
        {
            var challenge = await challengeStore.GetByIdAsync(challengeId);
            if (challenge.ChallengeSecret != challengeSecret.ToUpper())
            {
                await challengeStore.IncrementAttemptsCount(challengeId);
                return false;
            }
            if (challenge.IsCompleted)
                return true;
            challenge.IsCompleted = true;
            challenge.CompletedTimestamp = DateTime.UtcNow;
            await challengeStore.StoreAsync(challenge);
            return true;
        }

        public async Task<bool> IsControllingId(
            string menschId,
            string loginId)
        {
            var associatedAccounts = await accountStore.SearchAsync(x => x.LoginIds.Contains(loginId));
            var allControlledLoginIds = associatedAccounts.SelectMany(x => x.LoginIds).Concat(new []{ loginId }).Distinct().ToList();
            var matchingCompletedChallenges = await challengeStore
                .SearchAsync(x => x.MenschId == menschId && x.IsCompleted && allControlledLoginIds.Contains(x.LoginId));
            return matchingCompletedChallenges.Any();
        }
    }
}
