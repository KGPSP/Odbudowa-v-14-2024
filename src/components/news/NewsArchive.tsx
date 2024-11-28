import React, { useState } from 'react';
import { Archive, Calendar } from 'lucide-react';
import type { NewsArticle } from '../../types/news';

interface NewsArchiveProps {
  articles: NewsArticle[];
}

export default function NewsArchive({ articles }: NewsArchiveProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Group articles by year and month
  const archiveGroups = articles.reduce((acc, article) => {
    const date = new Date(article.publishedAt);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    acc[year][month].push(article);
    return acc;
  }, {} as Record<number, Record<number, NewsArticle[]>>);

  // Sort years in descending order
  const years = Object.keys(archiveGroups)
    .map(Number)
    .sort((a, b) => b - a);

  const getMonthName = (month: number) => {
    return new Date(2000, month).toLocaleString('pl-PL', { month: 'long' });
  };

  const filteredArticles = articles.filter(article => {
    const date = new Date(article.publishedAt);
    if (selectedYear && date.getFullYear() !== selectedYear) return false;
    if (selectedMonth !== null && date.getMonth() !== selectedMonth) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Archive className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900">Archiwum</h2>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Archive Navigation */}
          <div className="space-y-4">
            {years.map(year => (
              <div key={year}>
                <button
                  onClick={() => {
                    setSelectedYear(selectedYear === year ? null : year);
                    setSelectedMonth(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium
                    ${selectedYear === year
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {year}
                </button>

                {selectedYear === year && (
                  <div className="ml-4 mt-2 space-y-1">
                    {Object.keys(archiveGroups[year])
                      .map(Number)
                      .sort((a, b) => b - a)
                      .map(month => (
                        <button
                          key={month}
                          onClick={() => setSelectedMonth(selectedMonth === month ? null : month)}
                          className={`w-full text-left px-3 py-1 rounded-md text-sm
                            ${selectedMonth === month
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          {getMonthName(month)}
                          <span className="text-gray-400 ml-1">
                            ({archiveGroups[year][month].length})
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Articles List */}
          <div className="md:col-span-3">
            {filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map(article => (
                  <article key={article.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.publishedAt).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <p className="text-gray-600">{article.excerpt}</p>
                    <button className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      Czytaj więcej
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Brak artykułów w wybranym okresie.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}