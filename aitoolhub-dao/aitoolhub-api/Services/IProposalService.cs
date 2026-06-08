using System.Collections.Generic;
using System.Threading.Tasks;
using AIToolHub.API.DTOs.Proposals;

namespace AIToolHub.API.Services
{
    public interface IProposalService
    {
        Task<IEnumerable<ProposalResponseDto>> GetAllAsync();
        Task<ProposalResponseDto?> GetByIdAsync(int id);
        Task<ProposalResponseDto> CreateAsync(int authorId, CreateProposalDto dto);
        Task<bool> DeleteAsync(int id, int requesterId);
    }
}
