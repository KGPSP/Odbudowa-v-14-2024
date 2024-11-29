# Scenariusz testowy - Administrator MSWiA (mswia_admin)

## Dane testowe
- Login: piotr.wisniewski@example.com
- Hasło: mswia123

## 1. Rejestracja administratora MSWiA
1. Administrator systemu tworzy konto:
   - Imię: Piotr
   - Nazwisko: Wiśniewski
   - Stanowisko: Administrator MSWiA
   - Jednostka: MSWiA
   - Email: piotr.wisniewski@example.com
   - Rola: mswia_admin

## 2. Weryfikacja wniosków na poziomie MSWiA
1. Zaloguj się do systemu
2. Przejdź do listy wniosków
3. Sprawdź widoczność wniosków zaakceptowanych wojewódzko
4. Dla wniosku w statusie "Zaakceptowany wojewódzko":
   - Otwórz szczegóły wniosku
   - Sprawdź historię weryfikacji wojewódzkiej
   - Zweryfikuj dokumentację
   - Wybierz akcję:
     * "Rozpocznij weryfikację MSWiA" -> status "W weryfikacji MSWiA"
     * "Zwróć do województwa" -> status "Zwrócony do województwa"
     * "Odrzuć wniosek" -> status "Odrzucony przez MSWiA"
     * "Zaakceptuj" -> status "Zaakceptowany przez MSWiA"
   - Dodaj komentarz uzasadniający decyzję
5. Sprawdź aktualizację statusu i historii wniosku

## 3. Zarządzanie systemem na poziomie ministerialnym
1. Sprawdź dostęp do:
   - Raportów ogólnokrajowych
   - Statystyk wojewódzkich
   - Historii weryfikacji
2. Zweryfikuj możliwość:
   - Generowania raportów zbiorczych
   - Eksportu danych do analizy
   - Przeglądania statystyk

## 4. Obsługa zgłoszeń systemowych
1. Przejdź do sekcji zgłoszeń
2. Sprawdź możliwość:
   - Przeglądania wszystkich zgłoszeń
   - Przydzielania zgłoszeń do odpowiednich jednostek
   - Dodawania komentarzy wewnętrznych
   - Zmiany statusów zgłoszeń
   - Zamykania zgłoszeń

## 5. Komunikacja międzyinstytucjonalna
1. Sprawdź funkcje komunikacji:
   - Z administratorami wojewódzkimi
   - Z użytkownikami systemu
   - Z administratorami KPRM
2. Zweryfikuj możliwość:
   - Dodawania notatek służbowych
   - Wysyłania powiadomień
   - Prowadzenia korespondencji wewnętrznej

## Oczekiwane rezultaty
- Administrator MSWiA może weryfikować wnioski zaakceptowane wojewódzko
- Ma dostęp do raportów i statystyk ogólnokrajowych
- Może komunikować się z innymi użytkownikami systemu
- Może zarządzać zgłoszeniami na poziomie ministerialnym
- Ma możliwość generowania raportów zbiorczych 