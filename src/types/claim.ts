export type ClaimStatus = 
  | 'draft'
  | 'submitted' 
  | 'returned'
  | 'voivodeship_review'
  | 'voivodeship_approved'
  | 'voivodeship_rejected'
  | 'mswia_review'
  | 'mswia_approved'
  | 'mswia_rejected'
  | 'kprm_review'
  | 'kprm_approved'
  | 'kprm_rejected'
  | 'approved'
  | 'rejected';

export interface ClaimFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Claim {
  id: string;
  commonName: string;
  surveyId: string;
  objectName: string;
  address: string;
  estimatedLoss: number;
  finalNetAmount: number;
  requestedAmount: number;
  otherFundingSources: string[];
  voivodeship: string;
  county: string;
  commune: string;
  notes: string;
  status: ClaimStatus;
  currentLevel: string;
  history: {
    id: string;
    claimId: string;
    status: string;
    level: string;
    comment: string;
    updatedBy: string;
    updatedAt: string;
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  locked: boolean;
  files?: ClaimFile[];
}

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  draft: 'Wersja robocza',
  submitted: 'Złożony',
  returned: 'Zwrócony do poprawy',
  voivodeship_review: 'W weryfikacji wojewódzkiej',
  voivodeship_approved: 'Zaakceptowany wojewódzko',
  voivodeship_rejected: 'Odrzucony wojewódzko',
  mswia_review: 'W weryfikacji MSWiA',
  mswia_approved: 'Zaakceptowany przez MSWiA',
  mswia_rejected: 'Odrzucony przez MSWiA',
  kprm_review: 'W weryfikacji KPRM',
  kprm_approved: 'Zaakceptowany przez KPRM',
  kprm_rejected: 'Odrzucony przez KPRM',
  approved: 'Zatwierdzony',
  rejected: 'Odrzucony'
};