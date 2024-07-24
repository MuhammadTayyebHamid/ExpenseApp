namespace ExpenseApp.Server.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public DateTime CreatedDate { get; set; }

    }
}
