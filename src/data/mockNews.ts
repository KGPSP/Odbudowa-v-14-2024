import type { NewsArticle } from '../types/news';

export const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Nowy program wsparcia dla poszkodowanych w powodziach',
    content: `W odpowiedzi na ostatnie wydarzenia związane z powodziami w południowej Polsce, 
    uruchamiamy nowy program wsparcia dla poszkodowanych. Program zakłada szybką ścieżkę 
    pomocy finansowej oraz wsparcie w odbudowie zniszczonej infrastruktury.

    ## Główne założenia programu:
    
    1. Natychmiastowa pomoc finansowa do 50 000 zł
    2. Uproszczona procedura składania wniosków
    3. Wsparcie techniczne w ocenie szkód
    4. Doradztwo w zakresie odbudowy
    
    Program rusza od 1 kwietnia 2024 roku. Szczegółowe informacje dostępne są w systemie.`,
    excerpt: 'Nowy program pomocy dla poszkodowanych w powodziach z uproszczoną procedurą i wsparciem do 50 000 zł.',
    publishedAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    status: 'published',
    author: {
      id: '1',
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com'
    },
    category: 'alert',
    slug: 'nowy-program-wsparcia-powodzie-2024',
    coverImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5',
    tags: ['powódź', 'wsparcie', 'program pomocowy']
  },
  {
    id: '2',
    title: 'Szkolenia z obsługi systemu - harmonogram na kwiecień',
    content: `Zapraszamy na cykl szkoleń z obsługi systemu Odbudowa 2024. Szkolenia odbędą się 
    online i są dedykowane dla pracowników administracji publicznej.

    ## Terminy szkoleń:
    
    - 5 kwietnia 2024 - Podstawy obsługi systemu
    - 12 kwietnia 2024 - Weryfikacja wniosków
    - 19 kwietnia 2024 - Raportowanie i statystyki
    - 26 kwietnia 2024 - Zaawansowane funkcje systemu
    
    Zapisy poprzez formularz w systemie. Liczba miejsc ograniczona.`,
    excerpt: 'Harmonogram szkoleń z obsługi systemu na kwiecień 2024. Zapisy już otwarte!',
    publishedAt: '2024-03-14T12:00:00Z',
    updatedAt: '2024-03-14T12:00:00Z',
    status: 'published',
    author: {
      id: '2',
      name: 'Anna Nowak',
      email: 'anna.nowak@example.com'
    },
    category: 'event',
    slug: 'szkolenia-system-kwiecien-2024',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
    tags: ['szkolenia', 'system', 'administracja']
  },
  {
    id: '3',
    title: 'Aktualizacja systemu - nowe funkcje',
    content: `W najnowszej aktualizacji systemu wprowadziliśmy szereg usprawnień i nowych funkcji:

    ## Nowe funkcje:
    
    1. Automatyczna walidacja wniosków
    2. Rozszerzone możliwości raportowania
    3. Integracja z systemem ePUAP
    4. Nowy moduł statystyk
    
    Aktualizacja jest już dostępna dla wszystkich użytkowników.`,
    excerpt: 'Nowa wersja systemu z automatyczną walidacją wniosków i integracją ePUAP.',
    publishedAt: '2024-03-13T09:00:00Z',
    updatedAt: '2024-03-13T09:00:00Z',
    status: 'published',
    author: {
      id: '3',
      name: 'Piotr Wiśniewski',
      email: 'piotr.wisniewski@example.com'
    },
    category: 'update',
    slug: 'aktualizacja-systemu-marzec-2024',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    tags: ['aktualizacja', 'nowe funkcje', 'system']
  }
];