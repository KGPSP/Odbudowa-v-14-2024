import React, { useState } from 'react';
import { AlertTriangle, Upload, Send, X, ArrowLeft } from 'lucide-react';
import type { BugReport, BugCategory, BugPriority } from '../../types/bug';
import { BUG_CATEGORY_LABELS, BUG_PRIORITY_LABELS, BUG_STATUS_LABELS } from '../../types/bug';
import BugList from '../bugs/BugList';

interface BugDetailsViewProps {
  bug: BugReport;
  onBack: () => void;
}

function BugDetailsView({ bug, onBack }: BugDetailsViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Szczegóły zgłoszenia</h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{bug.title}</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{bug.description}</p>
              </div>

              {bug.attachments && bug.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Załączniki</h4>
                  <ul className="divide-y divide-gray-200">
                    {bug.attachments.map((file, index) => (
                      <li key={index} className="py-3 flex items-center">
                        <span className="text-sm text-gray-600">{file.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {bug.comments && bug.comments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Historia komunikacji</h4>
                  <div className="space-y-4">
                    {bug.comments.filter(comment => !comment.isInternal).map((comment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Informacje o zgłoszeniu</h4>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${bug.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        bug.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        bug.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {BUG_STATUS_LABELS[bug.status]}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Kategoria</dt>
                  <dd className="mt-1 text-sm text-gray-900">{BUG_CATEGORY_LABELS[bug.category]}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Priorytet</dt>
                  <dd className="mt-1 text-sm text-gray-900">{BUG_PRIORITY_LABELS[bug.priority]}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Data zgłoszenia</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(bug.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ostatnia aktualizacja</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(bug.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportBugPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BugCategory>('error');
  const [priority, setPriority] = useState<BugPriority>('medium');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userBugs, setUserBugs] = useState<BugReport[]>([]);
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);

  const handleAttachmentUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5);
    setAttachments(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newBug: BugReport = {
        id: Date.now().toString(),
        title,
        category,
        priority,
        description,
        status: 'new',
        createdBy: 'user@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: attachments
      };

      setUserBugs(prev => [newBug, ...prev]);
      setShowSuccess(true);
      setTitle('');
      setCategory('error');
      setPriority('medium');
      setDescription('');
      setAttachments([]);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting bug report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedBug) {
    return <BugDetailsView bug={selectedBug} onBack={() => setSelectedBug(null)} />;
  }

  if (showSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Zgłoszenie wysłane</h2>
        </div>

        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <AlertTriangle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Dziękujemy za zgłoszenie</h3>
            <p className="mt-1 text-sm text-gray-500">
              Twoje zgłoszenie zostało przyjęte i zostanie rozpatrzone przez nasz zespół.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowSuccess(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Zgłoś kolejny problem
              </button>
            </div>
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
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {showForm ? 'Anuluj' : 'Nowe zgłoszenie'}
          </button>
        </div>

        <div className="p-6">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Tytuł zgłoszenia *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Krótki opis problemu"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Kategoria
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BugCategory)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {Object.entries(BUG_CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priorytet
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as BugPriority)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {Object.entries(BUG_PRIORITY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Szczegółowy opis *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Opisz dokładnie napotkany problem..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Załączniki (max. 5 plików)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="attachments" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Dodaj pliki</span>
                        <input
                          id="attachments"
                          type="file"
                          multiple
                          onChange={(e) => handleAttachmentUpload(e.target.files)}
                          className="sr-only"
                          accept="image/*,.pdf,.doc,.docx"
                        />
                      </label>
                      <p className="pl-1">lub przeciągnij i upuść</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF do 10MB
                    </p>
                  </div>
                </div>
                {attachments.length > 0 && (
                  <ul className="mt-2 divide-y divide-gray-200">
                    {attachments.map((file, index) => (
                      <li key={index} className="py-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !title || !description}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Wysyłanie...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Wyślij zgłoszenie
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Twoje zgłoszenia</h3>
              {userBugs.length > 0 ? (
                <BugList
                  bugs={userBugs}
                  onSelectBug={setSelectedBug}
                />
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Brak zgłoszeń</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Nie masz jeszcze żadnych zgłoszeń.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}