import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book, CreateBookRequest, UpdateBookRequest } from '../../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private baseUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  create(book: CreateBookRequest): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, book);
  }

  update(id: number, book: UpdateBookRequest): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
