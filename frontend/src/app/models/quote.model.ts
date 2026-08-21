export interface Quote {
  id: number;
  text: string;
  source: string;
  userId: string;
}

export interface CreateQuoteRequest {
  text: string;
  source: string;
}

export interface UpdateQuoteRequest {
  text: string;
  source: string;
}
