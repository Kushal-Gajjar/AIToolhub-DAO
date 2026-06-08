namespace AIToolHub.API.DTOs.Proposals {
    public class CreateProposalDto {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = "Tools";
        public decimal BudgetRequest { get; set; }
    }
}
