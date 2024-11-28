import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Claim } from '../../types/claim';
import type { AuthState } from '../../types/auth';
import type { LogEntry } from '../../types/log';
import ClaimsList from './ClaimsList';
import ClaimForm from './ClaimForm';
import ClaimDetails from './ClaimDetails';
import { generateClaimId } from '../../utils/claimIdGenerator';

interface ClaimsManagementProps {
  auth: AuthState;
  claims: Claim[];
  onClaimsUpdate: (claims: Claim[]) => void;
}

export default function ClaimsManagement({ auth, claims, onClaimsUpdate }: ClaimsManagementProps) {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const savedClaims = localStorage.getItem('claims');
    if (savedClaims) {
      onClaimsUpdate(JSON.parse(savedClaims));
    }
  }, []);

  // Filter claims based on user role and permissions
  const getFilteredClaims = () => {
    if (!auth.user) return [];

    switch (auth.user.role) {
      case 'user':
        // User sees only their own claims and claims with matching NIP
        return claims.filter(claim => 
          claim.createdBy === auth.user.email || 
          claim.nip === auth.user.nip
        );
      
      case 'voivodeship_admin':
        // Voivodeship admin sees only claims from their voivodeship
        return claims.filter(claim => 
          claim.voivodeship === auth.user.voivodeship
        );
      
      case 'mswia_admin':
      case 'kprm_admin':
      case 'admin':
        // These roles see all claims
        return claims;
      
      default:
        return [];
    }
  };

  const handleSubmitClaim = async (data: any, isDraft: boolean) => {
    try {
      const now = new Date().toISOString();
      const status = isDraft ? 'draft' : 'submitted';
      
      let updatedClaims;
      if (editingClaim) {
        updatedClaims = claims.map(claim => {
          if (claim.id === editingClaim.id) {
            const updatedClaim = {
              ...claim,
              ...data,
              status,
              updatedAt: now,
              history: [
                ...claim.history,
                {
                  id: uuidv4(),
                  claimId: claim.id,
                  status,
                  level: 'user',
                  comment: isDraft ? 'Zapisano wersję roboczą' : 'Zaktualizowano wniosek',
                  updatedBy: auth.user?.email || 'unknown',
                  updatedAt: now
                }
              ]
            };
            return updatedClaim;
          }
          return claim;
        });
      } else {
        const newClaimId = generateClaimId();
        const newClaim: Claim = {
          id: newClaimId,
          ...data,
          status,
          currentLevel: isDraft ? 'draft' : 'voivodeship',
          history: [{
            id: uuidv4(),
            claimId: newClaimId,
            status,
            level: 'user',
            comment: isDraft ? 'Utworzono wersję roboczą' : 'Złożono wniosek',
            updatedBy: auth.user?.email || 'unknown',
            updatedAt: now
          }],
          createdBy: auth.user?.email || 'unknown',
          createdAt: now,
          updatedAt: now,
          locked: false,
          otherFundingSources: data.otherFundingSources || []
        };
        updatedClaims = [...claims, newClaim];
      }

      localStorage.setItem('claims', JSON.stringify(updatedClaims));
      onClaimsUpdate(updatedClaims);
      setShowForm(false);
      setEditingClaim(null);
    } catch (error) {
      console.error('Error submitting claim:', error);
      throw error;
    }
  };

  const handleDeleteClaim = async (claim: Claim) => {
    // Check if user can delete the claim
    if (auth.user?.role === 'user' && claim.status === 'submitted') {
      throw new Error('Nie można usunąć złożonego wniosku');
    }

    const updatedClaims = claims.filter(c => c.id !== claim.id);
    localStorage.setItem('claims', JSON.stringify(updatedClaims));
    onClaimsUpdate(updatedClaims);
  };

  const handleViewClaim = (id: string) => {
    const claim = claims.find(c => c.id === id);
    if (claim) {
      setSelectedClaim(claim);
      setShowForm(false);
      const claimLogs = claim.history.map(entry => ({
        id: entry.id,
        timestamp: entry.updatedAt,
        action: entry.status === 'rejected' ? 'reject' :
               entry.status === 'approved' ? 'approve' :
               entry.status === 'returned' ? 'return' : 'status_change',
        userId: '1',
        userEmail: entry.updatedBy,
        claimId: claim.id,
        details: {
          previousStatus: claim.history[claim.history.indexOf(entry) - 1]?.status,
          newStatus: entry.status,
          comment: entry.comment
        }
      }));
      setLogs(claimLogs);
    }
  };

  const handleEditClaim = (claim: Claim) => {
    setEditingClaim(claim);
    setShowForm(true);
    setSelectedClaim(null);
  };

  const handleUpdateStatus = async (claimId: string, newStatus: string, comment: string) => {
    try {
      const now = new Date().toISOString();
      const updatedClaims = claims.map(claim => {
        if (claim.id === claimId) {
          return {
            ...claim,
            status: newStatus,
            updatedAt: now,
            history: [
              ...claim.history,
              {
                id: uuidv4(),
                claimId,
                status: newStatus,
                level: auth.user?.role.replace('_admin', '') || 'unknown',
                comment,
                updatedBy: auth.user?.email || 'unknown',
                updatedAt: now
              }
            ]
          };
        }
        return claim;
      });

      localStorage.setItem('claims', JSON.stringify(updatedClaims));
      onClaimsUpdate(updatedClaims);
      setSelectedClaim(null);
    } catch (error) {
      console.error('Error updating claim status:', error);
      throw error;
    }
  };

  if (showForm) {
    return (
      <ClaimForm
        onSubmit={handleSubmitClaim}
        onDelete={editingClaim?.id ? handleDeleteClaim : undefined}
        defaultVoivodeship={auth.user?.voivodeship}
        initialData={editingClaim || undefined}
        onBack={() => {
          setShowForm(false);
          setEditingClaim(null);
        }}
        userData={auth.user}
      />
    );
  }

  if (selectedClaim) {
    return (
      <ClaimDetails
        claim={selectedClaim}
        auth={auth}
        onBack={() => setSelectedClaim(null)}
        onUpdateStatus={async (claimId, newStatus, comment) => {
          const updatedClaims = claims.map(claim => {
            if (claim.id === claimId) {
              const historyEntry = {
                id: uuidv4(),
                claimId,
                status: newStatus,
                level: auth.user?.role.replace('_admin', '') || 'unknown',
                comment,
                updatedBy: auth.user?.email || 'unknown',
                updatedAt: new Date().toISOString()
              };

              return {
                ...claim,
                status: newStatus,
                history: [...claim.history, historyEntry],
                updatedAt: new Date().toISOString()
              };
            }
            return claim;
          });

          localStorage.setItem('claims', JSON.stringify(updatedClaims));
          onClaimsUpdate(updatedClaims);
          setSelectedClaim(null);
        }}
        logs={logs}
        onFilterLogs={() => {}}
      />
    );
  }

  const filteredClaims = getFilteredClaims();

  return (
    <div className="space-y-6">
      {auth.user?.role === 'user' && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-5 h-5" />
            Nowy wniosek
          </button>
        </div>
      )}

      <ClaimsList
        claims={filteredClaims}
        onSelectClaim={handleViewClaim}
        onEditClaim={handleEditClaim}
        onDeleteClaim={handleDeleteClaim}
        auth={auth}
      />
    </div>
  );
}