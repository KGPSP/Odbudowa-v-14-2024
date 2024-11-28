import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <Phone className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Kontakt</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Biuro Informatyki i Łączności</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-900">Komenda Główna PSP</p>
                  <p className="text-sm text-gray-600">ul. Podchorążych 38</p>
                  <p className="text-sm text-gray-600">00-463 Warszawa</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">Telefon</p>
                  <p className="text-sm text-gray-600">+48 22 523 30 00</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">bil@kgpsp.gov.pl</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-900">Godziny pracy</p>
                  <p className="text-sm text-gray-600">Poniedziałek - Piątek</p>
                  <p className="text-sm text-gray-600">8:00 - 16:00</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Wsparcie techniczne</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-4">
                W przypadku problemów technicznych z systemem, prosimy o kontakt:
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-900">Infolinia techniczna</p>
                    <p className="text-sm text-gray-600">+48 22 523 31 00</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@kgpsp.gov.pl</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}