import type { User } from '../types/user';
import type { Claim } from '../types/claim';
import type { LogEntry } from '../types/log';

// Mock users with different roles
export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    organizationalUnit: 'Urząd Gminy Warszawa',
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Śródmieście',
    address: 'ul. Przykładowa 1',
    phone: '123456789',
    email: 'jan.kowalski@example.com',
    status: 'active',
    role: 'user',
    createdAt: '2024-03-14T10:00:00Z'
  },
  {
    id: '2',
    firstName: 'Anna',
    lastName: 'Nowak',
    organizationalUnit: 'Urząd Wojewódzki Mazowiecki',
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Śródmieście',
    address: 'ul. Wojewódzka 1',
    phone: '987654321',
    email: 'anna.nowak@example.com',
    status: 'active',
    role: 'voivodeship_admin',
    createdAt: '2024-03-14T10:30:00Z'
  },
  {
    id: '3',
    firstName: 'Piotr',
    lastName: 'Wiśniewski',
    organizationalUnit: 'MSWiA',
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Śródmieście',
    address: 'ul. Ministerialna 1',
    phone: '555666777',
    email: 'piotr.wisniewski@example.com',
    status: 'active',
    role: 'mswia_admin',
    createdAt: '2024-03-14T11:00:00Z'
  },
  {
    id: '4',
    firstName: 'Maria',
    lastName: 'Dąbrowska',
    organizationalUnit: 'KPRM',
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Śródmieście',
    address: 'ul. Rządowa 1',
    phone: '111222333',
    email: 'maria.dabrowska@example.com',
    status: 'active',
    role: 'kprm_admin',
    createdAt: '2024-03-14T11:30:00Z'
  },
  {
    id: '5',
    firstName: 'Admin',
    lastName: 'Systemowy',
    organizationalUnit: 'Administrator Systemu',
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Śródmieście',
    address: 'ul. Systemowa 1',
    phone: '999888777',
    email: 'admin@example.com',
    status: 'active',
    role: 'admin',
    createdAt: '2024-03-14T12:00:00Z'
  }
];

