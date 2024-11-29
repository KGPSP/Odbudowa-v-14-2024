# Scenariusz testowy - Użytkownik podstawowy (user)

## Dane testowe
- Login: jan.kowalski@example.com
- Hasło: user123

## 1. Rejestracja nowego użytkownika
1. Wejdź na stronę główną systemu
2. Kliknij przycisk "Zarejestruj się"
3. Wypełnij formularz rejestracyjny:
   - Krok 1 (Dane osobowe):
     * Imię: Jan
     * Nazwisko: Kowalski
     * Stanowisko: Specjalista ds. infrastruktury
   - Krok 2 (Dane organizacji):
     * Nazwa jednostki: Urząd Gminy Warszawa
     * Typ administracji: Administracja samorządowa
     * NIP: 5252248481
   - Krok 3 (Dane adresowe):
     * Województwo: Mazowieckie
     * Powiat: Warszawa
     * Gmina: Warszawa-Śródmieście
     * Adres: ul. Przykładowa 1
     * Telefon: 123456789
   - Krok 4 (Zabezpieczenia):
     * Email: jan.kowalski@example.com
     * Hasło: user123 (min. 8 znaków)
4. Kliknij "Zarejestruj się"
5. Sprawdź czy wyświetla się komunikat o pomyślnej rejestracji

## 2. Składanie nowego wniosku
1. Zaloguj się do systemu
2. Przejdź do sekcji "Wnioski"
3. Kliknij "Nowy wniosek"
4. Wypełnij formularz wniosku:
   - Nazwa obiektu: Most na rzece Wisła
   - Szacowana wartość strat: 500000
   - Województwo: Mazowieckie
   - Powiat: Warszawa
   - Gmina: Warszawa-Śródmieście
   - Uwagi: Uszkodzenia konstrukcyjne po powodzi
   - Załącz dokumentację fotograficzną (format JPG/PNG)
   - Załącz dokumenty (format PDF)
5. Kliknij "Złóż wniosek"
6. Sprawdź czy wniosek pojawił się na liście ze statusem "Złożony"

## 3. Zarządzanie wnioskami
1. Przejdź do listy wniosków
2. Sprawdź możliwość:
   - Podglądu szczegółów wniosku
   - Edycji wniosku w statusie "Wersja robocza"
   - Edycji wniosku w statusie "Zwrócony do poprawy"
   - Podglądu historii zmian statusu
3. Zweryfikuj czy nie ma możliwości:
   - Edycji wniosku w statusie "W weryfikacji"
   - Edycji wniosku w statusie "Zaakceptowany"
   - Edycji wniosku w statusie "Odrzucony"

## 4. Zgłaszanie błędów
1. Przejdź do sekcji "Zgłoś błąd"
2. Wypełnij formularz zgłoszenia:
   - Tytuł: Błąd podczas składania wniosku
   - Kategoria: Błąd
   - Priorytet: Wysoki
   - Opis: Nie można zapisać wniosku po wypełnieniu wszystkich pól
   - Załącz zrzuty ekranu (opcjonalnie)
3. Kliknij "Wyślij zgłoszenie"
4. Sprawdź czy zgłoszenie pojawiło się na liście

## 5. Przeglądanie instrukcji
1. Przejdź do sekcji "Instrukcja"
2. Sprawdź dostępność:
   - FAQ
   - Procesu weryfikacji wniosku
   - Ważnych informacji
3. Zweryfikuj czy wszystkie instrukcje są czytelne i zrozumiałe

## Oczekiwane rezultaty
- Użytkownik może się zarejestrować
- Użytkownik może składać nowe wnioski
- Użytkownik może edytować wnioski w odpowiednich statusach
- Użytkownik może przeglądać historię wniosków
- Użytkownik może zgłaszać błędy
- Użytkownik ma dostęp do instrukcji systemu 