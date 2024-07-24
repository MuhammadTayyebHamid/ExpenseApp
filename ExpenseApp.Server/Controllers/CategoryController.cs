using ExpenseApp.Server.Models;
using ExpenseApp.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ExpenseContext _context;

        public CategoryController(ExpenseContext context)
        {
            _context = context; 
        }

        [HttpPost]
        public async Task<ActionResult<CategoryModel>> PostCategory(CategoryModel category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryModel>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }
    }
}
