namespace ExpenseApp.Server.Models
{
    public class ExpenseModel
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public int Cost { get; set; }
        public string CardType { get; set; }
        public DateTime Date { get; set; }
        public string Email { get; set; }

        public int UserId { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
