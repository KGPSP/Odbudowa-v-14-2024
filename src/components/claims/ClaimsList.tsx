import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, FileText, Edit, Plus, Trash2 } from 'lucide-react';
import type { Claim } from '../../types/claim';
import type { AuthState } from '../../types/auth';
import ClaimStatusBadge from './ClaimStatusBadge';

interface ClaimsListProps {
  claims: Claim[];
  onSelectClaim: (id: string) => void;
  onEditClaim: (claim: Claim) => void;
  onDeleteClaim: (claim: Claim) => Promise<void>;
  auth: AuthState;
}

export default function ClaimsList({ claims, onSelectClaim, onEditClaim, onDeleteClaim, auth }: ClaimsListProps) {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'date' as 'date' | 'title',
    sortDirection: 'desc' as 'asc' | 'desc'
  });

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<Claim | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (claim: Claim) => {
    try {
      setIsDeleting(true);
      await onDeleteClaim(claim);
    } catch (error) {
      console.error('Error deleting claim:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(null);
    }
  };

  // Function to check if user can delete a claim
  const canDeleteClaim = (claim: Claim) => {
    if (auth.user?.role === 'admin') return true;
    if (auth.user?.role === 'user') {
      return claim.status === 'draft' && claim.createdBy === auth.user.email;
    }
    return false;
  };

  // Function to check if user can edit a claim
  const canEditClaim = (claim: Claim) => {
    if (auth.user?.role === 'user') {
      return ['draft', 'returned'].includes(claim.status) && claim.createdBy === auth.user.email;
    }
    return false;
  };

  const filteredClaims = claims
    .filter(claim => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          claim.objectName.toLowerCase().includes(searchLower) ||
          claim.id.toLowerCase().includes(searchLower)
        );
      }
      if (filters.status) {
        return claim.status === filters.status;
      }
      return true;
    })
    .sort((a, b) => {
      const factor = filters.sortDirection === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') {
        return factor * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      return factor * a.objectName.localeCompare(b.objectName);
    });

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj po nazwie obiektu lub ID wniosku..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-lg py-2 pl-3 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Wszystkie statusy</option>
              <option value="draft">Wersja robocza</option>
              <option value="submitted">Złożony</option>
              <option value="returned">Zwrócony do poprawy</option>
              <option value="approved">Zatwierdzony</option>
              <option value="rejected">Odrzucony</option>
            </select>

            <button
              onClick={() => setFilters(prev => ({
                ...prev,
                sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
              }))}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {filters.sortDirection === 'asc' ? (
                <SortAsc className="w-5 h-5 text-gray-500" />
              ) : (
                <SortDesc className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Wniosku
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nazwa obiektu
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kwota wnioskowana
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data utworzenia
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {claim.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {claim.objectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ClaimStatusBadge status={claim.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatMoney(claim.requestedAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.createdAt).toLocaleDateString('pl-PL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onSelectClaim(claim.id)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50"
                        title="Zobacz szczegóły"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                      {canEditClaim(claim) && (
                        <button
                          onClick={() => onEditClaim(claim)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                          title="Edytuj wniosek"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                      {canDeleteClaim(claim) && (
                        <button
                          onClick={() => setShowDeleteConfirmation(claim)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                          title="Usuń wniosek"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Brak wniosków</h3>
            <p className="mt-1 text-sm text-gray-500">
              Nie znaleziono wniosków spełniających kryteria wyszukiwania.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Potwierdź usunięcie wniosku
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Czy na pewno chcesz usunąć wniosek {showDeleteConfirmation.id}? Tej operacji nie można cofnąć.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirmation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirmation)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                {isDeleting ? 'Usuwanie...' : 'Usuń'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}