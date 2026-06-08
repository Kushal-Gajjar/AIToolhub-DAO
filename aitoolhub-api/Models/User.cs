using System; using System.Collections.Generic;
namespace AIToolHub.API.Models {
    public class User {
        public int Id { get; set; }
        public string WalletAddress { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public decimal AitBalance { get; set; }
        public decimal VotingPower { get; set; }
        public string Role { get; set; } = "Member";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Vote> Votes { get; set; } = new List<Vote>();
        public ICollection<Proposal> Proposals { get; set; } = new List<Proposal>();
        public ICollection<ToolUsageLog> ToolUsageLogs { get; set; } = new List<ToolUsageLog>();
    }
}
