import React from 'react';
import { Info, GitBranch, Shield, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <Info className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">O systemie</h2>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Informacje o wersji</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Wersja systemu</dt>
                <dd className="text-sm text-gray-900">1.0.0-beta</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Data wydania</dt>
                <dd className="text-sm text-gray-900">21 marca 2024</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Środowisko</dt>
                <dd className="text-sm text-gray-900">Produkcyjne</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Framework</dt>
                <dd className="text-sm text-gray-900">React 18.3.1</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Certyfikaty i zgodność</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Zgodność z RODO</li>
              <li>• Certyfikat bezpieczeństwa ISO 27001</li>
              <li>• Zgodność z ustawą o dostępności cyfrowej</li>
              <li>• Certyfikat WCAG 2.1 AA</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Twórcy systemu</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Biuro Informatyki i Łączności KG PSP</h4>
                <p className="text-sm text-gray-600">Główny wykonawca i administrator systemu</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Ministerstwo Spraw Wewnętrznych i Administracji</h4>
                <p className="text-sm text-gray-600">Nadzór merytoryczny i wsparcie prawne</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Kancelaria Prezesa Rady Ministrów</h4>
                <p className="text-sm text-gray-600">Koordynacja i nadzór nad projektem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}