using System.Security.Claims;
using BookQuotesApi.Data;
using BookQuotesApi.DTOs.Quotes;
using BookQuotesApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookQuotesApi.Controllers
{
    [ApiController]
    [Route("api/quotes")]
    [Authorize]
    public class QuotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuotesController(AppDbContext context)
        {
            _context = context;
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var quotes = await _context.Quotes
                .Where(q => q.UserId == userId)
                .ToListAsync();

            return Ok(quotes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetUserId();
            var quote = await _context.Quotes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quote == null)
                return NotFound();

            return Ok(quote);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateQuoteDto dto)
        {
            var userId = GetUserId();

            var quote = new Quote
            {
                Text = dto.Text,
                Source = dto.Source,
                UserId = userId
            };

            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = quote.Id }, quote);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateQuoteDto dto)
        {
            var userId = GetUserId();
            var quote = await _context.Quotes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quote == null)
                return NotFound();

            quote.Text = dto.Text;
            quote.Source = dto.Source;

            await _context.SaveChangesAsync();

            return Ok(quote);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var quote = await _context.Quotes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quote == null)
                return NotFound();

            _context.Quotes.Remove(quote);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

