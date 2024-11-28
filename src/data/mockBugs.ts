import type { BugReport } from '../types/bug';

export const mockBugs: BugReport[] = [
  {
    id: '1',
    title: 'Błąd podczas składania wniosku',
    description: 'Nie można zapisać wniosku po wypełnieniu wszystkich pól. System wyświetla błąd walidacji mimo poprawnych danych.',
    category: 'error',
    priority: 'high',
    status: 'new',
    created_by: 'jan.kowalski@example.com',
    created_at: '2024-03-14T10:00:00Z',
    updated_at: '2024-03-14T10:00:00Z',
    comments: [
      {
        id: '1',
        bug_id: '1',
        content: 'Proszę o pilne sprawdzenie tego problemu.',
        author: 'jan.kowalski@example.com',
        is_internal: false,
        created_at: '2024-03-14T10:00:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Propozycja usprawnienia interfejsu',
    description: 'Sugeruję dodanie podpowiedzi przy polach formularza, aby ułatwić wypełnianie wniosków.',
    category: 'suggestion',
    priority: 'low',
    status: 'in_progress',
    created_by: 'anna.nowak@example.com',
    created_at: '2024-03-13T15:30:00Z',
    updated_at: '2024-03-14T09:00:00Z',
    comments: [
      {
        id: '2',
        bug_id: '2',
        content: 'Dobry pomysł, rozważymy implementację w następnej aktualizacji.',
        author: 'admin@example.com',
        is_internal: false,
        created_at: '2024-03-14T09:00:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Problem z generowaniem PDF',
    description: 'Nie można wygenerować potwierdzenia w formacie PDF dla zatwierdzonego wniosku.',
    category: 'error',
    priority: 'medium',
    status: 'resolved',
    created_by: 'piotr.wisniewski@example.com',
    created_at: '2024-03-12T11:20:00Z',
    updated_at: '2024-03-13T14:45:00Z',
    comments: [
      {
        id: '3',
        bug_id: '3',
        content: 'Problem został rozwiązany w najnowszej aktualizacji systemu.',
        author: 'admin@example.com',
        is_internal: false,
        created_at: '2024-03-13T14:45:00Z'
      }
    ]
  }
];

// Initialize bugs in localStorage if not exists
if (!localStorage.getItem('bugs')) {
  localStorage.setItem('bugs', JSON.stringify(mockBugs));
}