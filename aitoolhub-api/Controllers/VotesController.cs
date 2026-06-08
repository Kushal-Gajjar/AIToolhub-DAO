using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AIToolHub.API.Services;

namespace AIToolHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VotesController : ControllerBase
    {
        private readonly IVoteService _voteService;
        public VotesController(IVoteService voteService) => _voteService = voteService;

        [HttpPost]
        public async Task<IActionResult> CastVote([FromBody] VoteCastRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _voteService.CastVoteAsync(request.ProposalId, userId, request.IsFor);
            return Ok(new { message = "Vote cast successfully." });
        }

        [HttpGet("{proposalId}/status")]
        public async Task<IActionResult> HasVoted(int proposalId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var voted = await _voteService.HasVotedAsync(proposalId, userId);
            return Ok(new { hasVoted = voted });
        }
    }

    public class VoteCastRequest
    {
        public int ProposalId { get; set; }
        public bool IsFor { get; set; }
    }
}
