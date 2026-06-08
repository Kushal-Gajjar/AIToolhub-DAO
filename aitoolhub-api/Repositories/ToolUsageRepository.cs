using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AIToolHub.API.Data;
using AIToolHub.API.Models;

namespace AIToolHub.API.Repositories
{
    public class ToolUsageRepository : IToolUsageRepository
    {
        private readonly AppDbContext _db;
        public ToolUsageRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<ToolUsageLog>> GetByUserAsync(int userId)
            => await _db.ToolUsageLogs.Where(l => l.UserId == userId).Include(l => l.Tool).ToListAsync();

        public async Task<IEnumerable<ToolUsageLog>> GetByToolAsync(int toolId)
            => await _db.ToolUsageLogs.Where(l => l.ToolId == toolId).ToListAsync();

        public async Task<ToolUsageLog> AddAsync(ToolUsageLog log)
        {
            _db.ToolUsageLogs.Add(log);
            await _db.SaveChangesAsync();
            return log;
        }
    }
}
