namespace ExpenseApp.Server.Models
{
    public class BalanceModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int Balance { get; set; } = 0;
        public int UserId { get; set; } // Foreign Key
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
