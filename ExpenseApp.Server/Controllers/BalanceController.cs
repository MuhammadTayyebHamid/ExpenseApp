using ExpenseApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseApp.Server.Controllers
{
    [Route("Api/[controller]")]
    [ApiController]
    public class BalanceController : ControllerBase
    {
        private readonly ExpenseContext _context;
        public BalanceController(ExpenseContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult GetBalance(int UserId)
        {
            var user = _context.Balances.Where(x => x.UserId == UserId).OrderByDescending(x => x.Id).FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user.Balance);
        }

    }
}
