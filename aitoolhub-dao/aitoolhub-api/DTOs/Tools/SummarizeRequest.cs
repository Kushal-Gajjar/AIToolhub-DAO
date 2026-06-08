namespace AIToolHub.API.DTOs.Tools {
    public class SummarizeRequest {
        public string Text { get; set; } = string.Empty;
        public string Length { get; set; } = "standard"; // brief | standard | detailed
    }
}
