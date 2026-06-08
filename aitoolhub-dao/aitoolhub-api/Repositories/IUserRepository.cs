using System.Threading.Tasks;
using AIToolHub.API.Models;

namespace AIToolHub.API.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByWalletAsync(string walletAddress);
        Task<User> CreateAsync(User user);
        Task UpdateAsync(User user);
    }
}
