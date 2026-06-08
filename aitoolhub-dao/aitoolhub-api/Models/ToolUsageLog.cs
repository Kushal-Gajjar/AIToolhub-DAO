using System;
namespace AIToolHub.API.Models {
    public class ToolUsageLog {
        public int Id { get; set; }
        public int ToolId { get; set; }
        public AiTool Tool { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string InputSummary { get; set; } = string.Empty;
        public bool Success { get; set; }
        public int DurationMs { get; set; }
        public decimal AitCost { get; set; }
        public DateTime UsedAt { get; set; } = DateTime.UtcNow;
    }
}
