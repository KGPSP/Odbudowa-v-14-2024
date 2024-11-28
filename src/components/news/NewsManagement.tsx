import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { NewsArticle, NewsFormData } from '../../types/news';
import NewsList from './NewsList';
import NewsForm from './NewsForm';
import NewsDetails from './NewsDetails';
import NewsStats from './NewsStats';
import { v4 as uuidv4 } from 'uuid';

const NEWS_STORAGE_KEY = 'news_articles';

export default function NewsManagement() {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    // Initialize state from localStorage
    const savedArticles = localStorage.getItem(NEWS_STORAGE_KEY);
    return savedArticles ? JSON.parse(savedArticles) : [];
  });
  
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Save to localStorage whenever articles change
  useEffect(() => {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const handleCreateArticle = async (data: NewsFormData) => {
    try {
      // Process attachments
      const processedAttachments = await Promise.all((data.attachments || []).map(async file => {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        return {
          id: uuidv4(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: base64,
          uploadedAt: new Date().toISOString()
        };
      }));

      const newArticle: NewsArticle = {
        id: uuidv4(),
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        status: data.status,
        visibility: data.visibility,
        author: {
          id: '1',
          name: 'Admin',
          email: 'admin@example.com'
        },
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        coverImage: data.coverImage,
        tags: data.tags,
        attachments: processedAttachments
      };

      // Update state with new article
      const updatedArticles = [newArticle, ...articles];
      setArticles(updatedArticles);
      
      // Explicitly save to localStorage
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedArticles));
      
      setShowForm(false);
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Wystąpił błąd podczas tworzenia artykułu');
    }
  };

  const handleUpdateArticle = async (data: NewsFormData) => {
    if (!editingArticle) return;

    try {
      // Process new attachments
      const processedAttachments = await Promise.all((data.attachments || []).map(async file => {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        return {
          id: uuidv4(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: base64,
          uploadedAt: new Date().toISOString()
        };
      }));

      const updatedArticle: NewsArticle = {
        ...editingArticle,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        status: data.status,
        visibility: data.visibility,
        updatedAt: new Date().toISOString(),
        coverImage: data.coverImage || editingArticle.coverImage,
        tags: data.tags,
        attachments: [
          ...(editingArticle.attachments || []),
          ...processedAttachments
        ]
      };

      // Update state with modified article
      const updatedArticles = articles.map(article => 
        article.id === editingArticle.id ? updatedArticle : article
      );
      setArticles(updatedArticles);
      
      // Explicitly save to localStorage
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedArticles));
      
      setShowForm(false);
      setEditingArticle(null);
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Wystąpił błąd podczas aktualizacji artykułu');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę aktualność?')) {
      try {
        // Update state without deleted article
        const updatedArticles = articles.filter(article => article.id !== id);
        setArticles(updatedArticles);
        
        // Explicitly save to localStorage
        localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedArticles));
        
        setSelectedArticle(null);
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Wystąpił błąd podczas usuwania artykułu');
      }
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setShowForm(true);
    setSelectedArticle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Zarządzanie aktualnościami</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-5 h-5" />
          Nowa aktualność
        </button>
      </div>

      {showForm ? (
        <NewsForm
          onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle}
          initialData={editingArticle || undefined}
          onCancel={() => {
            setShowForm(false);
            setEditingArticle(null);
          }}
        />
      ) : selectedArticle ? (
        <NewsDetails
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
          onEdit={() => handleEdit(selectedArticle)}
          onDelete={() => handleDeleteArticle(selectedArticle.id)}
        />
      ) : (
        <>
          <NewsList
            articles={articles}
            onSelectArticle={setSelectedArticle}
          />
          {articles.length > 0 && (
            <div className="mt-12">
              <NewsStats articles={articles} />
            </div>
          )}
        </>
      )}
    </div>
  );
}