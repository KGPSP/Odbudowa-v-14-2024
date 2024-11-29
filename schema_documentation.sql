/*
 * System Odbudowa 2024 - Dokumentacja Bazy Danych
 * =============================================
 *
 * Wersja: 1.0
 * Data ostatniej aktualizacji: 2024-03-21
 *
 * OPIS OGÓLNY
 * -----------
 * Baza danych obsługuje system zarządzania wnioskami o wsparcie w ramach odbudowy.
 * System wykorzystuje Supabase (PostgreSQL) jako silnik bazy danych.
 *
 * GŁÓWNE KOMPONENTY
 * ----------------
 * 1. System użytkowników i ról
 * 2. System wniosków i ich weryfikacji
 * 3. System zgłoszeń błędów
 * 4. System aktualności
 *
 * DIAGRAM RELACJI
 * --------------
 * users 1:N claims
 * claims 1:N claim_history
 * claims 1:N claim_files
 * users 1:N bug_reports
 * bug_reports 1:N bug_comments
 * users 1:N news_articles
 * news_articles N:N news_tags
 */

/*
 * TYPY ENUM
 * ---------
 * Dokumentacja typów wyliczeniowych używanych w systemie
 */

-- Role użytkowników
/**
 * user_role
 * ---------
 * user: Podstawowy użytkownik systemu
 * voivodeship_admin: Administrator wojewódzki
 * mswia_admin: Administrator MSWiA
 * kprm_admin: Administrator KPRM
 * admin: Administrator systemu
 */

-- Status użytkownika
/**
 * user_status
 * -----------
 * pending: Oczekujący na aktywację
 * active: Aktywny użytkownik
 * inactive: Dezaktywowany użytkownik
 * rejected: Odrzucony wniosek o rejestrację
 */

-- Status wniosku
/**
 * claim_status
 * ------------
 * draft: Wersja robocza
 * submitted: Złożony
 * voivodeship_review: W weryfikacji wojewódzkiej
 * voivodeship_approved: Zaakceptowany przez województwo
 * voivodeship_rejected: Odrzucony przez województwo
 * returned: Zwrócony do poprawy
 * mswia_review: W weryfikacji MSWiA
 * mswia_approved: Zaakceptowany przez MSWiA
 * mswia_rejected: Odrzucony przez MSWiA
 * kprm_review: W weryfikacji KPRM
 * approved: Zatwierdzony
 * rejected: Odrzucony
 */

/*
 * TABELE
 * ------
 * Szczegółowa dokumentacja wszystkich tabel w systemie
 */

/**
 * Tabela: users
 * -------------
 * Przechowuje dane użytkowników systemu
 *
 * Kolumny:
 * - id: Unikalny identyfikator użytkownika (UUID)
 * - email: Adres email (unikalny)
 * - encrypted_password: Zaszyfrowane hasło
 * - first_name: Imię
 * - last_name: Nazwisko
 * - position: Stanowisko
 * - organizational_unit: Jednostka organizacyjna
 * - organization_type: Typ organizacji
 * - nip: NIP organizacji (opcjonalny)
 * - voivodeship: Województwo (opcjonalne)
 * - county: Powiat (opcjonalny)
 * - commune: Gmina (opcjonalna)
 * - address: Adres
 * - phone: Numer telefonu
 * - role: Rola użytkownika
 * - status: Status konta
 * - created_at: Data utworzenia
 * - updated_at: Data ostatniej aktualizacji
 */

/**
 * Tabela: claims
 * -------------
 * Przechowuje wnioski o wsparcie
 *
 * Kolumny:
 * - id: Unikalny identyfikator wniosku (UUID)
 * - object_name: Nazwa obiektu
 * - estimated_loss: Szacowana wartość strat
 * - voivodeship: Województwo
 * - county: Powiat
 * - commune: Gmina
 * - notes: Uwagi do wniosku
 * - status: Status wniosku
 * - current_level: Aktualny poziom weryfikacji
 * - created_by: ID twórcy wniosku (FK users)
 * - created_at: Data utworzenia
 * - updated_at: Data ostatniej aktualizacji
 * - locked: Czy wniosek jest zablokowany
 */

/**
 * Tabela: claim_history
 * --------------------
 * Historia zmian statusów wniosków
 *
 * Kolumny:
 * - id: Unikalny identyfikator wpisu (UUID)
 * - claim_id: ID wniosku (FK claims)
 * - status: Status wniosku
 * - level: Poziom weryfikacji
 * - comment: Komentarz do zmiany
 * - updated_by: ID użytkownika dokonującego zmiany (FK users)
 * - updated_at: Data zmiany
 */

/**
 * INDEKSY
 * -------
 * Lista indeksów zoptymalizowanych pod kątem wydajności
 */

/*
 * POLITYKI BEZPIECZEŃSTWA (RLS)
 * ----------------------------
 * Dokumentacja polityk Row Level Security
 */

/**
 * Polityka: Users can view their own data
 * --------------------------------------
 * Pozwala użytkownikom na dostęp tylko do własnych danych
 *
 * Zastosowanie:
 * - Tabela: users
 * - Operacja: SELECT
 * - Warunek: auth.uid() = id
 */

/**
 * Polityka: Admin can view all users
 * --------------------------------
 * Pozwala administratorom na dostęp do danych wszystkich użytkowników
 *
 * Zastosowanie:
 * - Tabela: users
 * - Operacja: SELECT
 * - Warunek: auth.jwt() ->> 'role' = 'admin'
 */

/*
 * TRIGGERY
 * --------
 * Dokumentacja triggerów automatyzujących operacje
 */

/**
 * Trigger: update_updated_at_column
 * -------------------------------
 * Automatycznie aktualizuje pole updated_at przy każdej modyfikacji rekordu
 *
 * Zastosowanie:
 * - users
 * - claims
 * - bug_reports
 * - news_articles
 */

/*
 * UWAGI IMPLEMENTACYJNE
 * --------------------
 * 1. Wszystkie hasła muszą być szyfrowane przed zapisem
 * 2. Należy regularnie archiwizować dane
 * 3. Zalecane jest monitorowanie wydajności indeksów
 * 4. Należy rozważyć partycjonowanie dużych tabel w przyszłości
 */

/*
 * PRZYKŁADY UŻYCIA
 * ---------------
 * 1. Pobranie wniosków użytkownika:
 *    SELECT * FROM claims WHERE created_by = [user_id];
 *
 * 2. Historia zmian wniosku:
 *    SELECT * FROM claim_history WHERE claim_id = [claim_id] ORDER BY updated_at DESC;
 *
 * 3. Statystyki wniosków per województwo:
 *    SELECT voivodeship, count(*) FROM claims GROUP BY voivodeship;
 */ 