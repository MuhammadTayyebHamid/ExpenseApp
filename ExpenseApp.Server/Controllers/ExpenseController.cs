using ExpenseApp.Server.Models;
using ExpenseApp.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly ExpenseContext _context;
        private readonly BalanceService _balanceService;

        public class ExpenseRequest
        {
            public int UserId;
            public int Month;
            public int Year;

        }

        public ExpenseController(ExpenseContext context, BalanceService balanceService)
        {
            _context = context;
            _balanceService = balanceService;
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseModel>> PostExpense(ExpenseModel expense)
        {
            string email = expense.Email;
            int UserId = expense.UserId;

            expense.CardType = "Debit";
            expense.CreatedDate = DateTime.Now;

            Console.WriteLine(email);

            _context.Expenses.Add(expense); // Adding the expense
            await _context.SaveChangesAsync();

            await _balanceService.UpdateBalance(email, UserId); // Updating the balance

            return Ok(expense);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseModel>>> GetExpense(int UserId)
        {
            var expenses = await _context.Expenses.Where(x  => x.UserId == UserId).ToListAsync();

            return Ok(expenses);
        }

        [HttpPost("GetExpensesByMonthYear")]
        public async Task<IActionResult> GetExpensesByMonthYear([FromQuery] int userId, [FromQuery] int month, [FromQuery] int year)
        {
           

            var expenses = await _context.Expenses.Where(e => e.UserId == userId && e.Date.Month == month && 
            e.Date.Year == year).GroupBy(e => e.Category).Select(g => new { Category = g.Key, Amount = g.Sum(e => e.Cost)} ).ToListAsync();

            return Ok(expenses);
        }

        


    }

    
}
