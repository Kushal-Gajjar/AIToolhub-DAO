using System.Collections.Generic;
using System.Threading.Tasks;
using AIToolHub.API.Models;

namespace AIToolHub.API.Repositories
{
    public interface IProposalRepository
    {
        Task<IEnumerable<Proposal>> GetAllAsync();
        Task<Proposal?> GetByIdAsync(int id);
        Task<Proposal> CreateAsync(Proposal proposal);
        Task UpdateAsync(Proposal proposal);
        Task DeleteAsync(int id);
    }
}
