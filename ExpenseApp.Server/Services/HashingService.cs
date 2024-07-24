using ExpenseApp.Server.Models;
using System;
using System.Security.Cryptography;
using System.Text;

namespace ExpenseApp.Server.Services
{
    public class HashingService
    {
        private readonly ExpenseContext _context;

        public HashingService(ExpenseContext context) { _context = context; }

        public string ComputeSha256Hash(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

                StringBuilder sb = new StringBuilder();

                for (int i = 0; i < bytes.Length; i++) {
                    sb.Append(bytes[i].ToString("x2"));
                }
                
                return sb.ToString();
            }
        }
    }
}
