import React from 'react';
import { useAuth } from './AuthContext';
import LoginForm from './LoginForm';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Brak dostępu
          </h2>
          <p className="text-gray-600">
            Nie masz uprawnień do wyświetlenia tej strony.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}