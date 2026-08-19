using BookQuotesApi.Models;

namespace BookQuotesApi.Services
{
    public interface ITokenService
    {
        string GenerateToken(ApplicationUser user);
    }
}