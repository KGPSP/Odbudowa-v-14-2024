import React, { useState, useEffect } from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';
import type { NewsArticle } from '../../types/news';
import NewsCard from './NewsCard';

interface NewsSectionProps {
  articles: NewsArticle[];
  title?: string;
  subtitle?: string;
  onArticleClick?: (article: NewsArticle) => void;
  onViewAll?: () => void;
}

export default function NewsSection({ 
  articles: initialArticles, 
  title = "Aktualności", 
  subtitle,
  onArticleClick,
  onViewAll
}: NewsSectionProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);

  // Load articles from localStorage on component mount
  useEffect(() => {
    const savedArticles = localStorage.getItem('news_articles');
    if (savedArticles) {
      const parsedArticles = JSON.parse(savedArticles);
      // Filter only public and published articles
      const publicArticles = parsedArticles.filter((article: NewsArticle) => 
        article.visibility === 'public' && article.status === 'published'
      );
      setArticles(publicArticles);
    }
  }, []);

  // Get only the latest 3 public articles
  const latestArticles = articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  if (latestArticles.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Newspaper className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          {subtitle && (
            <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map(article => (
            <NewsCard
              key={article.id}
              article={article}
              onClick={() => onArticleClick?.(article)}
            />
          ))}
        </div>

        {articles.length > 3 && onViewAll && (
          <div className="mt-12 text-center">
            <button 
              onClick={onViewAll}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Zobacz wszystkie aktualności
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}