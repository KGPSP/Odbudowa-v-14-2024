# Scenariusz testowy - Administrator KPRM (kprm_admin)

## Dane testowe
- Login: maria.dabrowska@example.com
- Hasło: kprm123

## 1. Rejestracja administratora KPRM
1. Administrator systemu tworzy konto:
   - Imię: Maria
   - Nazwisko: Dąbrowska
   - Stanowisko: Administrator KPRM
   - Jednostka: KPRM
   - Email: maria.dabrowska@example.com
   - Rola: kprm_admin

## 2. Weryfikacja wniosków na poziomie KPRM
1. Zaloguj się do systemu
2. Przejdź do listy wniosków
3. Sprawdź widoczność wniosków zaakceptowanych przez MSWiA
4. Dla wniosku w statusie "Zaakceptowany przez MSWiA":
   - Otwórz szczegóły wniosku
   - Przeanalizuj historię weryfikacji
   - Sprawdź kompletność dokumentacji
   - Wybierz akcję:
     * "Rozpocznij weryfikację KPRM" -> status "W weryfikacji KPRM"
     * "Zwróć do MSWiA" -> status "Zwrócony do MSWiA"
     * "Odrzuć wniosek" -> status "Odrzucony przez KPRM"
     * "Zatwierdź ostatecznie" -> status "Zatwierdzony"
   - Dodaj komentarz uzasadniający decyzję
5. Sprawdź aktualizację statusu i historii wniosku

## 3. Zarządzanie raportami strategicznymi
1. Przejdź do sekcji raportów
2. Sprawdź dostęp do:
   - Raportów strategicznych
   - Statystyk ogólnokrajowych
   - Analiz finansowych
3. Zweryfikuj możliwość:
   - Generowania raportów zbiorczych
   - Eksportu danych do analiz
   - Tworzenia zestawień dla kierownictwa

## 4. Nadzór nad systemem
1. Sprawdź funkcje nadzorcze:
   - Monitoring aktywności użytkowników
   - Przegląd historii zmian
   - Analiza czasu weryfikacji wniosków
2. Zweryfikuj możliwość:
   - Generowania raportów wydajności
   - Przeglądania logów systemowych
   - Monitorowania statusów wniosków

## 5. Komunikacja na poziomie rządowym
1. Sprawdź funkcje komunikacji:
   - Z administratorami MSWiA
   - Z administratorami wojewódzkimi
   - Z użytkownikami systemu
2. Zweryfikuj możliwość:
   - Dodawania komunikatów systemowych
   - Wysyłania powiadomień
   - Prowadzenia korespondencji urzędowej

## Oczekiwane rezultaty
- Administrator KPRM może weryfikować wnioski zaakceptowane przez MSWiA
- Ma dostęp do raportów strategicznych
- Może monitorować pracę całego systemu
- Ma możliwość komunikacji ze wszystkimi poziomami administracji
- Może generować raporty i analizy dla kierownictwa 