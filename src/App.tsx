import React, { useState } from 'react';
import { Shield, FileText, CheckCircle, Users, ArrowRight } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';
import LandingPage from './components/LandingPage';
import ClaimsManagement from './components/claims/ClaimsManagement';
import MainLayout from './components/layout/MainLayout';
import type { AuthState } from './types/auth';
import type { Claim } from './types/claim';
import { mockClaims } from './data/mockData';
import { authService } from './services/authService';

const getSavedClaims = () => {
  const savedClaims = localStorage.getItem('claims');
  return savedClaims ? JSON.parse(savedClaims) : mockClaims;
};

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    user: null
  });
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [claims, setClaims] = useState<Claim[]>(getSavedClaims());

  const handleLogin = async (userData: { email: string; password: string }) => {
    try {
      const user = await authService.login(userData.email, userData.password);
      setAuth({
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        user
      });
      setShowLogin(false);
    } catch (error) {
      console.error('Login error:', error);
      // Let the LoginForm component handle the error display
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setAuth({
      isAuthenticated: false,
      isAdmin: false,
      user: null
    });
    setShowRegistration(false);
    setShowLogin(false);
  };

  const handleClaimUpdate = (updatedClaims: Claim[]) => {
    setClaims(updatedClaims);
    localStorage.setItem('claims', JSON.stringify(updatedClaims));
  };

  // Show registration form
  if (showRegistration) {
    return <RegistrationForm onBack={() => setShowRegistration(false)} />;
  }

  // Show login form
  if (showLogin) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        onBack={() => setShowLogin(false)} 
        onRegister={() => setShowRegistration(true)}
      />
    );
  }

  // Show landing page for non-authenticated users
  if (!auth.isAuthenticated) {
    return (
      <LandingPage
        onRegister={() => setShowRegistration(true)}
        onLogin={() => setShowLogin(true)}
      />
    );
  }

  // Show main application for authenticated users
  return (
    <MainLayout 
      auth={auth} 
      onLogout={handleLogout}
    >
      {auth.isAdmin ? (
        <AdminPanel />
      ) : (
        <ClaimsManagement 
          auth={auth} 
          claims={claims}
          onClaimsUpdate={handleClaimUpdate}
        />
      )}
    </MainLayout>
  );
}

export default App;