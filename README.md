# Bokrum 📚

> A Scandinavian-inspired personal book library and favorite quotes application.

Bokrum is a responsive full-stack web application built with **Angular 20** and **.NET 9 Web API**. It allows authenticated users to manage their personal book collection and favorite quotes through a clean, Nordic-inspired interface.

This project is being developed as part of a technical assessment for **RedRiver Consulting and Software AB**.

---

## ✨ Features

- 🔐 User registration and login
- 🛡️ JWT-based authentication
- 👤 User management with ASP.NET Core Identity
- 📚 Personal book library with full CRUD
- 💬 Personal favorite quotes with full CRUD
- 🔒 Books and quotes scoped to the authenticated user
- 📱 Responsive desktop, tablet, and mobile design
- 🎨 Bootstrap and Font Awesome
- 🌙 Light and dark mode
- 🔄 Angular HTTP interceptor for JWT requests
- 🛣️ Protected Angular routes
- 🗄️ Entity Framework Core with SQL database
- 📖 RESTful .NET 9 Web API

---

## 🌐 Live Demo

- **Frontend:** Coming soon
- **Backend API:** Coming soon
- **GitHub:** https://github.com/hayfa327/bokrum

---

## 🏗️ Architecture

```text
┌──────────────────────────┐
│       Angular 20         │
│                           │
│  Components               │
│  Services                 │
│  Route Guards             │
│  HTTP Interceptor         │
└────────────┬──────────────┘
             │
             │ HTTP + JWT
             ▼
┌──────────────────────────┐
│       .NET 9 API         │
│                           │
│  Controllers               │
│  JWT Authentication        │
│  ASP.NET Core Identity     │
└────────────┬──────────────┘
             │
             ▼
┌──────────────────────────┐
│   Entity Framework Core  │
└────────────┬──────────────┘
             │
             ▼
┌──────────────────────────┐
│      SQL Database        │
└──────────────────────────┘
```

- The Angular frontend communicates with the .NET 9 REST API over HTTP.
- JWT tokens are attached to protected API requests through an Angular HTTP interceptor.
- The backend uses **ASP.NET Core Identity** for user management and password hashing, while **JWT Bearer Authentication** authenticates API requests.
- Books and quotes are associated with the authenticated user's ID so that users can only access their own data.

---

## 🔐 Authentication

Bokrum uses **ASP.NET Core Identity** combined with **JWT Bearer Authentication**.

### Registration

```
User
  │  username + password
  ▼
Angular
  │  POST /api/auth/register
  ▼
.NET 9 API
  │
  ▼
ASP.NET Core Identity
  │  password hashing
  ▼
User stored in database
```

### Login

```
User
  │  username + password
  ▼
Angular
  │  POST /api/auth/login
  ▼
.NET 9 API
  │
  ▼
ASP.NET Core Identity
  │  verify credentials
  ▼
JWT generated
  │
  ▼
Angular
```

### Authenticated API request

```
Angular
  │  Authorization: Bearer <JWT>
  ▼
HTTP Interceptor
  │
  ▼
.NET 9 API
  │
  ▼
JWT validation
  │
  ▼
[Authorize]
  │
  ▼
Books / Quotes
```

ASP.NET Core Identity handles user management and secure password hashing. JWT Bearer Authentication handles authenticating requests to protected API endpoints.

---

## 🛠️ Tech Stack

### Frontend
- Angular 20
- TypeScript
- Standalone Components
- Angular Router
- HttpClient
- Route Guards
- HTTP Interceptors
- Bootstrap
- Font Awesome
- CSS

### Backend
- .NET 9
- ASP.NET Core Web API
- ASP.NET Core Identity
- JWT Bearer Authentication
- Entity Framework Core
- SQL Server / SQLite
- Swagger / OpenAPI

---

## 📂 Project Structure

