using System;
namespace AIToolHub.API.DTOs.Proposals {
    public class ProposalResponseDto {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal BudgetRequest { get; set; }
        public string AuthorUsername { get; set; } = string.Empty;
        public string AuthorWallet { get; set; } = string.Empty;
        public int VotesFor { get; set; }
        public int VotesAgainst { get; set; }
        public decimal WeightFor { get; set; }
        public decimal WeightAgainst { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime VotingEndsAt { get; set; }
    }
}
