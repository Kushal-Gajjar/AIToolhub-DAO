namespace AIToolHub.API.DTOs.Tools {
    public class OcrRequest {
        public string? Base64Image { get; set; }
        public string? Language { get; set; } = "eng";
    }
}
