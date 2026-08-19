backend/
└── BookQuotesApi/
    │
    ├── Controllers/
    │   ├── AuthController.cs
    │   ├── BooksController.cs
    │   └── QuotesController.cs
    │
    ├── Models/
    │   ├── ApplicationUser.cs
    │   ├── Book.cs
    │   └── Quote.cs
    │
    ├── DTOs/
    │   │
    │   ├── Auth/
    │   │   ├── RegisterDto.cs
    │   │   ├── LoginDto.cs
    │   │   └── AuthResponseDto.cs
    │   │
    │   ├── Books/
    │   │   ├── CreateBookDto.cs
    │   │   └── UpdateBookDto.cs
    │   │
    │   └── Quotes/
    │       ├── CreateQuoteDto.cs
    │       └── UpdateQuoteDto.cs
    │
    ├── Services/
    │   ├── ITokenService.cs
    │   └── TokenService.cs
    │
    ├── Data/
    │   └── AppDbContext.cs
    │
    ├── Migrations/
    │
    ├── Properties/
    │   └── launchSettings.json
    │
    ├── Program.cs
    ├── appsettings.json
    ├── appsettings.Development.json
    ├── BookQuotesApi.csproj
    ├── BookQuotesApi.http
    └── .gitignore

    the backend steps , its match  the museum  project and we add the ASP.NET 