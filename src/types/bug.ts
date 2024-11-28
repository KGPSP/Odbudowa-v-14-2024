export type BugPriority = 'low' | 'medium' | 'high';
export type BugCategory = 'error' | 'question' | 'suggestion';
export type BugStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

export interface BugComment {
  id: string;
  bug_id: string;
  content: string;
  author: string;
  is_internal: boolean;
  created_at: string;
}

export interface BugReport {
  id: string;
  title: string;
  category: BugCategory;
  priority: BugPriority;
  description: string;
  attachments?: File[];
  status: BugStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  resolution?: string;
  comments?: BugComment[];
}

export const BUG_CATEGORY_LABELS: Record<BugCategory, string> = {
  error: 'Awaria/Błąd',
  question: 'Pytanie',
  suggestion: 'Sugestia'
};

export const BUG_PRIORITY_LABELS: Record<BugPriority, string> = {
  low: 'Niski',
  medium: 'Średni',
  high: 'Wysoki'
};

export const BUG_STATUS_LABELS: Record<BugStatus, string> = {
  new: 'Nowe',
  in_progress: 'W realizacji',
  resolved: 'Rozwiązane',
  closed: 'Zamknięte'
};