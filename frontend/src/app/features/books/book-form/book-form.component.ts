import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';

interface FieldErrors {
  title?: string;
  author?: string;
  publishDate?: string;
  general?: string;
}

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit {
  title = '';
  author = '';
  publishDate = '';
  coverImageUrl = '';

  isEditMode = signal(false);
  bookId = signal<number | null>(null);
  fieldErrors = signal<FieldErrors>({});
  loading = signal(false);
  saving = signal(false);

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.bookId.set(Number(idParam));
      this.loadBook(Number(idParam));
    }
  }

  loadBook(id: number) {
    this.loading.set(true);
    this.bookService.getById(id).subscribe({
      next: (book) => {
        this.title = book.title;
        this.author = book.author;
        this.publishDate = book.publishDate.split('T')[0];
        this.coverImageUrl = book.coverImageUrl || '';
        this.loading.set(false);
      },
      error: () => {
        this.fieldErrors.set({ general: 'Could not load this book.' });
        this.loading.set(false);
      }
    });
  }

  validate(): boolean {
    const errors: FieldErrors = {};
    if (!this.title.trim()) errors.title = 'Please enter a title.';
    if (!this.author.trim()) errors.author = 'Please enter an author.';
    if (!this.publishDate) errors.publishDate = 'Please select a publish date.';

    this.fieldErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  onSubmit() {
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
      ? this.bookService.update(this.bookId()!, payload)
      : this.bookService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.saving.set(false);
        const message = err.error?.message || 'Could not save this book. Please try again.';
        this.fieldErrors.set({ general: message });
      }
    });
  }
}
