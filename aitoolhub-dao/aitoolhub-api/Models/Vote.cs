using System;
namespace AIToolHub.API.Models {
    public class Vote {
        public int Id { get; set; }
        public int ProposalId { get; set; }
        public Proposal Proposal { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public bool IsFor { get; set; }
        public decimal Weight { get; set; }
        public DateTime CastAt { get; set; } = DateTime.UtcNow;
        public string TxHash { get; set; } = string.Empty;
    }
}
