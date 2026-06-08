using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AIToolHub.API.Data;
using AIToolHub.API.Models;

namespace AIToolHub.API.Services
{
    public class VoteService : IVoteService
    {
        private readonly AppDbContext _db;

        public VoteService(AppDbContext db) => _db = db;

        public async Task<bool> CastVoteAsync(int proposalId, int userId, bool isFor)
        {
            if (await HasVotedAsync(proposalId, userId))
                throw new InvalidOperationException("Already voted on this proposal.");

            var user = await _db.Users.FindAsync(userId)
                       ?? throw new InvalidOperationException("User not found.");
            var proposal = await _db.Proposals.FindAsync(proposalId)
                           ?? throw new InvalidOperationException("Proposal not found.");

            if (proposal.Status != ProposalStatus.Active)
                throw new InvalidOperationException("Proposal is not active.");

            _db.Votes.Add(new Vote
            {
                ProposalId = proposalId,
                UserId = userId,
                IsFor = isFor,
                Weight = user.VotingPower,
                TxHash = "0x" + Guid.NewGuid().ToString("N")
            });

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> HasVotedAsync(int proposalId, int userId)
            => await _db.Votes.AnyAsync(v => v.ProposalId == proposalId && v.UserId == userId);
    }
}
