using System.ComponentModel.DataAnnotations;

namespace BookQuotesApi.DTOs.Books
{
    public class UpdateBookDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Author { get; set; } = string.Empty;

        [Required]
        public DateTime PublishDate { get; set; }
    }
}