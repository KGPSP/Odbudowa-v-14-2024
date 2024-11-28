import React, { useState, useEffect } from 'react';
import { Search, Calendar, Tag } from 'lucide-react';
import type { NewsArticle } from '../../types/news';
import NewsCard from './NewsCard';
import NewsFeatured from './NewsFeatured';
import NewsDetails from './NewsDetails';

interface NewsPublicViewProps {
  articles: NewsArticle[];
}

export default function NewsPublicView({ articles: initialArticles }: NewsPublicViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [visibleArticles, setVisibleArticles] = useState(6);
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

  // Get all unique tags from articles
  const allTags = Array.from(
    new Set(articles.flatMap(article => article.tags || []))
  );

  // Filter articles based on search and tags
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag ||
      (article.tags && article.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  // Get featured article (most recent alert or first article)
  const featuredArticle = articles.find(article => article.category === 'alert') || articles[0];
  const regularArticles = filteredArticles.filter(article => article.id !== featuredArticle?.id);

  const handleLoadMore = () => {
    setVisibleArticles(prev => prev + 6);
  };

  if (selectedArticle) {
    return (
      <NewsDetails
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-12">
          <NewsFeatured 
            article={featuredArticle} 
            onReadMore={() => setSelectedArticle(featuredArticle)}
          />
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj w aktualnościach..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                    ${selectedTag === tag
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  <Tag className="w-4 h-4 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      {regularArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.slice(0, visibleArticles).map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>

          {/* Load More Button */}
          {regularArticles.length > visibleArticles && (
            <div className="mt-12 text-center">
              <button 
                onClick={handleLoadMore}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Załaduj więcej
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Nie znaleziono aktualności spełniających kryteria wyszukiwania.
          </p>
        </div>
      )}
    </div>
  );
}