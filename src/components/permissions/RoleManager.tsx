import React, { useState } from 'react';
import { Shield, Users, AlertTriangle } from 'lucide-react';
import type { User } from '../../types/user';

interface RoleManagerProps {
  users: User[];
  onUpdateRole: (userId: string, newRole: string) => void;
}

const ROLE_DESCRIPTIONS = {
  user: 'Podstawowy użytkownik - może składać i przeglądać własne wnioski',
  voivodeship_admin: 'Administrator wojewódzki - weryfikacja wniosków na poziomie województwa',
  mswia_admin: 'Administrator MSWiA - weryfikacja wniosków na poziomie ministerstwa',
  kprm_admin: 'Administrator KPRM - finalna weryfikacja wniosków',
  admin: 'Administrator systemu - pełny dostęp do wszystkich funkcji'
};

const ROLE_LABELS = {
  user: 'Użytkownik',
  voivodeship_admin: 'Admin. Wojewódzki',
  mswia_admin: 'Admin. MSWiA',
  kprm_admin: 'Admin. KPRM',
  admin: 'Administrator'
};

export default function RoleManager({ users, onUpdateRole }: RoleManagerProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newRole, setNewRole] = useState<string>('');

  const handleRoleChange = (userId: string, role: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setNewRole(role);
      setShowConfirmation(true);
    }
  };

  const confirmRoleChange = () => {
    if (selectedUser && newRole) {
      onUpdateRole(selectedUser.id, newRole);
      setShowConfirmation(false);
      setSelectedUser(null);
      setNewRole('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <Shield className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Zarządzanie uprawnieniami</h2>
      </div>

      <div className="p-6">
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex items-start">
            <Users className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Role systemowe</h3>
              <div className="mt-2 text-sm text-blue-700 space-y-1">
                {Object.entries(ROLE_DESCRIPTIONS).map(([role, description]) => (
                  <p key={role}>
                    <span className="font-semibold">{ROLE_LABELS[role as keyof typeof ROLE_LABELS]}:</span>{' '}
                    {description}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Użytkownik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Województwo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obecna rola
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zmień rolę
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.voivodeship}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'voivodeship_admin' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'mswia_admin' ? 'bg-green-100 text-green-800' :
                        user.role === 'kprm_admin' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    >
                      {Object.entries(ROLE_LABELS).map(([role, label]) => (
                        <option key={role} value={role}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirmation && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-medium text-gray-900">Potwierdź zmianę uprawnień</h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Czy na pewno chcesz zmienić rolę użytkownika{' '}
              <span className="font-medium text-gray-900">
                {selectedUser.firstName} {selectedUser.lastName}
              </span>{' '}
              z{' '}
              <span className="font-medium text-gray-900">
                {ROLE_LABELS[selectedUser.role as keyof typeof ROLE_LABELS]}
              </span>{' '}
              na{' '}
              <span className="font-medium text-gray-900">
                {ROLE_LABELS[newRole as keyof typeof ROLE_LABELS]}
              </span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Anuluj
              </button>
              <button
                onClick={confirmRoleChange}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Potwierdź
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}