using Microsoft.AspNetCore.Identity;

namespace BookQuotesApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Book> Books { get; set; } = new List<Book>();
        public ICollection<Quote> Quotes { get; set; } = new List<Quote>();
    }
}