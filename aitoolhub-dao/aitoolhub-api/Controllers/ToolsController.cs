using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AIToolHub.API.Services;

namespace AIToolHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly IToolService _toolService;
        public ToolsController(IToolService toolService) => _toolService = toolService;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _toolService.GetAllAsync());

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var tool = await _toolService.GetBySlugAsync(slug);
            return tool == null ? NotFound() : Ok(tool);
        }
    }
}
