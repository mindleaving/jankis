using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class StudiesController : RestControllerBase<Study>
    {
        private readonly IPersonDataStore<StudyEnrollment> enrollmentStore;
        private readonly IStore<StudyAssociation> studyAssociationStore;
        private readonly IPersonDataReadonlyStore<Person> personStore;
        private readonly IViewModelBuilder<StudyEnrollment> studEnrollmentViewModelBuilder;
        private readonly IAuthorizationModule authorizationModule;

        public StudiesController(
            IStore<Study> store, 
            IHttpContextAccessor httpContextAccessor, 
            IPersonDataStore<StudyEnrollment> enrollmentStore, 
            IStore<StudyAssociation> studyAssociationStore,
            IPersonDataReadonlyStore<Person> personStore,
            IViewModelBuilder<StudyEnrollment> studEnrollmentViewModelBuilder,
            IAuthorizationModule authorizationModule)
            : base(store, httpContextAccessor)
        {
            this.enrollmentStore = enrollmentStore;
            this.studyAssociationStore = studyAssociationStore;
            this.personStore = personStore;
            this.studEnrollmentViewModelBuilder = studEnrollmentViewModelBuilder;
            this.authorizationModule = authorizationModule;
        }

        public override async Task<IActionResult> CreateOrReplace(
            string id,
            Study item)
        {
            var result = await base.CreateOrReplace(id, item);
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var existingAssociationsForUser = await studyAssociationStore.SearchAsync(x => x.StudyId == id && x.AccountId == username);
            if(existingAssociationsForUser.Count == 0)
            {
                var studyAssociation = new StudyAssociation
                {
                    Id = Guid.NewGuid().ToString(),
                    Role = StudyStaffRole.Investigator,
                    StudyId = id,
                    AccountId = username
                };
                await studyAssociationStore.StoreAsync(studyAssociation);
            }
            return result;
        }

        [HttpGet("{studyId}/enrollments")]
        [HttpGet("{studyId}/enrollments/search")]
        public async Task<IActionResult> Enrollments(
            [FromRoute] string studyId,
            [FromQuery] DataRepresentationType mode = DataRepresentationType.Model, 
            [FromQuery] int? count = null,
            [FromQuery] int? skip = 0,
            [FromQuery] string searchText = null,
            [FromQuery] StudyEnrollementState? state = null)
        {
            if (state == StudyEnrollementState.Undefined)
                state = null;
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Researcher)
                return Forbid("Only researchers associated with the study can access enrollments");
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var myAssociations = await studyAssociationStore.SearchAsync(x => x.StudyId == studyId && x.AccountId == username);
            if (!myAssociations.Any())
                return Forbid("You are not associated with study");
            var accessGrants = AccessGrantHelpers.GrantReadAccessToAllPersons();
            var filterExpressions = new List<Expression<Func<StudyEnrollment, bool>>>
            {
                x => x.StudyId == studyId
            };
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                var personFilter = SearchExpressionBuilder.Or(
                    SearchExpressionBuilder.ContainsAny<Person>(x => x.FirstName.ToLower(), searchText),
                    SearchExpressionBuilder.ContainsAny<Person>(x => x.LastName.ToLower(), searchText)
                );
                var matchingPersons = await personStore.SearchAsync(
                    personFilter,
                    AccessGrantHelpers.GrantReadAccessToAllPersons());
                if (matchingPersons.Count == 0)
                    return Ok(new List<StudyEnrollment>());
                var personIds = matchingPersons.Select(x => x.Id).ToList();
                filterExpressions.Add(x => personIds.Contains(x.PersonId));
            }
            if (state.HasValue)
            {
                filterExpressions.Add(x => x.State == state.Value);
            }

            var combinedFilter = SearchExpressionBuilder.And(filterExpressions.ToArray());
            var enrollments = await enrollmentStore.SearchAsync(combinedFilter, accessGrants, count, skip);
            enrollments = enrollments.OrderBy(x => x.State).ToList();
            if (mode == DataRepresentationType.Model)
                return Ok(enrollments);
            var viewModels = await studEnrollmentViewModelBuilder.BatchBuild(enrollments, new StudyEnrollmentViewModelBuilderOptions
            {
                AccessGrants = accessGrants
            });
            return Ok(viewModels);
        }

        [HttpGet("{studyId}/enrollments/{enrollmentId}")]
        public async Task<IActionResult> GetEnrollment(
            [FromRoute] string studyId,
            [FromRoute] string enrollmentId)
        {
            var accessGrants = await GetAccessGrants();
            var enrollment = await enrollmentStore.GetByIdAsync(enrollmentId, accessGrants);
            if (enrollment == null)
                return NotFound();
            if (enrollment.StudyId != studyId)
                return NotFound();
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType == AccountType.Sharer)
            {
                var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
                if (enrollment.PersonId == personId)
                {
                    var viewModel = await studEnrollmentViewModelBuilder.Build(enrollment, new StudyEnrollmentViewModelBuilderOptions
                    {
                        AccessGrants = accessGrants
                    });
                    return Ok(viewModel);
                }
            }
            if (accountType == AccountType.Researcher)
            {
                var username = ControllerHelpers.GetAccountId(httpContextAccessor);
                var myAssociations = await studyAssociationStore.SearchAsync(x => x.StudyId == studyId && x.AccountId == username);
                if (myAssociations.Any())
                {
                    var viewModel = await studEnrollmentViewModelBuilder.Build(enrollment, new StudyEnrollmentViewModelBuilderOptions
                    {
                        AccessGrants = accessGrants
                    });
                    return Ok(viewModel);
                }
            }
            return Forbid();
        }



        [HttpGet("{studyId}/team")]
        public async Task<IActionResult> GetTeam([FromRoute] string studyId)
        {
            var team = await studyAssociationStore.SearchAsync(x => x.StudyId == studyId);
            return Ok(team);
        }


        [HttpPost("{studyId}/team")]
        public async Task<IActionResult> AddTeamMember([FromRoute] string studyId, StudyAssociation newTeamMember)
        {
            if (newTeamMember.StudyId != studyId)
                return BadRequest("Study ID of route doesn't match body");
            if (!await store.ExistsAsync(studyId))
                return NotFound("Study doesn't exist");
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Researcher)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only researchers associated with the study can see enrollments");
            var isAssociatedWithStudy = await IsCurrentUserAssociatedWithStudy(studyId);
            if (!isAssociatedWithStudy)
                return StatusCode((int)HttpStatusCode.Forbidden, "You are not associated with the study");
            var existingAssociation = await studyAssociationStore.SearchAsync(x => x.AccountId == newTeamMember.AccountId && x.StudyId == studyId);
            if (existingAssociation != null)
                return Ok();
            await studyAssociationStore.StoreAsync(newTeamMember);
            return Ok();
        }

        [HttpDelete("{studyId}/team/{usernameToBeRemoved}")]
        public async Task<IActionResult> RemoveTeamMember([FromRoute] string studyId, [FromRoute] string usernameToBeRemoved)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Researcher)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only researchers associated with the study can see enrollments");
            var isAssociatedWithStudy = await IsCurrentUserAssociatedWithStudy(studyId);
            if (!isAssociatedWithStudy)
                return StatusCode((int)HttpStatusCode.Forbidden, "You are not associated with the study");
            var existingAssociations = await studyAssociationStore.SearchAsync(x => x.AccountId == usernameToBeRemoved && x.StudyId == studyId);
            if (existingAssociations.Count == 0)
                return Ok();
            var study = await store.GetByIdAsync(studyId);
            if (study.CreatedBy == usernameToBeRemoved)
                return StatusCode((int)HttpStatusCode.Forbidden, "Creator of the study cannot be removed");
            foreach (var existingAssociation in existingAssociations)
            {
                await studyAssociationStore.DeleteAsync(existingAssociation.Id);
            }
            return Ok();
        }

        [HttpGet("{studyId}/enrollments/statistics")]
        public async Task<IActionResult> EnrollmentStatistics([FromRoute] string studyId)
        {
            var readAccessGrant = AccessGrantHelpers.GrantReadAccessToAllPersons();
            var enrollments = await enrollmentStore.SearchAsync(x => x.StudyId == studyId, readAccessGrant);
            var enrollmentStatistics = new StudyEnrollmentStatistics(enrollments);
            return Ok(enrollmentStatistics);
        }


        [HttpPost("{studyId}/offerparticipation")]
        public async Task<IActionResult> OfferParticipation([FromRoute] string studyId, [FromBody] StudyEnrollment body)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Sharer)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only data sharers can enroll into a study");
            var study = await store.GetByIdAsync(studyId);
            if (study == null)
                return NotFound("Study does not exist");
            if (!study.IsAcceptingEnrollments)
                return BadRequest("Study does currently not accept enrollments");
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            CorrectQuestionnaireAnswers(body, personId);
            var accessGrants = await GetAccessGrants();
            var existingEnrollments = await enrollmentStore.SearchAsync(x => x.StudyId == studyId && x.PersonId == personId, accessGrants);
            if (existingEnrollments.Count == 1)
            {
                var existingEnrollment = existingEnrollments[0];
                switch (existingEnrollment.State)
                {
                    case StudyEnrollementState.Undefined:
                    case StudyEnrollementState.Left:
                    {
                        existingEnrollment.SetState(StudyEnrollementState.ParticipationOffered, DateTime.UtcNow);
                        existingEnrollment.InclusionCriteriaQuestionnaireAnswers = body.InclusionCriteriaQuestionnaireAnswers;
                        existingEnrollment.ExclusionCriteriaQuestionnaireAnswers = body.ExclusionCriteriaQuestionnaireAnswers;
                        existingEnrollment.Permissions = body.Permissions;
                        await PersonDataControllerHelpers.Store(enrollmentStore, existingEnrollment, accessGrants, httpContextAccessor);
                        return Ok();
                    }
                    case StudyEnrollementState.ParticipationOffered:
                        return Ok();
                    case StudyEnrollementState.Eligible:
                        return Ok($"You are eligible and are invited to enroll. Use api/studies/{studyId}/accept to accept the invitation or api/studies/{studyId}/leave to leave the study.");
                    case StudyEnrollementState.Enrolled:
                        return Ok("You are already enrolled");
                    case StudyEnrollementState.Excluded:
                        return StatusCode((int)HttpStatusCode.Forbidden, "You dont' meet the incluseion/exclusion criteria");
                    case StudyEnrollementState.Rejected:
                        return StatusCode((int)HttpStatusCode.Forbidden, "You have been rejected");
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
            if (existingEnrollments.Count > 1)
            {
                await DeleteEnrollments(existingEnrollments, accessGrants);
            }

            var newEnrollment = new StudyEnrollment
                {
                    Id = Guid.NewGuid().ToString(), 
                    PersonId = personId, 
                    StudyId = studyId, 
                    InclusionCriteriaQuestionnaireAnswers = body.InclusionCriteriaQuestionnaireAnswers,
                    ExclusionCriteriaQuestionnaireAnswers = body.ExclusionCriteriaQuestionnaireAnswers,
                    Permissions = body.Permissions
                };
            newEnrollment.SetState(StudyEnrollementState.ParticipationOffered, DateTime.UtcNow);
            await PersonDataControllerHelpers.Store(enrollmentStore, newEnrollment, accessGrants, httpContextAccessor);
            return Ok();
        }

        private async Task<List<IPersonDataAccessGrant>> GetAccessGrants()
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            return await authorizationModule.GetAccessGrants(claims);
        }

        private void CorrectQuestionnaireAnswers(
            StudyEnrollment studyEnrollment,
            string personId)
        {
            var utcNow = DateTime.UtcNow;
            studyEnrollment.InclusionCriteriaQuestionnaireAnswers
                .ForEach(
                    questionnaireAnswer =>
                    {
                        questionnaireAnswer.PersonId = personId;
                        questionnaireAnswer.Timestamp = utcNow;
                    });
            studyEnrollment.ExclusionCriteriaQuestionnaireAnswers
                .ForEach(
                    questionnaireAnswer =>
                    {
                        questionnaireAnswer.PersonId = personId;
                        questionnaireAnswer.Timestamp = utcNow;
                    });
        }

        private async Task DeleteEnrollments(
            List<StudyEnrollment> existingEnrollments,
            List<IPersonDataAccessGrant> accessGrants)
        {
            // This should never happen, but if it does:
            // Delete all enrollments and start over
            foreach (var existingEnrollment in existingEnrollments)
            {
                await PersonDataControllerHelpers.Delete(enrollmentStore, existingEnrollment.Id, accessGrants, httpContextAccessor);
            }
        }

        [HttpPost("{studyId}/leave")]
        public async Task<IActionResult> LeaveStudy([FromRoute] string studyId)
        {
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            var accessGrants = await GetAccessGrants();
            var enrollments = await enrollmentStore.SearchAsync(x => x.PersonId == personId && x.StudyId == studyId, accessGrants);
            var utcNow = DateTime.UtcNow;
            foreach (var enrollment in enrollments)
            {
                enrollment.SetState(StudyEnrollementState.Left, utcNow);
                await PersonDataControllerHelpers.Store(enrollmentStore, enrollment, accessGrants, httpContextAccessor);
            }
            return Ok();
        }

        [HttpPost("{studyId}/enrollments/{enrollmentId}/invite")]
        public async Task<IActionResult> InviteCandidate([FromRoute] string studyId, [FromRoute] string enrollmentId)
        {
            var readAccessGrant = AccessGrantHelpers.GrantReadAccessToAllPersons();
            var enrollment = await enrollmentStore.GetByIdAsync(enrollmentId, readAccessGrant);
            if (enrollment == null)
                return NotFound();
            if (enrollment.StudyId != studyId)
                return NotFound();
            if (enrollment.State == StudyEnrollementState.Undefined)
                return BadRequest("Enrollment is in an invalid state and cannot be changed");
            if (enrollment.State == StudyEnrollementState.Left)
                return BadRequest("Candidate has left the study");
            if (enrollment.State == StudyEnrollementState.Enrolled)
                return Ok("Candidate is already enrolled");
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Researcher)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only researchers associated with the study can invite participants");
            var isAssociatedWithStudy = await IsCurrentUserAssociatedWithStudy(enrollment.StudyId);
            if (!isAssociatedWithStudy)
                return StatusCode((int)HttpStatusCode.Forbidden, "You are not associated with the study");
            var modifyAccessGrant = AccessGrantHelpers.GrantForPersonWithPermission(enrollment.PersonId, AccessPermissions.Modify);
            enrollment.SetState(StudyEnrollementState.Eligible, DateTime.UtcNow);
            await PersonDataControllerHelpers.Store(enrollmentStore, enrollment, modifyAccessGrant, httpContextAccessor);
            return Ok();
        }

        [HttpPost("{studyId}/accept")]
        public async Task<IActionResult> AcceptInvitation([FromRoute] string studyId)
        {
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            var accessGrants = await GetAccessGrants();
            var enrollments = await enrollmentStore.SearchAsync(x => x.StudyId == studyId && x.PersonId == personId, accessGrants);
            if (enrollments.Count == 0)
                return NotFound();
            if (enrollments.Count > 1)
            {
                await DeleteEnrollments(enrollments, accessGrants);
                return StatusCode(
                    (int)HttpStatusCode.InternalServerError,
                    "Multiple enrollments matched. To ensure a consistent state all your enrollments to this study were deleted. "
                    + "You need to offer you participation again and the study team must then send you a new eligibility notice (invitation). "
                    + "Apologies for the trouble.");
            }
            var enrollment = enrollments[0];
            if (enrollment.State == StudyEnrollementState.Enrolled)
                return Ok("You are already enrolled");
            if (enrollment.State != StudyEnrollementState.Eligible)
                return BadRequest("You have not yet been determined to be eligible");

            enrollment.SetState(StudyEnrollementState.Enrolled, DateTime.UtcNow);
            await PersonDataControllerHelpers.Store(enrollmentStore, enrollment, accessGrants, httpContextAccessor);
            return Ok();
        }

        [HttpPost("{studyId}/enrollments/{enrollmentId}/exclude")]
        public async Task<IActionResult> ExcludeCandidate([FromRoute] string studyId, [FromRoute] string enrollmentId)
        {
            var readAccessGrant = AccessGrantHelpers.GrantReadAccessToAllPersons();
            var enrollment = await enrollmentStore.GetByIdAsync(enrollmentId, readAccessGrant);
            if (enrollment == null)
                return NotFound();
            if (enrollment.StudyId != studyId)
                return NotFound();
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Researcher)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only researchers associated with the study can exclude participants");
            var isAssociatedWithStudy = await IsCurrentUserAssociatedWithStudy(enrollment.StudyId);
            if (!isAssociatedWithStudy)
                return StatusCode((int)HttpStatusCode.Forbidden, "You are not associated with the study");
            var modifyAccessGrant = AccessGrantHelpers.GrantForPersonWithPermission(enrollment.PersonId, AccessPermissions.Modify);
            enrollment.SetState(StudyEnrollementState.Excluded, DateTime.UtcNow);
            await PersonDataControllerHelpers.Store(enrollmentStore, enrollment, modifyAccessGrant, httpContextAccessor);
            return Ok();
        }

        [HttpPost("{studyId}/enrollments/{enrollmentId}/reject")]
        public async Task<IActionResult> RejectCandidate([FromRoute] string studyId, [FromRoute] string enrollmentId)
        {
            var readAccessGrant = AccessGrantHelpers.GrantReadAccessToAllPersons();
            var enrollment = await enrollmentStore.GetByIdAsync(enrollmentId, readAccessGrant);
            if (enrollment == null)
                return NotFound();
            if (enrollment.StudyId != studyId)
                return NotFound();
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Researcher)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only researchers associated with the study can reject participants");
            var isAssociatedWithStudy = await IsCurrentUserAssociatedWithStudy(enrollment.StudyId);
            if (!isAssociatedWithStudy)
                return StatusCode((int)HttpStatusCode.Forbidden, "You are not associated with the study");
            var modifyAccessGrant = AccessGrantHelpers.GrantForPersonWithPermission(enrollment.PersonId, AccessPermissions.Modify);
            enrollment.SetState(StudyEnrollementState.Rejected, DateTime.UtcNow);
            await PersonDataControllerHelpers.Store(enrollmentStore, enrollment, modifyAccessGrant, httpContextAccessor);
            return Ok();
        }

        private async Task<bool> IsCurrentUserAssociatedWithStudy(string studyId)
        {
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var studyAssociation = await studyAssociationStore.SearchAsync(x => x.AccountId == username && x.StudyId == studyId);
            return studyAssociation.Count > 0;
        }


        protected override Task<object> TransformItem(
            Study item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Study, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "title" => x => x.Title,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Study, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Study>(x => x.Title.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Study>(x => x.Description.ToLower(), searchTerms)
            );
        }

        protected override Task PublishChange(
            Study item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to publish
            return Task.CompletedTask;
        }
    }
}
