import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { BugReport } from '../../types/bug';
import BugList from './BugList';
import BugDetails from './BugDetails';
import BugReports from './BugReports';
import { useBugs } from '../../hooks/useBugs';
import { useAuth } from '../auth/AuthProvider';

export default function BugManagement() {
  const { bugs, loading, error, updateBug, addComment } = useBugs();
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const { user } = useAuth();

  const handleSendMessage = async (bugId: string, message: string, isInternal: boolean) => {
    try {
      await addComment(bugId, message, isInternal);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Nie udało się wysłać wiadomości');
    }
  };

  const filteredBugs = bugs.filter(bug => {
    if (user?.role === 'admin') return true;
    return bug.created_by === user?.email;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Wystąpił błąd podczas ładowania zgłoszeń: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">Zgłoszenia błędów</h2>
          </div>
        </div>

        <div className="p-6">
          {selectedBug ? (
            <BugDetails
              bug={selectedBug}
              onBack={() => setSelectedBug(null)}
              onUpdate={async (updatedBug) => {
                try {
                  await updateBug(updatedBug.id, updatedBug);
                  setSelectedBug(null);
                } catch (error) {
                  console.error('Error updating bug:', error);
                  alert('Nie udało się zaktualizować zgłoszenia');
                }
              }}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <BugList
              bugs={filteredBugs}
              onSelectBug={setSelectedBug}
            />
          )}
        </div>
      </div>

      {!selectedBug && <BugReports bugs={filteredBugs} />}
    </div>
  );
}