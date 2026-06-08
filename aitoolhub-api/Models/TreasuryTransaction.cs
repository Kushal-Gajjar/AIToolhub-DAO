using System;
namespace AIToolHub.API.Models {
    public enum TxType { Inflow, Payout, Reward }
    public enum TxStatus { Pending, Confirmed, Failed }
    public class TreasuryTransaction {
        public int Id { get; set; }
        public TxType Type { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public TxStatus Status { get; set; } = TxStatus.Pending;
        public int? ProposalId { get; set; }
        public Proposal? Proposal { get; set; }
        public string TxHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
