import { v4 as uuidv4 } from 'uuid';

const usedIds = new Set<string>();

export const generateClaimId = (): string => {
  const currentYear = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const randomPart = uuidv4().split('-')[0].substring(0, 4).toUpperCase();
  
  let newId = `${currentYear}/${sequence}/${randomPart}`;
  
  // Ensure uniqueness
  while (usedIds.has(newId)) {
    const newSequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const newRandomPart = uuidv4().split('-')[0].substring(0, 4).toUpperCase();
    newId = `${currentYear}/${newSequence}/${newRandomPart}`;
  }
  
  usedIds.add(newId);
  return newId;
};

// Load existing IDs from localStorage to maintain uniqueness across sessions
export const initializeUsedIds = () => {
  const claims = JSON.parse(localStorage.getItem('claims') || '[]');
  claims.forEach((claim: any) => {
    if (claim.id) {
      usedIds.add(claim.id);
    }
  });
};

// Initialize used IDs when the module loads
initializeUsedIds();