export type NewsStatus = 'draft' | 'published' | 'archived';
export type NewsCategory = 'general' | 'alert' | 'update' | 'event';
export type NewsVisibility = 'public' | 'internal';

export interface NewsAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  status: NewsStatus;
  visibility: NewsVisibility;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: NewsCategory;
  slug: string;
  coverImage?: string;
  tags?: string[];
  attachments?: NewsAttachment[];
}

export interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  category: NewsCategory;
  status: NewsStatus;
  visibility: NewsVisibility;
  coverImage?: string;
  tags?: string[];
  attachments?: File[];
}

export const NEWS_STATUS_LABELS: Record<NewsStatus, string> = {
  draft: 'Wersja robocza',
  published: 'Opublikowany',
  archived: 'Zarchiwizowany'
};

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  general: 'Ogólne',
  alert: 'Alert',
  update: 'Aktualizacja',
  event: 'Wydarzenie'
};

export const NEWS_VISIBILITY_LABELS: Record<NewsVisibility, string> = {
  public: 'Publiczny (dostępny dla wszystkich)',
  internal: 'Wewnętrzny (tylko dla zalogowanych)'
};