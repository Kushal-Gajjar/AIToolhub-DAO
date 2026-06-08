using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AIToolHub.API.Data;
using AIToolHub.API.DTOs.Proposals;
using AIToolHub.API.Models;

namespace AIToolHub.API.Services
{
    public class ProposalService : IProposalService
    {
        private readonly AppDbContext _db;

        public ProposalService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<ProposalResponseDto>> GetAllAsync()
        {
            var proposals = await _db.Proposals
                .Include(p => p.Author)
                .Include(p => p.Votes)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return proposals.Select(MapToDto);
        }

        public async Task<ProposalResponseDto?> GetByIdAsync(int id)
        {
            var p = await _db.Proposals
                .Include(p => p.Author)
                .Include(p => p.Votes)
                .FirstOrDefaultAsync(p => p.Id == id);

            return p == null ? null : MapToDto(p);
        }

        public async Task<ProposalResponseDto> CreateAsync(int authorId, CreateProposalDto dto)
        {
            var author = await _db.Users.FindAsync(authorId)
                         ?? throw new InvalidOperationException("User not found.");

            if (author.AitBalance < 100)
                throw new InvalidOperationException("Minimum 100 AIT required to create a proposal.");

            if (!Enum.TryParse<ProposalCategory>(dto.Category, true, out var category))
                category = ProposalCategory.Tools;

            var proposal = new Proposal
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = category,
                BudgetRequest = dto.BudgetRequest,
                AuthorId = authorId,
                Status = ProposalStatus.Pending,
                VotingEndsAt = DateTime.UtcNow.AddDays(7)
            };

            _db.Proposals.Add(proposal);
            await _db.SaveChangesAsync();

            return MapToDto(proposal);
        }

        public async Task<bool> DeleteAsync(int id, int requesterId)
        {
            var p = await _db.Proposals.FindAsync(id);
            if (p == null || p.AuthorId != requesterId) return false;
            _db.Proposals.Remove(p);
            await _db.SaveChangesAsync();
            return true;
        }

        private static ProposalResponseDto MapToDto(Proposal p) => new()
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            Category = p.Category.ToString(),
            Status = p.Status.ToString(),
            BudgetRequest = p.BudgetRequest,
            AuthorUsername = p.Author?.Username ?? "",
            AuthorWallet = p.Author?.WalletAddress ?? "",
            VotesFor = p.Votes.Count(v => v.IsFor),
            VotesAgainst = p.Votes.Count(v => !v.IsFor),
            WeightFor = p.Votes.Where(v => v.IsFor).Sum(v => v.Weight),
            WeightAgainst = p.Votes.Where(v => !v.IsFor).Sum(v => v.Weight),
            CreatedAt = p.CreatedAt,
            VotingEndsAt = p.VotingEndsAt
        };
    }
}
