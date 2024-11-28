import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Clock, Users } from 'lucide-react';
import type { NewsArticle } from '../../types/news';
import { NEWS_CATEGORY_LABELS } from '../../types/news';

interface NewsStatsProps {
  articles: NewsArticle[];
}

const COLORS = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B'];

export default function NewsStats({ articles }: NewsStatsProps) {
  const categoryCounts = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(NEWS_CATEGORY_LABELS).map(([category, label]) => ({
    name: label,
    count: categoryCounts[category] || 0
  }));

  const monthlyStats = articles.reduce((acc, article) => {
    const month = new Date(article.publishedAt).toLocaleString('pl-PL', { month: 'long' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(monthlyStats).map(([month, count]) => ({
    month,
    count
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Wszystkie aktualności</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{articles.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Ostatni miesiąc</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {articles.filter(article => {
              const month = new Date().getMonth();
              const articleMonth = new Date(article.publishedAt).getMonth();
              return month === articleMonth;
            }).length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Autorzy</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {new Set(articles.map(article => article.author.id)).size}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Aktualności według kategorii</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Aktualności w czasie</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}