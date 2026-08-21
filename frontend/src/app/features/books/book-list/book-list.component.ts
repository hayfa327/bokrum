import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { AuthService } from '../../../core/services/auth.service';
import { Book } from '../../../models/book.model';

interface FieldErrors {
  title?: string;
  author?: string;
  publishDate?: string;
  general?: string;
}

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books = signal<Book[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  searchTerm = signal('');
  confirmingDeleteId = signal<number | null>(null);

  // Modal state
  showModal = signal(false);
  isEditMode = signal(false);
  editingBookId = signal<number | null>(null);
  saving = signal(false);
  fieldErrors = signal<FieldErrors>({});

  // Form fields
  title = '';
  author = '';
  publishDate = '';
  coverImageUrl = '';

  filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.books();
    return this.books().filter(
      (b) => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
    );
  });

   private coverPalette = ['#8FA9B8', '#ebb59d', '#c1df99', '#b8d9f0', '#ffd8ae', '#caacdf'];

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

  // ---- Add / Edit modal ----

  openAddModal() {
    this.isEditMode.set(false);
    this.editingBookId.set(null);
    this.title = '';
    this.author = '';
    this.publishDate = '';
    this.coverImageUrl = '';
    this.fieldErrors.set({});
    this.showModal.set(true);
  }

  openEditModal(book: Book) {
    this.isEditMode.set(true);
    this.editingBookId.set(book.id);
    this.title = book.title;
    this.author = book.author;
    this.publishDate = book.publishDate.split('T')[0];
    this.coverImageUrl = book.coverImageUrl || '';
    this.fieldErrors.set({});
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  private validate(): boolean {
    const errors: FieldErrors = {};
    if (!this.title.trim()) errors.title = 'Please enter a title.';
    if (!this.author.trim()) errors.author = 'Please enter an author.';
    if (!this.publishDate) errors.publishDate = 'Please select a publish date.';

    this.fieldErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  saveBook() {
    if (!this.validate()) return;

    this.saving.set(true);
    this.fieldErrors.set({});

    const payload = {
      title: this.title.trim(),
      author: this.author.trim(),
      publishDate: this.publishDate,
      coverImageUrl: this.coverImageUrl.trim() || null
    };

    const request$ = this.isEditMode()
      ? this.bookService.update(this.editingBookId()!, payload)
      : this.bookService.create(payload);

    request$.subscribe({
      next: (savedBook) => {
        this.saving.set(false);
        if (this.isEditMode()) {
          this.books.update((list) =>
            list.map((b) => (b.id === savedBook.id ? savedBook : b))
          );
        } else {
          this.books.update((list) => [...list, savedBook]);
        }
        this.showModal.set(false);
      },
      error: (err) => {
        this.saving.set(false);
        const message = err.error?.message || 'Could not save this book. Please try again.';
        this.fieldErrors.set({ general: message });
      }
    });
  }

  // ---- Delete ----

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
