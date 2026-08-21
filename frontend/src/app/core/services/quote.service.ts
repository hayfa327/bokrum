import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Quote, CreateQuoteRequest, UpdateQuoteRequest } from '../../models/quote.model';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private baseUrl = `${environment.apiUrl}/quotes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.baseUrl);
  }

  getById(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.baseUrl}/${id}`);
  }

  create(quote: CreateQuoteRequest): Observable<Quote> {
    return this.http.post<Quote>(this.baseUrl, quote);
  }

  update(id: number, quote: UpdateQuoteRequest): Observable<Quote> {
    return this.http.put<Quote>(`${this.baseUrl}/${id}`, quote);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
