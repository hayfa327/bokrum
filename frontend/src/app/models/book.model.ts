export interface Book {
  id: number;
  title: string;
  author: string;
  publishDate: string;
  coverImageUrl?: string | null;
  userId: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  publishDate: string;
  coverImageUrl?: string | null;
}

export interface UpdateBookRequest {
  title: string;
  author: string;
  publishDate: string;
  coverImageUrl?: string | null;
}
