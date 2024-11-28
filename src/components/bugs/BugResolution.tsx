import React, { useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import type { BugReport } from '../../types/bug';

interface BugResolutionProps {
  bug: BugReport;
  onResolveBug: (bugId: string, resolution: string) => Promise<void>;
}

export default function BugResolution({ bug, onResolveBug }: BugResolutionProps) {
  const [resolution, setResolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!resolution.trim()) {
      alert('Proszę dodać opis rozwiązania');
      return;
    }

    try {
      setIsSubmitting(true);
      await onResolveBug(bug.id, resolution);
    } catch (error) {
      console.error('Error resolving bug:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-medium text-gray-900">Zamknij zgłoszenie</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="resolution" className="block text-sm font-medium text-gray-700">
            Opis rozwiązania *
          </label>
          <textarea
            id="resolution"
            rows={4}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Opisz sposób rozwiązania problemu..."
          />
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Po zamknięciu zgłoszenia użytkownik zostanie automatycznie powiadomiony o rozwiązaniu.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !resolution.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Zamykanie...
              </>
            ) : (
              'Zamknij zgłoszenie'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}</content>