import React, { useState, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  HelpCircle,
  Phone, 
  Info,
  Map as MapIcon,
  Menu as MenuIcon,
  User,
  LogOut,
  ChevronDown,
  Newspaper,
  Settings
} from 'lucide-react';
import { ROLE_LABELS } from '../../types/roles';
import type { AuthState } from '../../types/auth';
import type { Claim } from '../../types/claim';
import InstructionsPage from '../pages/InstructionsPage';
import ContactPage from '../pages/ContactPage';
import AboutPage from '../pages/AboutPage';
import NewsPublicView from '../news/NewsPublicView';
import UserProfileEdit from '../users/UserProfileEdit';
import ClaimsManagement from '../claims/ClaimsManagement';
import { mockNews } from '../../data/mockNews';

interface MainLayoutProps {
  children: React.ReactNode;
  auth: AuthState;
  onLogout: () => void;
}

export default function MainLayout({ children, auth, onLogout }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState('home');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    // Load claims from localStorage
    const savedClaims = localStorage.getItem('claims');
    if (savedClaims) {
      setClaims(JSON.parse(savedClaims));
    }
  }, []);

  const handleClaimsUpdate = (updatedClaims: Claim[]) => {
    setClaims(updatedClaims);
    localStorage.setItem('claims', JSON.stringify(updatedClaims));
  };

  const navigation = [
    { name: 'Strona główna', icon: Home, id: 'home' },
    { name: 'Wnioski', icon: FileText, id: 'claims' },
    { name: 'Mapa', icon: MapIcon, id: 'map', external: 'https://gis-portal.straz.gov.pl/portal/apps/webappviewer/index.html?id=b403009fa5ac4f6c8ea3791fc70afdf3' },
    { name: 'Aktualności', icon: Newspaper, id: 'news' },
    { name: 'Instrukcja', icon: HelpCircle, id: 'instructions' },
    { name: 'Kontakt', icon: Phone, id: 'contact' },
    { name: 'O systemie', icon: Info, id: 'about' },
  ];

  const renderContent = () => {
    if (showProfileEdit) {
      return <UserProfileEdit user={auth.user} onClose={() => setShowProfileEdit(false)} />;
    }

    switch (currentPage) {
      case 'claims':
        return <ClaimsManagement auth={auth} claims={claims} onClaimsUpdate={handleClaimsUpdate} />;
      case 'news':
        return <NewsPublicView articles={mockNews} />;
      case 'instructions':
        return <InstructionsPage />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return <AboutPage />;
      default:
        return children;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <img src="/logo.svg" alt="Logo Systemu" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">System Odbudowa 2024</h1>
                <p className="text-sm text-gray-500">KG PSP</p>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {auth.user?.firstName} {auth.user?.lastName}
                </p>
                <p className="text-xs text-gray-600">
                  {auth.user?.email}
                </p>
                <p className="text-xs font-medium text-indigo-600">
                  {ROLE_LABELS[auth.user?.role || 'user']}
                </p>
              </div>
              <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowProfileEdit(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edytuj profil
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Wyloguj się
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className={`lg:w-64 ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-600">Menu główne</p>
              </div>
              <div className="p-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.external) {
                        window.open(item.external, '_blank');
                      } else {
                        setCurrentPage(item.id);
                        setShowMobileMenu(false);
                        setShowProfileEdit(false);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === item.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} KG PSP - Wszelkie prawa zastrzeżone
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>BIŁ</span>
              <span>•</span>
              <span>KPRM</span>
              <span>•</span>
              <span>MSWiA</span>
            </div>
            <div className="text-sm text-gray-500">
              Wersja: 1.0.0-beta
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}