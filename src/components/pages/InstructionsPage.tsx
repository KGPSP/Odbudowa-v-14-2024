import React from 'react';
import { HelpCircle, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function InstructionsPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <HelpCircle className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Instrukcja obsługi systemu</h2>
      </div>

      <div className="p-6 space-y-8">
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Najczęściej zadawane pytania (FAQ)</h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Jak złożyć nowy wniosek?
              </h4>
              <p className="text-sm text-gray-600">
                1. Zaloguj się do systemu<br />
                2. Kliknij przycisk "Nowy wniosek"<br />
                3. Wypełnij wszystkie wymagane pola<br />
                4. Możesz zapisać wersję roboczą lub od razu złożyć wniosek<br />
                5. System automatycznie nada numer Twojemu wnioskowi
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Jak sprawdzić status wniosku?
              </h4>
              <p className="text-sm text-gray-600">
                1. Przejdź do listy wniosków<br />
                2. Status jest widoczny w kolumnie "Status"<br />
                3. Kliknij w szczegóły wniosku, aby zobaczyć pełną historię zmian
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Co zrobić gdy wniosek zostanie zwrócony do poprawy?
              </h4>
              <p className="text-sm text-gray-600">
                1. W szczegółach wniosku znajdziesz komentarz z powodem zwrotu<br />
                2. Kliknij przycisk "Edytuj" przy wniosku<br />
                3. Wprowadź wymagane poprawki<br />
                4. Zapisz zmiany i ponownie złóż wniosek
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Proces weryfikacji wniosku</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-gray-900">Poziom wojewódzki</h4>
              </div>
              <p className="text-sm text-gray-600">
                Pierwsza weryfikacja wniosku na poziomie wojewódzkim przez uprawnionego administratora.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-gray-900">Poziom MSWiA</h4>
              </div>
              <p className="text-sm text-gray-600">
                Weryfikacja przez Ministerstwo Spraw Wewnętrznych i Administracji.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium text-gray-900">Poziom KPRM</h4>
              </div>
              <p className="text-sm text-gray-600">
                Finalna weryfikacja przez Kancelarię Prezesa Rady Ministrów.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ważne informacje</h3>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Pamiętaj</h4>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Wszystkie pola oznaczone gwiazdką (*) są obowiązkowe</li>
                    <li>Załączane dokumenty muszą być w formacie PDF</li>
                    <li>Zdjęcia powinny być w formacie JPG lub PNG</li>
                    <li>Maksymalny rozmiar pojedynczego pliku to 10MB</li>
                    <li>Wniosek można edytować tylko w statusie "Wersja robocza" lub "Zwrócony do poprawy"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}