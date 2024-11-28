import React, { useState } from 'react';
import { ArrowLeft, Clock, MessageSquare, Save, Send, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import type { BugReport, BugComment } from '../../types/bug';
import { BUG_STATUS_LABELS, BUG_PRIORITY_LABELS, BUG_CATEGORY_LABELS } from '../../types/bug';

interface BugDetailsProps {
  bug: BugReport;
  onUpdate: (bug: BugReport) => void;
  onBack: () => void;
  onSendMessage: (bugId: string, message: string, isInternal: boolean) => Promise<void>;
}

export default function BugDetails({ bug, onUpdate, onBack, onSendMessage }: BugDetailsProps) {
  const [status, setStatus] = useState(bug.status);
  const [assignedTo, setAssignedTo] = useState(bug.assignedTo || '');
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const updatedBug: BugReport = {
        ...bug,
        status,
        assignedTo,
        updatedAt: new Date().toISOString()
      };
      await onUpdate(updatedBug);
      onBack();
    } catch (error) {
      console.error('Error updating bug:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      setIsSendingMessage(true);
      await onSendMessage(bug.id, message, isInternal);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'closed':
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTimelineIcon = (type: 'status_change' | 'comment' | 'assignment') => {
    switch (type) {
      case 'status_change':
        return <Clock className="w-5 h-5" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5" />;
      case 'assignment':
        return <Mail className="w-5 h-5" />;
    }
  };

  // Combine status changes and comments into a single timeline
  const timeline = [
    // Initial creation
    {
      type: 'status_change' as const,
      date: bug.createdAt,
      title: 'Zgłoszenie utworzone',
      description: `Zgłoszenie zostało utworzone przez ${bug.createdBy}`,
      status: 'new'
    },
    // Status changes from history
    ...(bug.statusHistory || []).map(change => ({
      type: 'status_change' as const,
      date: change.date,
      title: `Zmiana statusu na ${BUG_STATUS_LABELS[change.status]}`,
      description: change.comment || '',
      status: change.status
    })),
    // Assignment changes
    ...(bug.assignmentHistory || []).map(assignment => ({
      type: 'assignment' as const,
      date: assignment.date,
      title: `Przypisano do ${assignment.assignedTo}`,
      description: assignment.comment || ''
    })),
    // Comments
    ...(bug.comments || []).map(comment => ({
      type: 'comment' as const,
      date: comment.createdAt,
      title: comment.isInternal ? 'Komentarz wewnętrzny' : 'Komentarz',
      description: comment.content,
      author: comment.author,
      isInternal: comment.isInternal
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </button>
        <div className="flex gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BugReport['status'])}
            className="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.entries(BUG_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Zapisz zmiany
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('details')}
              className={`${
                activeTab === 'details'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Szczegóły zgłoszenia
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Historia zmian
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{bug.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{bug.description}</p>
                </div>

                {bug.attachments && bug.attachments.length > 0 && (
                  <div className="bg-white rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Załączniki</h3>
                    <ul className="divide-y divide-gray-200">
                      {bug.attachments.map((file, index) => (
                        <li key={index} className="py-3 flex items-center">
                          <span className="text-sm text-gray-600">{file.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Komunikacja</h3>
                  
                  <div className="space-y-4 mb-6">
                    {bug.comments?.map((comment, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          comment.isInternal
                            ? 'bg-yellow-50 border border-yellow-100'
                            : 'bg-gray-50 border border-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {comment.isInternal && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Wewnętrzna
                              </span>
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label htmlFor="message" className="sr-only">
                          Wiadomość
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Napisz wiadomość..."
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isInternal}
                          onChange={(e) => setIsInternal(e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Notatka wewnętrzna
                        </span>
                      </label>

                      <div className="flex gap-4">
                        {!isInternal && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsInternal(false);
                              handleSendMessage();
                            }}
                            disabled={isSendingMessage || !message.trim()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Wyślij do użytkownika
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setIsInternal(true);
                            handleSendMessage();
                          }}
                          disabled={isSendingMessage || !message.trim()}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Dodaj notatkę wewnętrzną
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Szczegóły zgłoszenia</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">{BUG_STATUS_LABELS[bug.status]}</dd>
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
                      <dt className="text-sm font-medium text-gray-500">Zgłaszający</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bug.createdBy}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Data zgłoszenia</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(bug.createdAt)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Przypisanie</h3>
                  <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                      Przypisz do
                    </label>
                    <select
                      id="assignedTo"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Wybierz osobę</option>
                      <option value="tech1@example.com">Jan Kowalski</option>
                      <option value="tech2@example.com">Anna Nowak</option>
                      <option value="tech3@example.com">Piotr Wiśniewski</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {timeline.map((event, eventIdx) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== timeline.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div className={`
                          flex h-8 w-8 items-center justify-center rounded-full
                          ${event.type === 'status_change' ? 'bg-blue-100' :
                            event.type === 'comment' ? (event.isInternal ? 'bg-yellow-100' : 'bg-green-100') :
                            'bg-gray-100'}
                        `}>
                          {getTimelineIcon(event.type)}
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-900">{event.title}</p>
                            {event.description && (
                              <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                            )}
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={event.date}>{formatDate(event.date)}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}