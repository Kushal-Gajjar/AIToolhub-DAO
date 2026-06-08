using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AIToolHub.API.Services;

namespace AIToolHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TreasuryController : ControllerBase
    {
        private readonly ITreasuryService _treasuryService;
        public TreasuryController(ITreasuryService treasuryService) => _treasuryService = treasuryService;

        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions() => Ok(await _treasuryService.GetTransactionsAsync());

        [HttpGet("balance")]
        public async Task<IActionResult> GetBalance()
        {
            var balance = await _treasuryService.GetTotalBalanceAsync();
            return Ok(new { totalBalance = balance, symbol = "AIT" });
        }
    }
}
