using Microsoft.EntityFrameworkCore;

namespace ExpenseApp.Server.Models
{
    public class ExpenseContext : DbContext
    { 
        public ExpenseContext(DbContextOptions<ExpenseContext> options) : base(options) { }

        public DbSet<ExpenseModel> Expenses { get; set; }
        public DbSet<IncomeModel> Incomes { get; set; }
        public DbSet<BalanceModel> Balances { get; set; }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<CategoryModel> Categories { get; set; }
    }
}
