using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AIToolHub.API.Data;
using AIToolHub.API.Models;

namespace AIToolHub.API.Services
{
    public class TokenService : ITokenService
    {
        private readonly AppDbContext _db;
        public TokenService(AppDbContext db) => _db = db;

        public async Task<Token?> GetTokenInfoAsync()
            => await _db.Tokens.FirstOrDefaultAsync();

        public async Task<bool> TransferAsync(int fromUserId, int toUserId, decimal amount)
        {
            var from = await _db.Users.FindAsync(fromUserId);
            var to = await _db.Users.FindAsync(toUserId);
            if (from == null || to == null || from.AitBalance < amount) return false;
            from.AitBalance -= amount;
            to.AitBalance += amount;
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
