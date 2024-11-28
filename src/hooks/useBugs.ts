import { useState, useEffect } from 'react';
import type { BugReport } from '../types/bug';
import { useAuth } from '../components/auth/AuthProvider';
import { v4 as uuidv4 } from 'uuid';

export function useBugs() {
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    // Load bugs from localStorage
    const loadBugs = () => {
      try {
        setLoading(true);
        setError(null);
        const savedBugs = localStorage.getItem('bugs');
        setBugs(savedBugs ? JSON.parse(savedBugs) : []);
      } catch (err) {
        console.error('Error loading bugs:', err);
        setError('Error loading bugs');
      } finally {
        setLoading(false);
      }
    };

    loadBugs();
  }, [user]);

  const createBug = async (bug: Omit<BugReport, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newBug: BugReport = {
        id: uuidv4(),
        ...bug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedBugs = [newBug, ...bugs];
      setBugs(updatedBugs);
      localStorage.setItem('bugs', JSON.stringify(updatedBugs));
      return newBug;
    } catch (err) {
      console.error('Error creating bug:', err);
      throw err;
    }
  };

  const updateBug = async (id: string, updates: Partial<BugReport>) => {
    try {
      const updatedBugs = bugs.map(bug => {
        if (bug.id === id) {
          return {
            ...bug,
            ...updates,
            updated_at: new Date().toISOString()
          };
        }
        return bug;
      });

      setBugs(updatedBugs);
      localStorage.setItem('bugs', JSON.stringify(updatedBugs));
      return updatedBugs.find(bug => bug.id === id);
    } catch (err) {
      console.error('Error updating bug:', err);
      throw err;
    }
  };

  const addComment = async (bugId: string, content: string, isInternal: boolean) => {
    try {
      const updatedBugs = bugs.map(bug => {
        if (bug.id === bugId) {
          const newComment = {
            id: uuidv4(),
            bug_id: bugId,
            content,
            author: user?.email || 'unknown',
            is_internal: isInternal,
            created_at: new Date().toISOString()
          };

          return {
            ...bug,
            comments: [...(bug.comments || []), newComment]
          };
        }
        return bug;
      });

      setBugs(updatedBugs);
      localStorage.setItem('bugs', JSON.stringify(updatedBugs));
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  return {
    bugs,
    loading,
    error,
    createBug,
    updateBug,
    addComment
  };
}