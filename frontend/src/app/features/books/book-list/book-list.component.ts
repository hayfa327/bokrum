import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { AuthService } from '../../../core/services/auth.service';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink , FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books = signal<Book[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  searchTerm = signal('');
  confirmingDeleteId = signal<number | null>(null);

  filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.books();
    return this.books().filter(
      (b) => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
    );
  });

  private coverPalette = ['#19324A', '#C9795B', '#8A9985', '#6F8796', '#8A6B5C', '#5C7A6E'];

  constructor(
    private bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading.set(true);
    this.bookService.getAll().subscribe({
      next: (books) => {
        this.books.set(books);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load your books. Please try again.');
        this.loading.set(false);
      }
    });
  }

  colorFor(id: number): string {
    return this.coverPalette[id % this.coverPalette.length];
  }

  askDelete(id: number) {
    this.confirmingDeleteId.set(id);
  }

  cancelDelete() {
    this.confirmingDeleteId.set(null);
  }

  confirmDelete(id: number) {
    this.bookService.delete(id).subscribe({
      next: () => {
        this.books.update((list) => list.filter((b) => b.id !== id));
        this.confirmingDeleteId.set(null);
      },
      error: () => {
        this.errorMessage.set('Could not delete this book. Please try again.');
        this.confirmingDeleteId.set(null);
      }
    });
  }
}
