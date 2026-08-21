import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { BookListComponent } from './features/books/book-list/book-list.component';

import { authGuard } from './core/guards/auth.guard';
import { QuoteListComponent } from './features/quotes/quote-list/quote-list.component';





export const routes: Routes = [
   { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'books', component: BookListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'quotes', component: QuoteListComponent, canActivate: [authGuard] },
];
