using System.ComponentModel.DataAnnotations;

namespace BookQuotesApi.DTOs.Quotes
{
    public class CreateQuoteDto
    {
        [Required]
        public string Text { get; set; } = string.Empty;

        public string Source { get; set; } = string.Empty;
    }
}