namespace ExpenseApp.Server.Models
{
    public class IncomeModel
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public DateTime Date { get; set; }
        public string CardType {  get; set; }
        public string Email { get; set; }

        public int UserId { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
