import React from 'react';
import { ArrowLeft, Calendar, Tag, Download, Eye, EyeOff } from 'lucide-react';
import type { NewsArticle } from '../../types/news';
import { NEWS_CATEGORY_LABELS, NEWS_VISIBILITY_LABELS } from '../../types/news';

interface NewsDetailsProps {
  article: NewsArticle;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function NewsDetails({ article, onBack, onEdit, onDelete }: NewsDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (attachment: NewsArticle['attachments'][0]) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót
        </button>
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 text-indigo-600 hover:text-indigo-700"
              >
                Edytuj
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 text-red-600 hover:text-red-700"
              >
                Usuń
              </button>
            )}
          </div>
        )}
      </div>

      <article className="p-6">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${article.category === 'alert' ? 'bg-red-100 text-red-800' :
                article.category === 'update' ? 'bg-blue-100 text-blue-800' :
                article.category === 'event' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'}`}>
              {NEWS_CATEGORY_LABELS[article.category]}
            </span>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
              ${article.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {article.visibility === 'public' ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              {NEWS_VISIBILITY_LABELS[article.visibility]}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Autor: {article.author.name}</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Opublikowano: {formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </header>

        {article.coverImage && (
          <div className="mb-8">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose max-w-none mb-8">
          <div className="text-lg text-gray-600 mb-8 font-medium">
            {article.excerpt}
          </div>
          
          <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {article.attachments && article.attachments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Załączniki</h3>
            <div className="grid gap-4">
              {article.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(attachment)}
                    className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Pobierz
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-8">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}