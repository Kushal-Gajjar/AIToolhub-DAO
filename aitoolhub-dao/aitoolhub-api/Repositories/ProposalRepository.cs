using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AIToolHub.API.Data;
using AIToolHub.API.Models;

namespace AIToolHub.API.Repositories
{
    public class ProposalRepository : IProposalRepository
    {
        private readonly AppDbContext _db;
        public ProposalRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<Proposal>> GetAllAsync()
            => await _db.Proposals.Include(p => p.Author).Include(p => p.Votes).ToListAsync();

        public async Task<Proposal?> GetByIdAsync(int id)
            => await _db.Proposals.Include(p => p.Author).Include(p => p.Votes).FirstOrDefaultAsync(p => p.Id == id);

        public async Task<Proposal> CreateAsync(Proposal proposal)
        {
            _db.Proposals.Add(proposal);
            await _db.SaveChangesAsync();
            return proposal;
        }

        public async Task UpdateAsync(Proposal proposal)
        {
            _db.Proposals.Update(proposal);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var p = await _db.Proposals.FindAsync(id);
            if (p != null) { _db.Proposals.Remove(p); await _db.SaveChangesAsync(); }
        }
    }
}
