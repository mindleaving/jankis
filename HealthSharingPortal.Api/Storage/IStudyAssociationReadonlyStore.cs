using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IStudyAssociationStore : IStudyAssociationReadonlyStore, IStore<StudyAssociation>
    {
    }
    public interface IStudyAssociationReadonlyStore : IReadonlyStore<StudyAssociation>
    {
        Task<List<StudyAssociation>> GetAllStudiesForUser(string username);
        Task<List<StudyAssociation>> GetAllForStudy(string studyId);
        Task<StudyAssociation> GetForUserAndStudy(string username, string studyId);
    }
}
