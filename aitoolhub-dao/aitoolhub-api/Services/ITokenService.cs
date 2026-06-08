using System.Threading.Tasks;
using AIToolHub.API.Models;

namespace AIToolHub.API.Services
{
    public interface ITokenService
    {
        Task<Token?> GetTokenInfoAsync();
        Task<bool> TransferAsync(int fromUserId, int toUserId, decimal amount);
    }
}
