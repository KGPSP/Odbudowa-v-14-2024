import React, { useState } from 'react';
import { ArrowLeft, Clock, MessageSquare, Save, Send, Mail, CheckCircle, AlertTriangle, FileText, Building2, MapPin, CreditCard, History } from 'lucide-react';
import type { Claim } from '../../types/claim';
import type { AuthState } from '../../types/auth';
import type { LogEntry } from '../../types/log'; 
import { userService } from '../../services/userService';
import { ROLE_LABELS } from '../../types/roles';
import { generateClaimPDF } from '../../services/pdfService.tsx';
import ClaimConfirmation from './ClaimConfirmation';
import ClaimStatusBadge from './ClaimStatusBadge';
import ClaimStatusActions from './ClaimStatusActions';
import { isClaimLocked } from '../../utils/claimStatusUtils';

interface ClaimDetailsProps {
  claim: Claim;
  auth: AuthState;
  onBack: () => void;
  onUpdateStatus: (claimId: string, newStatus: string, comment: string) => Promise<void>;
  logs: LogEntry[];
  onFilterLogs: (filter: any) => void;
}

export default function ClaimDetails({ claim, auth, onBack, onUpdateStatus, logs, onFilterLogs }: ClaimDetailsProps) {
  const [activeTab, setActiveTab] = React.useState<'details' | 'history' | 'confirmation'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isActionTaken, setIsActionTaken] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      const blob = await generateClaimPDF(claim);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wniosek-${claim.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserDetails = (email: string) => {
    const user = userService.getByEmail(email);
    if (user) {
      return {
        fullName: `${user.firstName} ${user.lastName}`,
        organization: user.organizationName,
        voivodeship: user.voivodeship,
        role: ROLE_LABELS[user.role] || user.role
      };
    }
    return null;
  };

  const handleStatusUpdate = async (status: string, comment: string) => {
    try {
      setIsProcessing(true);
      setIsActionTaken(true);
      await onUpdateStatus(claim.id, status, comment);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">
                Szczegóły wniosku {claim.id}
              </h2>
              <p className="text-indigo-100 text-sm">
                Utworzono: {formatDate(claim.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-indigo-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Powrót
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ClaimStatusBadge status={claim.status} />
            <span className="text-sm text-gray-600">
              Poziom weryfikacji: {claim.currentLevel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              Ostatnia aktualizacja: {formatDate(claim.updatedAt)}
            </span>
            {claim.status === 'kprm_approved' && (
              <button
                onClick={handleDownloadPDF}
                className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Pobierz wniosek
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <FileText className="w-5 h-5" />
            Szczegóły wniosku
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <History className="w-5 h-5" />
            Historia działań
          </button>
          {claim.status === 'approved' && (
            <button
              onClick={() => setActiveTab('confirmation')}
              className={`${
                activeTab === 'confirmation'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <CheckCircle className="w-5 h-5" />
              Potwierdzenie
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    Informacje o obiekcie
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nazwa zwyczajowa</label>
                    <p className="mt-1 text-sm text-gray-900">{claim.commonName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID wniosku Survey123</label>
                    <p className="mt-1 text-sm text-gray-900">{claim.surveyId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nazwa obiektu</label>
                    <p className="mt-1 text-sm text-gray-900">{claim.objectName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Adres</label>
                    <p className="mt-1 text-sm text-gray-900">{claim.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    Informacje finansowe
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-medium text-gray-500">Wycena szkód (netto)</label>
                      <p className="mt-1 text-xl font-semibold text-gray-900">{formatMoney(claim.finalNetAmount)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-medium text-gray-500">Kwota wnioskowana</label>
                      <p className="mt-1 text-xl font-semibold text-indigo-600">{formatMoney(claim.requestedAmount)}</p>
                    </div>
                  </div>
                  {claim.otherFundingSources && claim.otherFundingSources.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Inne źródła finansowania</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {claim.otherFundingSources.map((source, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location and Additional Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    Lokalizacja
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Województwo</label>
                      <p className="mt-1 text-sm text-gray-900">{claim.voivodeship}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Powiat</label>
                      <p className="mt-1 text-sm text-gray-900">{claim.county}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gmina</label>
                      <p className="mt-1 text-sm text-gray-900">{claim.commune}</p>
                    </div>
                  </div>
                </div>
              </div>

              {claim.notes && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      Uwagi
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: claim.notes }} />
                    </div>
                  </div>
                </div>
              )}

              {auth.user?.role !== 'user' && !isClaimLocked(claim) && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-500" />
                      Akcje
                    </h3>
                  </div>
                  <div className="p-4">
                    <ClaimStatusActions
                      claim={claim}
                      userRole={auth.user.role}
                      onUpdateStatus={handleStatusUpdate}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              )}

              {isClaimLocked(claim) && (
                <div className="bg-gray-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Ten wniosek został już zatwierdzony i nie może być modyfikowany.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {claim.history.map((event, eventIdx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== claim.history.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div className={`
                        flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white
                        ${event.status.includes('approved') ? 'bg-green-500' :
                          event.status.includes('rejected') ? 'bg-red-500' :
                          event.status === 'returned' ? 'bg-yellow-500' :
                          'bg-gray-500'}
                      `}>
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            {event.comment}
                          </p>
                          {(() => {
                            const userDetails = getUserDetails(event.updatedBy);
                            return userDetails ? (
                              <div className="mt-2 text-xs space-y-1">
                                <p className="text-gray-900 font-medium">
                                  {userDetails.fullName}
                                </p>
                                <p className="text-gray-500">
                                  {userDetails.organization}
                                  {userDetails.voivodeship && ` • ${userDetails.voivodeship}`}
                                </p>
                                <p className="text-gray-500">
                                  {userDetails.role}
                                </p>
                              </div>
                            ) : (
                              <p className="mt-1 text-xs text-gray-400">
                                Przez: {event.updatedBy}
                              </p>
                            );
                          })()}
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime={event.updatedAt}>
                            {formatDate(event.updatedAt)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'confirmation' && claim.status === 'approved' && (
          <ClaimConfirmation claim={claim} />
        )}
      </div>
    </div>
  );
}