import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteService } from '../../../core/services/quote.service';
import { Quote } from '../../../models/quote.model';

interface FieldErrors {
  text?: string;
  author?: string;
  general?: string;
}

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-list.component.html',
  styleUrl: './quote-list.component.css'
})
export class QuoteListComponent implements OnInit {
  quotes = signal<Quote[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  confirmingDeleteId = signal<number | null>(null);

  showModal = signal(false);
  isEditMode = signal(false);
  editingQuoteId = signal<number | null>(null);
  saving = signal(false);
  fieldErrors = signal<FieldErrors>({});

  // form fields
  text = '';
  author = '';
  bookTitle = '';

  constructor(private quoteService: QuoteService) {}

  ngOnInit() {
    this.loadQuotes();
  }

  loadQuotes() {
    this.loading.set(true);
    this.quoteService.getAll().subscribe({
      next: (quotes) => {
        this.quotes.set(quotes);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load your quotes. Please try again.');
        this.loading.set(false);
      }
    });
  }

  // "Author, Book Title" <-> split for display
  authorOf(source: string): string {
    return source.split(',')[0]?.trim() || source;
  }

  bookOf(source: string): string | null {
    const parts = source.split(',');
    return parts.length > 1 ? parts.slice(1).join(',').trim() : null;
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.editingQuoteId.set(null);
    this.text = '';
    this.author = '';
    this.bookTitle = '';
    this.fieldErrors.set({});
    this.showModal.set(true);
  }

  openEditModal(quote: Quote) {
    this.isEditMode.set(true);
    this.editingQuoteId.set(quote.id);
    this.text = quote.text;
    this.author = this.authorOf(quote.source);
    this.bookTitle = this.bookOf(quote.source) || '';
    this.fieldErrors.set({});
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  private validate(): boolean {
    const errors: FieldErrors = {};
    if (!this.text.trim()) errors.text = 'Please enter a quote.';
    if (!this.author.trim()) errors.author = 'Please enter an author.';
    this.fieldErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  saveQuote() {
    if (!this.validate()) return;

    this.saving.set(true);
    this.fieldErrors.set({});

    const source = this.bookTitle.trim()
      ? `${this.author.trim()}, ${this.bookTitle.trim()}`
      : this.author.trim();

    const payload = { text: this.text.trim(), source };

    const request$ = this.isEditMode()
      ? this.quoteService.update(this.editingQuoteId()!, payload)
      : this.quoteService.create(payload);

    request$.subscribe({
      next: (savedQuote) => {
        this.saving.set(false);
        if (this.isEditMode()) {
          this.quotes.update((list) =>
            list.map((q) => (q.id === savedQuote.id ? savedQuote : q))
          );
        } else {
          this.quotes.update((list) => [...list, savedQuote]);
        }
        this.showModal.set(false);
      },
      error: (err) => {
        this.saving.set(false);
        const message = err.error?.message || 'Could not save this quote. Please try again.';
        this.fieldErrors.set({ general: message });
      }
    });
  }

  askDelete(id: number) {
    this.confirmingDeleteId.set(id);
  }

  cancelDelete() {
    this.confirmingDeleteId.set(null);
  }

  confirmDelete(id: number) {
    this.quoteService.delete(id).subscribe({
      next: () => {
        this.quotes.update((list) => list.filter((q) => q.id !== id));
        this.confirmingDeleteId.set(null);
      },
      error: () => {
        this.errorMessage.set('Could not delete this quote. Please try again.');
        this.confirmingDeleteId.set(null);
      }
    });
  }
}
