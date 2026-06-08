using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AIToolHub.API.Data;
using AIToolHub.API.Models;

namespace AIToolHub.API.Services
{
    public class ToolService : IToolService
    {
        private readonly AppDbContext _db;

        public ToolService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<AiTool>> GetAllAsync()
            => await _db.AiTools.ToListAsync();

        public async Task<AiTool?> GetBySlugAsync(string slug)
            => await _db.AiTools.FirstOrDefaultAsync(t => t.Slug == slug);

        public async Task LogUsageAsync(int toolId, int userId, bool success, int durationMs)
        {
            _db.ToolUsageLogs.Add(new ToolUsageLog
            {
                ToolId = toolId, UserId = userId,
                Success = success, DurationMs = durationMs, AitCost = 1m
            });
            var tool = await _db.AiTools.FindAsync(toolId);
            if (tool != null) tool.UsageCount++;
            await _db.SaveChangesAsync();
        }
    }
}
