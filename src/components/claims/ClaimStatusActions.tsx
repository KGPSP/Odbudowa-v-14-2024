import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import type { Claim, ClaimStatus } from '../../types/claim';
import ElectronicSignature from '../ElectronicSignature';
import { getAvailableActions } from '../../utils/claimStatusUtils';

interface ClaimStatusActionsProps {
  claim: Claim;
  userRole: string;
  onUpdateStatus: (status: ClaimStatus, comment: string) => Promise<void>;
  disabled?: boolean;
}

export default function ClaimStatusActions({
  claim,
  userRole,
  onUpdateStatus,
  disabled = false
}: ClaimStatusActionsProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | 'return' | null>(null);

  const availableActions = getAvailableActions(claim, userRole);

  const initiateAction = (action: 'approve' | 'reject' | 'return') => {
    if (!comment) {
      setShowValidation(true);
      return;
    }
    setPendingAction(action);
    setShowSignature(true);
  };

  const handleAction = async () => {
    try {
      setIsSubmitting(true);
      setShowValidation(false);
      let newStatus: ClaimStatus;
      
      switch (pendingAction) {
        case 'approve':
          if (userRole === 'voivodeship_admin') newStatus = 'voivodeship_approved';
          else if (userRole === 'mswia_admin') newStatus = 'mswia_approved';
          else if (userRole === 'kprm_admin') newStatus = 'kprm_approved';
          else throw new Error('Invalid role for approval');
          break;
        case 'reject':
          if (userRole === 'voivodeship_admin') newStatus = 'voivodeship_rejected';
          else if (userRole === 'mswia_admin') newStatus = 'mswia_rejected';
          else if (userRole === 'kprm_admin') newStatus = 'kprm_rejected';
          else throw new Error('Invalid role for rejection');
          break;
        case 'return':
          newStatus = 'returned';
          break;
        default:
          throw new Error('Invalid action');
      }
      
      await onUpdateStatus(newStatus, comment);
      setComment('');
      setPendingAction(null);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowSignature(false);
    setPendingAction(null);
  };
  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {showSignature && (
        <ElectronicSignature
          onVerify={handleAction}
          onCancel={handleCancel}
        />
      )}

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Komentarz
          {showValidation && (
            <span className="text-red-600 ml-1">*wymagany</span>
          )}
        </label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (showValidation && e.target.value) {
              setShowValidation(false);
            }
          }}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            showValidation ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Dodaj komentarz przed zmianą statusu..."
        />
        {showValidation && (
          <p className="mt-1 text-sm text-red-600">
            Proszę dodać komentarz przed zmianą statusu
          </p>
        )}
      </div>

      <div className="flex gap-4">
        {availableActions.includes('approve') && (
          <button
            onClick={() => initiateAction('approve')}
            disabled={isSubmitting || disabled}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Zatwierdź
          </button>
        )}

        {availableActions.includes('reject') && (
          <button
            onClick={() => initiateAction('reject')}
            disabled={isSubmitting || disabled}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Odrzuć
          </button>
        )}

        {availableActions.includes('return') && (
          <button
            onClick={() => initiateAction('return')}
            disabled={isSubmitting || disabled}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Zwróć do poprawy
          </button>
        )}
      </div>
    </div>
  );
}