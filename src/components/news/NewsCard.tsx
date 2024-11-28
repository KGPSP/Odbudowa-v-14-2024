import React from 'react';
import { Calendar, Tag, User } from 'lucide-react';
import type { NewsArticle } from '../../types/news';
import { NEWS_CATEGORY_LABELS } from '../../types/news';

interface NewsCardProps {
  article: NewsArticle;
  onClick?: () => void;
}

export default function NewsCard({ article, onClick }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      {article.coverImage && (
        <div className="relative h-48">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium
              ${article.category === 'alert' ? 'bg-red-100 text-red-800' :
                article.category === 'update' ? 'bg-blue-100 text-blue-800' :
                article.category === 'event' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'}`}>
              {NEWS_CATEGORY_LABELS[article.category]}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}