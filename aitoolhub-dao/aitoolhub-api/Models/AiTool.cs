using System;
namespace AIToolHub.API.Models {
    public enum ToolPhase { Phase1 = 1, Phase2 = 2, Phase3 = 3 }
    public enum ToolStatus { Live, Beta, Pending, Deprecated }
    public class AiTool {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ToolPhase Phase { get; set; }
        public ToolStatus Status { get; set; } = ToolStatus.Pending;
        public int UsageCount { get; set; }
        public decimal CostPerUse { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
