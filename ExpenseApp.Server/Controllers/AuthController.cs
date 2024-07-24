using ExpenseApp.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseApp.Server.Services;


namespace ExpenseApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ExpenseContext _context;
        private readonly HashingService _hashingService;

        public AuthController(ExpenseContext context, HashingService hashingService)
        {
            _context = context;
            _hashingService = hashingService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserModel UserRequest)
        {


            string password = UserRequest.Password;

            password = _hashingService.ComputeSha256Hash(password);

            Console.WriteLine(password);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == UserRequest.Email && u.Password == password);

            if (user == null)
            {
                return BadRequest();
            }

            return Ok(new {Message="Login Successful", UserId = user.Id});
        }

        [HttpPost("SignUp")]
        public async Task<IActionResult> Signup([FromBody] UserModel UserRequest)
        {
            string password = _hashingService.ComputeSha256Hash(UserRequest.Password);

            var user = await _context.Users.AnyAsync(u => u.Email == UserRequest.Email);

            if (user)
            {
                return BadRequest("User Already Exists");
            }

            UserRequest.Password = password;
            UserRequest.CreatedDate = DateTime.Now;

            _context.Users.Add(UserRequest);    // Adding a new user
            await _context.SaveChangesAsync();

            BalanceModel balance = new BalanceModel();

            balance.Balance = 0;
            balance.Email = UserRequest.Email;
            balance.UserId = UserRequest.Id;

            _context.Balances.Add(balance); // Initializing balance to 0
            await _context.SaveChangesAsync();

            return Ok("SignUp Successful");

        }
    }
}
