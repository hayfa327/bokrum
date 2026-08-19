using System.Security.Claims;
using BookQuotesApi.Data;
using BookQuotesApi.DTOs.Books;
using BookQuotesApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookQuotesApi.Controllers
{
    [ApiController]
    [Route("api/books")]
    [Authorize]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BooksController(AppDbContext context)
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
            var books = await _context.Books
                .Where(b => b.UserId == userId)
                .ToListAsync();

            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetUserId();
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (book == null)
                return NotFound();

            return Ok(book);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateBookDto dto)
        {
            var userId = GetUserId();

            var book = new Book
            {
                Title = dto.Title,
                Author = dto.Author,
                PublishDate = dto.PublishDate,
                UserId = userId
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateBookDto dto)
        {
            var userId = GetUserId();
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (book == null)
                return NotFound();

            book.Title = dto.Title;
            book.Author = dto.Author;
            book.PublishDate = dto.PublishDate;

            await _context.SaveChangesAsync();

            return Ok(book);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (book == null)
                return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}