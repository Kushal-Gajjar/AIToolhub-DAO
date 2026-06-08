using System; using System.Collections.Generic;
namespace AIToolHub.API.Models {
    public enum ProposalStatus { Pending, Active, Passed, Failed, Executed }
    public enum ProposalCategory { Tools, Treasury, Governance, Partnership }
    public class Proposal {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ProposalCategory Category { get; set; }
        public ProposalStatus Status { get; set; } = ProposalStatus.Pending;
        public decimal BudgetRequest { get; set; }
        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime VotingEndsAt { get; set; }
        public string OnChainTxHash { get; set; } = string.Empty;
        public ICollection<Vote> Votes { get; set; } = new List<Vote>();
    }
}
