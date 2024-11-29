# System Odbudowa 2024

## 📋 O Projekcie

System Odbudowa 2024 to open-source'owa platforma do zarządzania zgłoszeniami i raportowania błędów. System umożliwia użytkownikom zgłaszanie problemów, śledzenie ich statusu oraz generowanie statystyk.

## 🔧 Stos Technologiczny

- **Frontend:**
  - React
  - TypeScript
  - CSS Modules
  - Vite (bundler)

- **Backend:**
  - Node.js
  - System bazodanowy (na podstawie schema.ts)
  - REST API

## 🚀 Funkcjonalności

- System zarządzania rolami i uprawnieniami
- Moduł raportowania błędów
- Panel statystyk
- System logowania i autoryzacji
- Repozytorium użytkowników i zgłoszeń
- Dokumentacja testowa (scenariusze testowe)

## 💻 Dokumentacja Testowa

W katalogu `testy/` znajdują się szczegółowe scenariusze testowe dla różnych ról użytkowników:

- [Użytkownik podstawowy](testy/user_basic.md) - dla zwykłych użytkowników systemu
- [Administrator Wojewódzki](testy/voivodeship_admin.md) - dla administratorów poziomu wojewódzkiego
- [Administrator MSWiA](testy/mswia_admin.md) - dla administratorów ministerialnych
- [Administrator KPRM](testy/kprm_admin.md) - dla administratorów poziomu rządowego
- [Administrator Systemu](testy/system_admin.md) - dla administratorów technicznych

## 📊 Struktura Bazy Danych

Szczegółowa struktura bazy danych wraz z dokumentacją znajduje się w plikach:
- `schema.sql` - definicje tabel i relacji
- `schema_documentation.md` - dokumentacja techniczna bazy danych

## 💻 Wymagania Systemowe

- Node.js (wersja 14 lub wyższa)
- npm lub yarn
- Współczesna przeglądarka internetowa

## 🛠️ Instalacja

1. Sklonuj repozytorium: