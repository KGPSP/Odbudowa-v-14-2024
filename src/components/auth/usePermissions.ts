import { useAuth } from './AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  return {
    canCreateNews: user?.role === 'admin' || user?.role === 'editor',
    canEditNews: user?.role === 'admin' || user?.role === 'editor',
    canDeleteNews: user?.role === 'admin',
    canManageUsers: user?.role === 'admin',
    canViewStats: user?.role === 'admin' || user?.role === 'editor',
    canManageComments: user?.role === 'admin' || user?.role === 'moderator',
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    user
  };
}