using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AIToolHub.API.Repositories;

namespace AIToolHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repo;
        public UsersController(IUserRepository repo) => _repo = repo;

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _repo.GetByIdAsync(userId);
            if (user == null) return NotFound();
            return Ok(new { user.Id, user.Username, user.Email, user.WalletAddress, user.AitBalance, user.VotingPower, user.Role });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(new { user.Id, user.Username, user.WalletAddress, user.AitBalance, user.VotingPower, user.Role });
        }
    }
}
