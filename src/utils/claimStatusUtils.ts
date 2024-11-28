import type { Claim } from '../types/claim';

export const isClaimLocked = (claim: Claim): boolean => {
  // Only lock claims that are fully approved or rejected
  const finalStatuses = [
    'kprm_approved',
    'approved',
    'rejected'
  ];

  return finalStatuses.includes(claim.status) || claim.locked;
};

export const isClaimEditable = (claim: Claim, userRole: string): boolean => {
  if (isClaimLocked(claim)) {
    return false;
  }

  // Only allow editing if claim is in draft or returned state for regular users
  if (userRole === 'user') {
    return ['draft', 'returned'].includes(claim.status);
  }

  // Admins can edit claims in their respective levels
  const roleToLevelMap: Record<string, string[]> = {
    'voivodeship_admin': ['submitted', 'voivodeship_review'],
    'mswia_admin': ['voivodeship_approved'],
    'kprm_admin': ['mswia_approved'],
    'admin': ['submitted', 'voivodeship_review', 'mswia_review', 'kprm_review']
  };

  return roleToLevelMap[userRole]?.includes(claim.status) || false;
};

export const getAvailableActions = (claim: Claim, userRole: string): ('approve' | 'reject' | 'return')[] => {
  if (isClaimLocked(claim)) {
    return [];
  }

  const roleToStatusMap: Record<string, string[]> = {
    'voivodeship_admin': ['submitted', 'voivodeship_review'],
    'mswia_admin': ['voivodeship_approved'],
    'kprm_admin': ['mswia_approved'],
    'admin': ['submitted', 'voivodeship_review', 'mswia_review', 'kprm_review']
  };

  if (!roleToStatusMap[userRole]?.includes(claim.status)) {
    return [];
  }

  return ['approve', 'reject', 'return'];
};