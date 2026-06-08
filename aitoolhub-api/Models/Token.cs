using System;
namespace AIToolHub.API.Models {
    public class Token {
        public int Id { get; set; }
        public string Symbol { get; set; } = "AIT";
        public string Name { get; set; } = "AIToolHub Token";
        public decimal TotalSupply { get; set; }
        public decimal CirculatingSupply { get; set; }
        public string ContractAddress { get; set; } = string.Empty;
        public DateTime DeployedAt { get; set; }
    }
}
