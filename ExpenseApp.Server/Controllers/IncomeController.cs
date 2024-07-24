using ExpenseApp.Server.Models;
using ExpenseApp.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseApp.Server.Controllers
{
    [Route("Api/[controller]")]
    [ApiController]
    public class IncomeController : ControllerBase
    {
        private readonly ExpenseContext _context;
        private readonly BalanceService _balanceService;

        public IncomeController(ExpenseContext context, BalanceService balanceService)
        {
            _context = context;
            _balanceService = balanceService;
        }

        [HttpPost]
        public async Task<ActionResult<IncomeModel>> PostIncome(IncomeModel income)
        {
            string email = income.Email;
            int UserId = income.UserId;

            Console.WriteLine(email);

            income.CardType = "Credit";
            income.CreatedDate = DateTime.Now;

            _context.Incomes.Add(income); // Adding Income
            await _context.SaveChangesAsync();

            await _balanceService.UpdateBalance(email, UserId); // Updating the balance

            return Ok(income);
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<IncomeModel>>> GetIncome(int UserId)
        {
            var incomes = await _context.Incomes.Where(x  => x.UserId == UserId).ToListAsync();

            return Ok(incomes);
        }

    }
}