// Mock claims covering different scenarios
export const mockClaims: Claim[] = [
  // Nowo złożony wniosek
  {
    id: '1',
    objectName: 'Most na rzece Wisła',
    estimatedLoss: 500000,
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Śródmieście',
    notes: 'Uszkodzenia konstrukcyjne po powodzi',
    status: 'submitted',
    currentLevel: 'voivodeship',
    history: [
      {
        id: '1',
        claimId: '1',
        status: 'submitted',
        level: 'voivodeship',
        comment: 'Wniosek złożony',
        updatedBy: 'jan.kowalski@example.com',
        updatedAt: '2024-03-14T12:00:00Z'
      }
    ],
    createdBy: 'jan.kowalski@example.com',
    createdAt: '2024-03-14T12:00:00Z',
    updatedAt: '2024-03-14T12:00:00Z',
    locked: false
  },

  // Wniosek w trakcie weryfikacji wojewódzkiej
  {
    id: '2',
    objectName: 'Szkoła Podstawowa nr 1',
    estimatedLoss: 750000,
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Mokotów',
    notes: 'Zniszczenia po burzy',
    status: 'voivodeship_review',
    currentLevel: 'voivodeship',
    history: [
      {
        id: '2',
        claimId: '2',
        status: 'submitted',
        level: 'voivodeship',
        comment: 'Wniosek złożony',
        updatedBy: 'jan.kowalski@example.com',
        updatedAt: '2024-03-13T10:00:00Z'
      },
      {
        id: '3',
        claimId: '2',
        status: 'voivodeship_review',
        level: 'voivodeship',
        comment: 'Rozpoczęto weryfikację',
        updatedBy: 'anna.nowak@example.com',
        updatedAt: '2024-03-14T11:00:00Z'
      }
    ],
    createdBy: 'jan.kowalski@example.com',
    createdAt: '2024-03-13T10:00:00Z',
    updatedAt: '2024-03-14T11:00:00Z',
    locked: false
  },

  // Wniosek zwrócony do poprawy
  {
    id: '3',
    objectName: 'Droga gminna',
    estimatedLoss: 300000,
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Wawer',
    notes: 'Uszkodzenia nawierzchni',
    status: 'returned',
    currentLevel: 'voivodeship',
    history: [
      {
        id: '4',
        claimId: '3',
        status: 'submitted',
        level: 'voivodeship',
        comment: 'Wniosek złożony',
        updatedBy: 'jan.kowalski@example.com',
        updatedAt: '2024-03-12T14:00:00Z'
      },
      {
        id: '5',
        claimId: '3',
        status: 'returned',
        level: 'voivodeship',
        comment: 'Proszę o uzupełnienie dokumentacji fotograficznej',
        updatedBy: 'anna.nowak@example.com',
        updatedAt: '2024-03-13T09:00:00Z'
      }
    ],
    createdBy: 'jan.kowalski@example.com',
    createdAt: '2024-03-12T14:00:00Z',
    updatedAt: '2024-03-13T09:00:00Z',
    locked: false
  },

  // Wniosek zaakceptowany wojewódzko, w trakcie weryfikacji MSWiA
  {
    id: '4',
    objectName: 'Remiza strażacka',
    estimatedLoss: 450000,
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Białołęka',
    notes: 'Zniszczenia po pożarze',
    status: 'mswia_review',
    currentLevel: 'mswia',
    history: [
      {
        id: '6',
        claimId: '4',
        status: 'submitted',
        level: 'voivodeship',
        comment: 'Wniosek złożony',
        updatedBy: 'jan.kowalski@example.com',
        updatedAt: '2024-03-10T10:00:00Z'
      },
      {
        id: '7',
        claimId: '4',
        status: 'voivodeship_approved',
        level: 'voivodeship',
        comment: 'Zaakceptowano na poziomie wojewódzkim',
        updatedBy: 'anna.nowak@example.com',
        updatedAt: '2024-03-11T15:00:00Z'
      },
      {
        id: '8',
        claimId: '4',
        status: 'mswia_review',
        level: 'mswia',
        comment: 'Rozpoczęto weryfikację w MSWiA',
        updatedBy: 'piotr.wisniewski@example.com',
        updatedAt: '2024-03-12T09:00:00Z'
      }
    ],
    createdBy: 'jan.kowalski@example.com',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-12T09:00:00Z',
    locked: true
  },

  // Wniosek zaakceptowany przez MSWiA, w trakcie weryfikacji KPRM
  {
    id: '5',
    objectName: 'Biblioteka miejska',
    estimatedLoss: 900000,
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Praga',
    notes: 'Zalanie pomieszczeń',
    status: 'kprm_review',
    currentLevel: 'kprm',
    history: [
      {
        id: '9',
        claimId: '5',
        status: 'submitted',
        level: 'voivodeship',
        comment: 'Wniosek złożony',
        updatedBy: 'jan.kowalski@example.com',
        updatedAt: '2024-03-08T11:00:00Z'
      },
      {
        id: '10',
        claimId: '5',
        status: 'voivodeship_approved',
        level: 'voivodeship',
        comment: 'Zaakceptowano na poziomie wojewódzkim',
        updatedBy: 'anna.nowak@example.com',
        updatedAt: '2024-03-09T14:00:00Z'
      },
      {
        id: '11',
        claimId: '5',
        status: 'mswia_approved',
        level: 'mswia',
        comment: 'Zaakceptowano przez MSWiA',
        updatedBy: 'piotr.wisniewski@example.com',
        updatedAt: '2024-03-10T16:00:00Z'
      },
      {
        id: '12',
        claimId: '5',
        status: 'kprm_review',
        level: 'kprm',
        comment: 'Rozpoczęto weryfikację w KPRM',
        updatedBy: 'maria.dabrowska@example.com',
        updatedAt: '2024-03-11T10:00:00Z'
      }
    ],
    createdBy: 'jan.kowalski@example.com',
    createdAt: '2024-03-08T11:00:00Z',
    updatedAt: '2024-03-11T10:00:00Z',
    locked: true
  },

  // Wniosek ostatecznie zaakceptowany
  {
    id: '6',
    objectName: 'Przedszkole miejskie',
    estimatedLoss: 600000,
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Ursynów',
    notes: 'Uszkodzenia dachu',
    status: 'approved',
    currentLevel: 'completed',
    history: [
      {
        id: '13',
        claimId: '6',
        status: 'submitted',
        level: 'voivodeship',
        comment: 'Wniosek złożony',
        updatedBy: 'jan.kowalski@example.com',
        updatedAt: '2024-03-05T09:00:00Z'
      },
      {
        id: '14',
        claimId: '6',
        status: 'voivodeship_approved',
        level: 'voivodeship',
        comment: 'Zaakceptowano na poziomie wojewódzkim',
        updatedBy: 'anna.nowak@example.com',
        updatedAt: '2024-03-06T11:00:00Z'
      },
      {
        id: '15',
        claimId: '6',
        status: 'mswia_approved',
        level: 'mswia',
        comment: 'Zaakceptowano przez MSWiA',
        updatedBy: 'piotr.wisniewski@example.com',
        updatedAt: '2024-03-07T14:00:00Z'
      },
      {
        id: '16',
        claimId: '6',
        status: 'approved',
        level: 'kprm',
        comment: 'Ostateczna akceptacja',
        updatedBy: 'maria.dabrowska@example.com',
        updatedAt: '2024-03-08T16:00:00Z'
      }
    ],
    createdBy: 'jan.kowalski@example.com',
    createdAt: '2024-03-05T09:00:00Z',
    updatedAt: '2024-03-08T16:00:00Z',
    locked: true
  },

  // Wniosek odrzucony na poziomie wojewódzkim
  {
    id: '7',
    objectName: 'Boisko szkolne',
    estimatedLoss: 200000,
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa-Targówek',
    notes: 'Zniszczenia nawierzchni',
    status: 'voivodeship_rejected',
    currentLevel: 'completed',
    history: [
      {
        id: '17',
        claimId: '7',
        status: 'submitted',
        level: 'voivodeship',
        comment: 'Wniosek złożony',
        updatedBy: 'jan.kowalski@example.com',
        updatedAt: '2024-03-13T13:00:00Z'
      },
      {
        id: '18',
        claimId: '7',
        status: 'voivodeship_rejected',
        level: 'voivodeship',
        comment: 'Brak podstaw do przyznania świadczenia',
        updatedBy: 'anna.nowak@example.com',
        updatedAt: '2024-03-14T10:00:00Z'
      }
    ],
    createdBy: 'jan.kowalski@example.com',
    createdAt: '2024-03-13T13:00:00Z',
    updatedAt: '2024-03-14T10:00:00Z',
    locked: true
  }
];

// Mock logs for system activity
export const mockLogs: LogEntry[] = mockClaims.flatMap(claim => 
  claim.history.map(entry => ({
    id: entry.id,
    timestamp: entry.updatedAt,
    action: entry.status.includes('rejected') ? 'reject' :
           entry.status.includes('approved') ? 'approve' :
           entry.status === 'returned' ? 'return' : 'status_change',
    userId: '1', // Simplified for mock data
    userEmail: entry.updatedBy,
    claimId: claim.id,
    details: {
      previousStatus: claim.history[claim.history.indexOf(entry) - 1]?.status,
      newStatus: entry.status,
      comment: entry.comment
    }
  }))
);