import React, { useState, useEffect } from 'react';
import { Shield, FileText, CheckCircle, Users, ArrowRight } from 'lucide-react';
import NewsSection from './news/NewsSection';
import NewsDetails from './news/NewsDetails';
import type { NewsArticle } from '../types/news';

interface LandingPageProps {
  onRegister: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onRegister, onLogin }: LandingPageProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    // Load articles from localStorage
    const savedArticles = localStorage.getItem('news_articles');
    if (savedArticles) {
      // Filter only public articles and published ones
      const publicArticles = JSON.parse(savedArticles).filter((article: NewsArticle) => 
        article.visibility === 'public' && article.status === 'published'
      );
      setArticles(publicArticles);
    }
  }, []);

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsDetails
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="images/hero.jpg"
            alt="Kontrast zniszczeń i odbudowy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className="block mb-2">System Zarządzania</span>
              <span className="block text-indigo-400">Odbudową 2024</span>
            </h1>
            <p className="mt-6 max-w-lg sm:max-w-2xl text-xl text-gray-300 leading-relaxed">
              Kompleksowe wsparcie w procesie odbudowy po klęskach żywiołowych. 
              Wspólnie przywróćmy nadzieję i odbudujmy zniszczone regiony.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center sm:justify-start">
              <button
                onClick={onRegister}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Zarejestruj się
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={onLogin}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-colors duration-200"
              >
                Zaloguj się
                <Shield className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      {articles.length > 0 && (
        <NewsSection 
          articles={articles}
          title="Najnowsze aktualności"
          subtitle="Bądź na bieżąco z najważniejszymi informacjami dotyczącymi programu odbudowy"
          onArticleClick={setSelectedArticle}
          onViewAll={onLogin}
        />
      )}

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Możliwości systemu</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Kompleksowe wsparcie procesu odbudowy
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Nasz system zapewnia pełną obsługę procesu składania i weryfikacji wniosków o wsparcie.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Składanie wniosków</h3>
                <p className="mt-2 text-base text-gray-500">
                  Intuicyjny proces składania wniosków z możliwością załączania dokumentacji.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Weryfikacja</h3>
                <p className="mt-2 text-base text-gray-500">
                  Wielopoziomowy proces weryfikacji zapewniający transparentność.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Zarządzanie</h3>
                <p className="mt-2 text-base text-gray-500">
                  Zaawansowany system ról i uprawnień dla różnych szczebli administracji.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Bezpieczeństwo</h3>
                <p className="mt-2 text-base text-gray-500">
                  Pełne bezpieczeństwo danych i zgodność z wymogami prawnymi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            © 2024 System Zarządzania Wnioskami. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}