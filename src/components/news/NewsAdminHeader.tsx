import React from 'react';
import { BarChart2, Settings, Bell } from 'lucide-react';

interface NewsAdminHeaderProps {
  onViewStats: () => void;
  onViewSettings: () => void;
}

export default function NewsAdminHeader({ onViewStats, onViewSettings }: NewsAdminHeaderProps) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel administracyjny aktualności</h1>
            <p className="mt-1 text-sm text-gray-500">
              Zarządzaj aktualnościami, monitoruj statystyki i konfiguruj ustawienia
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onViewStats}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <BarChart2 className="w-5 h-5" />
              <span className="hidden sm:inline">Statystyki</span>
            </button>

            <button
              onClick={onViewSettings}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Ustawienia</span>
            </button>

            <div className="relative">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}