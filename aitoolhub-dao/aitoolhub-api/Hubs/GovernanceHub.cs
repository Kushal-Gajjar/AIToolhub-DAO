using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace AIToolHub.API.Hubs
{
    public class GovernanceHub : Hub
    {
        public async Task JoinProposalRoom(string proposalId)
            => await Groups.AddToGroupAsync(Context.ConnectionId, $"proposal-{proposalId}");

        public async Task LeaveProposalRoom(string proposalId)
            => await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"proposal-{proposalId}");

        public async Task BroadcastVote(string proposalId, bool isFor, decimal weight)
            => await Clients.Group($"proposal-{proposalId}")
                .SendAsync("VoteCast", new { proposalId, isFor, weight, timestamp = System.DateTime.UtcNow });
    }
}