```
Bokrum/
│
├── frontend/
│   └── book-quotes-ui/
│       └── src/
│           └── app/
│               ├── core/
│               │   ├── guards/
│               │   ├── interceptors/
│               │   └── services/
│               │
│               ├── models/
│               │
│               ├── shared/
│               │   └── components/
│               │       ├── navbar/
│               │       ├── book-card/
│               │       ├── quote-card/
│               │       └── confirm-modal/
│               │
│               └── features/
│                   ├── auth/
│                   │   ├── login/
│                   │   └── register/
│                   │
│                   ├── books/
│                   │   ├── book-list/
│                   │   └── book-form/
│                   │
│                   └── quotes/
│                       ├── quote-list/
│                       └── quote-form/
│
├── backend/
│   └── BookQuotesApi/
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   ├── BooksController.cs
│       │   └── QuotesController.cs
│       │
│       ├── Models/
│       │   ├── ApplicationUser.cs
│       │   ├── Book.cs
│       │   └── Quote.cs
│       │
│       ├── DTOs/
│       │   ├── Auth/
│       │   ├── Books/
│       │   └── Quotes/
│       │
│       ├── Data/
│       │   └── AppDbContext.cs
│       │
│       ├── Services/
│       │   └── TokenService.cs
│       │
│       ├── Migrations/
│       │
│       ├── Program.cs
│       └── appsettings.json
│
├── README.md
└── .gitignore
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|--------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |

### Books

| Method | Endpoint | Description | Auth |
|--------|----------|--------------|------|
| GET | `/api/books` | Get books for current user | Yes |
| GET | `/api/books/{id}` | Get a specific book | Yes |
| POST | `/api/books` | Create a book | Yes |
| PUT | `/api/books/{id}` | Update a book | Yes |
| DELETE | `/api/books/{id}` | Delete a book | Yes |

### Quotes

| Method | Endpoint | Description | Auth |
|--------|----------|--------------|------|
| GET | `/api/quotes` | Get quotes for current user | Yes |
| GET | `/api/quotes/{id}` | Get a specific quote | Yes |
| POST | `/api/quotes` | Create a quote | Yes |
| PUT | `/api/quotes/{id}` | Update a quote | Yes |
| DELETE | `/api/quotes/{id}` | Delete a quote | Yes |

---

## 📚 Book Management

Authenticated users can:

- View their books
- Add a new book
- Edit book information
- Delete books
- View book details

Example book fields:

- Title
- Author
- Published Date
- Description
- Cover Image
- User ID

Each book is associated with the authenticated user.

---

## 💬 My Quotes

The My Quotes section allows users to manage their favorite quotes.

Users can:

- View their quotes
- Add a quote
- Edit a quote
- Delete a quote

Example:

> "The only way to do great work is to love what you do."
> — Steve Jobs

Quotes are associated with the authenticated user and are not shared between users.

---

## 🎨 Design

Bokrum uses a Scandinavian-inspired visual style.

**Design principles:** Minimal · Calm · Editorial · Spacious · Accessible · Functional

### Color palette

| Role | Color |
|------|-------|
| Background | `#F7F5F0` |
| Primary | `#19324A` |
| Secondary | `#6F8796` |
| Accent | `#C9795B` |
| Sage | `#8A9985` |
| Text | `#202522` |
| Muted | `#6D716E` |
| Border | `#DDD9D0` |

### Typography

- **Newsreader** — headings, book titles, and quotes
- **Inter** — navigation, forms, and general UI

---

## 🌙 Dark Mode

Bokrum supports light and dark themes.

**Light**

| Role | Color |
|------|-------|
| Background | `#F7F5F0` |
| Cards | `#FFFFFF` |
| Text | `#202522` |

**Dark**

| Role | Color |
|------|-------|
| Background | `#172126` |
| Cards | `#202C31` |
| Text | `#F3F0E8` |
| Accent | `#8FA9B8` |

Users can switch between themes using the theme toggle in the navigation.

---

## 📱 Responsive Design

The application is designed for desktop, tablet, and mobile, including:

- Responsive navigation
- Mobile menu
- Responsive book grid
- Responsive quote cards
- Mobile-friendly forms
- Touch-friendly buttons

---

## 🖼️ Screenshots

_Screenshots will be added after the application is implemented._

### Books
_Add screenshot here_

### My Quotes
_Add screenshot here_

### Login
_Add screenshot here_

### Dark Mode
_Add screenshot here_

---

## ⚙️ Setup & Run Locally

### Prerequisites

- Node.js LTS
- Angular CLI
- .NET 9 SDK
- SQL Server or SQLite
- Git

### Clone the repository

```bash
git clone https://github.com/hayfa327/bokrum.git
cd bokrum
```

### Backend

```bash
cd backend/BookQuotesApi
dotnet restore
dotnet ef database update
dotnet run
```

Swagger will be available at the API's Swagger URL shown in the terminal.

### Frontend

Open another terminal:

```bash
cd frontend/book-quotes-ui
npm install
ng serve
```

The Angular application will run at `http://localhost:4200`.

Configure the API URL in the Angular environment configuration before running the application.

---

## 🧪 API Testing

The backend API can be tested using Swagger / OpenAPI or Postman.

Authentication flow:

```
Register
   ↓
Login
   ↓
Receive JWT
   ↓
Send JWT with protected requests
   ↓
Books / Quotes CRUD
```

---

## 🚀 Deployment

Planned deployment:

- **Frontend:** Netlify or Vercel
- **Backend:** Azure or another suitable .NET hosting provider
- **Database:** SQL Server / cloud database depending on hosting configuration

Deployment links will be added once the application is published.

---

## ✅ Development Checklist

### Authentication
- [ ] User registration
- [ ] User login
- [ ] ASP.NET Core Identity
- [ ] JWT generation
- [ ] JWT validation
- [ ] Angular HTTP interceptor
- [ ] Angular authentication guard
- [ ] Logout

### Books
- [ ] Book model
- [ ] Database migration
- [ ] Create book
- [ ] Read books
- [ ] Update book
- [ ] Delete book
- [ ] User-specific books

### Quotes
- [ ] Quote model
- [ ] Create quote
- [ ] Read quotes
- [ ] Update quote
- [ ] Delete quote
- [ ] User-specific quotes

### UI
- [ ] Scandinavian design
- [ ] Bootstrap
- [ ] Font Awesome
- [ ] Responsive layout
- [ ] Mobile navigation
- [ ] Light mode
- [ ] Dark mode
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states

### Deployment
- [ ] Production build
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Configure production API URL
- [ ] Add live demo links
- [ ] Add screenshots

---

## 👤 Author

**Safa** — Frontend Developer, Hyper Island

- GitHub: https://github.com/hayfa327
- LinkedIn: https://linkedin.com/in/haifa-safa-665810176/

---

## 📄 License

This project was created for educational and technical assessment purposes.