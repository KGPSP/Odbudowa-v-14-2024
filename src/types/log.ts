export interface LogEntry {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'status_change' | 'return' | 'approve' | 'reject';
  userId: string;
  userEmail: string;
  claimId: string;
  details: {
    previousStatus?: string;
    newStatus?: string;
    comment?: string;
    changes?: Record<string, { old: any; new: any }>;
  };
}

export interface LogFilter {
  startDate?: Date;
  endDate?: Date;
  action?: string;
  userId?: string;
  claimId?: string;
}