import React, { useState, useEffect } from 'react';
import { Users, FileText, BarChart3, Shield, Newspaper, CheckCircle, XCircle, AlertTriangle, Edit } from 'lucide-react';
import type { User } from '../types/user';
import { userService } from '../services/userService';
import RoleManager from './permissions/RoleManager';
import StatisticsPanel from './statistics/StatisticsPanel';
import NewsManagement from './news/NewsManagement';
import UserEditForm from './users/UserEditForm';

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'statistics' | 'news'>('users');
  const [showConfirmation, setShowConfirmation] = useState<{
    type: 'activate' | 'reject' | 'delete';
    userId: string;
  } | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    setUsers(userService.getAll());
  }, []);

  const handleStatusChange = (userId: string, newStatus: 'active' | 'rejected') => {
    try {
      userService.updateStatus(userId, newStatus);
      setUsers(userService.getAll());
      setShowConfirmation(null);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Wystąpił błąd podczas aktualizacji statusu użytkownika');
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    try {
      userService.updateRole(userId, newRole);
      setUsers(userService.getAll());
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Wystąpił błąd podczas aktualizacji roli użytkownika');
    }
  };

  const handleDeleteUser = (userId: string) => {
    try {
      userService.delete(userId);
      setUsers(userService.getAll());
      setShowConfirmation(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Wystąpił błąd podczas usuwania użytkownika');
    }
  };

  const handleEditUser = (userId: string) => {
    const user = userService.getById(userId);
    if (user) {
      setEditingUser(user);
    }
  };

  const handleUpdateUser = async (data: any) => {
    try {
      if (editingUser) {
        userService.update(editingUser.id, data);
        setUsers(userService.getAll());
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Wystąpił błąd podczas aktualizacji użytkownika');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Aktywny
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Oczekujący
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Odrzucony
          </span>
        );
      default:
        return null;
    }
  };

  if (editingUser) {
    return (
      <UserEditForm 
        user={editingUser}
        onSubmit={handleUpdateUser}
        onCancel={() => setEditingUser(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel administracyjny</h1>
          <p className="mt-2 text-sm text-gray-600">
            Zarządzaj użytkownikami, uprawnieniami i monitoruj statystyki systemu
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                <Users className="w-5 h-5 mr-2" />
                Użytkownicy
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`${
                  activeTab === 'permissions'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                <Shield className="w-5 h-5 mr-2" />
                Uprawnienia
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`${
                  activeTab === 'news'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                <Newspaper className="w-5 h-5 mr-2" />
                Aktualności
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`${
                  activeTab === 'statistics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Statystyki
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
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
                        Jednostka
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data rejestracji
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcje
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
                          <div className="text-sm text-gray-500">{user.organizationName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edytuj"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            {user.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => setShowConfirmation({ type: 'activate', userId: user.id })}
                                  className="text-green-600 hover:text-green-900"
                                  title="Aktywuj"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => setShowConfirmation({ type: 'reject', userId: user.id })}
                                  className="text-red-600 hover:text-red-900"
                                  title="Odrzuć"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setShowConfirmation({ type: 'delete', userId: user.id })}
                              className="text-red-600 hover:text-red-900"
                              title="Usuń"
                            >
                              <AlertTriangle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'permissions' && (
              <RoleManager users={users} onUpdateRole={handleRoleChange} />
            )}

            {activeTab === 'news' && (
              <NewsManagement />
            )}

            {activeTab === 'statistics' && (
              <StatisticsPanel claims={[]} />
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              {showConfirmation.type === 'activate' && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {showConfirmation.type === 'reject' && (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              {showConfirmation.type === 'delete' && (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              )}
              <h3 className="text-lg font-medium text-gray-900">
                {showConfirmation.type === 'activate' && 'Potwierdź aktywację użytkownika'}
                {showConfirmation.type === 'reject' && 'Potwierdź odrzucenie użytkownika'}
                {showConfirmation.type === 'delete' && 'Potwierdź usunięcie użytkownika'}
              </h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              {showConfirmation.type === 'activate' && 'Czy na pewno chcesz aktywować tego użytkownika?'}
              {showConfirmation.type === 'reject' && 'Czy na pewno chcesz odrzucić tego użytkownika?'}
              {showConfirmation.type === 'delete' && 'Czy na pewno chcesz usunąć tego użytkownika? Tej operacji nie można cofnąć.'}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  if (showConfirmation.type === 'activate') {
                    handleStatusChange(showConfirmation.userId, 'active');
                  } else if (showConfirmation.type === 'reject') {
                    handleStatusChange(showConfirmation.userId, 'rejected');
                  } else if (showConfirmation.type === 'delete') {
                    handleDeleteUser(showConfirmation.userId);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  showConfirmation.type === 'activate'
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                }`}
              >
                {showConfirmation.type === 'activate' && 'Aktywuj'}
                {showConfirmation.type === 'reject' && 'Odrzuć'}
                {showConfirmation.type === 'delete' && 'Usuń'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}