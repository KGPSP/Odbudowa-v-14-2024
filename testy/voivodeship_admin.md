# Scenariusz testowy - Administrator Wojewódzki (voivodeship_admin)

## Dane testowe
- Login: anna.nowak@example.com
- Hasło: voivode123

## 1. Rejestracja administratora wojewódzkiego
1. Administrator systemu tworzy konto:
   - Imię: Anna
   - Nazwisko: Nowak
   - Stanowisko: Administrator Wojewódzki
   - Jednostka: Urząd Wojewódzki Mazowiecki
   - Email: anna.nowak@example.com
   - Rola: voivodeship_admin
   - Województwo: Mazowieckie

## 2. Weryfikacja wniosków na poziomie wojewódzkim
1. Zaloguj się do systemu
2. Przejdź do listy wniosków
3. Sprawdź czy widoczne są tylko wnioski z przypisanego województwa
4. Dla wniosku w statusie "Złożony":
   - Otwórz szczegóły wniosku
   - Sprawdź kompletność dokumentacji
   - Zweryfikuj poprawność danych
   - Wybierz akcję:
     * "Rozpocznij weryfikację" -> status "W weryfikacji wojewódzkiej"
     * "Zwróć do poprawy" -> status "Zwrócony do poprawy"
     * "Odrzuć wniosek" -> status "Odrzucony wojewódzko"
     * "Zaakceptuj" -> status "Zaakceptowany wojewódzko"
   - Dodaj komentarz uzasadniający decyzję
5. Sprawdź czy status wniosku został zaktualizowany

## 3. Zarządzanie zgłoszeniami błędów
1. Przejdź do sekcji zgłoszeń błędów
2. Sprawdź możliwość:
   - Przeglądania zgłoszeń z województwa
   - Dodawania komentarzy wewnętrznych
   - Odpowiadania na zgłoszenia użytkowników
   - Zmiany statusu zgłoszeń

## 4. Przeglądanie raportów
1. Przejdź do sekcji raportów
2. Sprawdź dostępność raportów:
   - Lista wniosków w województwie
   - Statystyki statusów wniosków
   - Historia zmian statusów
3. Zweryfikuj możliwość filtrowania i eksportu danych

## 5. Komunikacja z użytkownikami
1. Sprawdź możliwość:
   - Dodawania komentarzy do wniosków
   - Wysyłania wiadomości do użytkowników
   - Przeglądania historii komunikacji

## Oczekiwane rezultaty
- Administrator wojewódzki może weryfikować wnioski
- Może zmieniać statusy wniosków zgodnie z uprawnieniami
- Ma dostęp do raportów wojewódzkich
- Może komunikować się z użytkownikami
- Może zarządzać zgłoszeniami błędów 