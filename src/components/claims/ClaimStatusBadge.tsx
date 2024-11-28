import React from 'react';
import { ClaimStatus, CLAIM_STATUS_LABELS } from '../../types/claim';

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

export default function ClaimStatusBadge({ status, className = '' }: ClaimStatusBadgeProps) {
  const getStatusColor = (status: ClaimStatus): string => {
    if (status.includes('approved')) {
      return 'bg-green-100 text-green-800';
    }
    if (status.includes('rejected')) {
      return 'bg-red-100 text-red-800';
    }
    if (status === 'returned') {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (status.includes('review')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)} ${className}`}>
      {CLAIM_STATUS_LABELS[status]}
    </span>
  );
}