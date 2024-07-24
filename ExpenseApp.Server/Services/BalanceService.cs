using ExpenseApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseApp.Server.Services
{
    public class BalanceService
    {
        private readonly ExpenseContext _context;

        public BalanceService(ExpenseContext context)
        {
            _context = context;
        }

        public async Task<Decimal> UpdateBalance(string Email, int UserId)
        {
            var totalIncome = await _context.Incomes.Where(i => i.UserId == UserId).SumAsync(i => i.Amount);
            var totalExpense = await _context.Expenses.Where(i => i.UserId == UserId).SumAsync(i => i.Cost);

            var totalBalance = totalIncome - totalExpense;

            var recentBalance = await _context.Balances.Where(b => b.UserId == UserId).OrderByDescending(b => b.Id).FirstOrDefaultAsync();

            if (recentBalance != null)
            {
                recentBalance.Balance = totalBalance;
                recentBalance.Email = Email;
                recentBalance.UserId = UserId;
                recentBalance.UpdatedAt = DateTime.Now;
            }

            //BalanceModel balance = new BalanceModel();

                //balance.Balance = totalBalance;
            //balance.Email = Email;
            //balance.UserId = UserId;
            //balance.CreatedAt = DateTime.Now;

            //_context.Balances.Add(balance);
            await _context.SaveChangesAsync();

            return totalIncome - totalExpense;
        }
    
    }
}
