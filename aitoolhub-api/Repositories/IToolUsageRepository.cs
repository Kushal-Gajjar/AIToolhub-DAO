using System.Collections.Generic;
using System.Threading.Tasks;
using AIToolHub.API.Models;

namespace AIToolHub.API.Repositories
{
    public interface IToolUsageRepository
    {
        Task<IEnumerable<ToolUsageLog>> GetByUserAsync(int userId);
        Task<IEnumerable<ToolUsageLog>> GetByToolAsync(int toolId);
        Task<ToolUsageLog> AddAsync(ToolUsageLog log);
    }
}
