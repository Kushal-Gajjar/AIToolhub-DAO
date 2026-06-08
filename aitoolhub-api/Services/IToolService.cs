using System.Collections.Generic;
using System.Threading.Tasks;
using AIToolHub.API.Models;

namespace AIToolHub.API.Services
{
    public interface IToolService
    {
        Task<IEnumerable<AiTool>> GetAllAsync();
        Task<AiTool?> GetBySlugAsync(string slug);
        Task LogUsageAsync(int toolId, int userId, bool success, int durationMs);
    }
}
