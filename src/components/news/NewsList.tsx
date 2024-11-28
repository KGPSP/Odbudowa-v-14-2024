import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import type { NewsArticle, NewsCategory } from '../../types/news';
import { NEWS_CATEGORY_LABELS } from '../../types/news';
import NewsCard from './NewsCard';

interface NewsListProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export default function NewsList({ articles, onSelectArticle }: NewsListProps) {
  const [filters, setFilters] = useState({
    search: '',
    category: '' as NewsCategory | '',
    sortBy: 'date' as 'date' | 'title',
    sortDirection: 'desc' as 'asc' | 'desc'
  });

  const filteredArticles = articles
    .filter(article => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          article.title.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower)
        );
      }
      if (filters.category) {
        return article.category === filters.category;
      }
      return true;
    })
    .sort((a, b) => {
      const factor = filters.sortDirection === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') {
        return factor * (new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
      return factor * a.title.localeCompare(b.title);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Szukaj w aktualnościach..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as NewsCategory }))}
            className="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Wszystkie kategorie</option>
            {Object.entries(NEWS_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <button
            onClick={() => setFilters(prev => ({
              ...prev,
              sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
            }))}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {filters.sortDirection === 'asc' ? (
              <SortAsc className="w-5 h-5 text-gray-500" />
            ) : (
              <SortDesc className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onClick={() => onSelectArticle(article)}
          />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nie znaleziono aktualności spełniających kryteria wyszukiwania.</p>
        </div>
      )}
    </div>
  );
}