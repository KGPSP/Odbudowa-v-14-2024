import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import type { NewsArticle } from '../../types/news';
import { NEWS_CATEGORY_LABELS } from '../../types/news';

interface NewsFeaturedProps {
  article: NewsArticle;
  onReadMore: () => void;
}

export default function NewsFeatured({ article, onReadMore }: NewsFeaturedProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="absolute inset-0">
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:py-24">
        <div className="flex flex-col items-center text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4
            ${article.category === 'alert' ? 'bg-red-100 text-red-800' :
              article.category === 'update' ? 'bg-blue-100 text-blue-800' :
              article.category === 'event' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'}`}>
            {NEWS_CATEGORY_LABELS[article.category]}
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            {article.excerpt}
          </p>

          <div className="mt-8 flex items-center justify-center gap-x-6">
            <button
              onClick={onReadMore}
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white inline-flex items-center gap-2"
            >
              Czytaj więcej
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center text-sm text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(article.publishedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}