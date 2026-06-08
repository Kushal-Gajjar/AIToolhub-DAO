using System.Threading.Tasks;

namespace AIToolHub.API.Services
{
    public interface IVoteService
    {
        Task<bool> CastVoteAsync(int proposalId, int userId, bool isFor);
        Task<bool> HasVotedAsync(int proposalId, int userId);
    }
}
