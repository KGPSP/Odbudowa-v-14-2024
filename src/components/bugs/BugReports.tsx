import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Clock, CheckCircle } from 'lucide-react';
import type { BugReport } from '../../types/bug';
import { BUG_CATEGORY_LABELS, BUG_PRIORITY_LABELS, BUG_STATUS_LABELS } from '../../types/bug';

interface BugReportsProps {
  bugs: BugReport[];
}

const COLORS = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B'];

export default function BugReports({ bugs }: BugReportsProps) {
  // Calculate statistics
  const statusCounts = bugs.reduce((acc, bug) => {
    acc[bug.status] = (acc[bug.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(BUG_CATEGORY_LABELS).map(([category, label]) => ({
    name: label,
    count: bugs.filter(bug => bug.category === category).length
  }));

  const priorityData = Object.entries(BUG_PRIORITY_LABELS).map(([priority, label]) => ({
    name: label,
    count: bugs.filter(bug => bug.priority === priority).length
  }));

  // Calculate average resolution time
  const resolvedBugs = bugs.filter(bug => bug.status === 'resolved' || bug.status === 'closed');
  const avgResolutionTime = resolvedBugs.length > 0
    ? resolvedBugs.reduce((sum, bug) => {
        const created = new Date(bug.createdAt);
        const resolved = new Date(bug.updatedAt);
        return sum + (resolved.getTime() - created.getTime());
      }, 0) / resolvedBugs.length / (1000 * 60 * 60 * 24) // Convert to days
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Status zgłoszeń</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(BUG_STATUS_LABELS).map(([status, label]) => ({
                    name: label,
                    value: statusCounts[status] || 0
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.keys(BUG_STATUS_LABELS).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Zgłoszenia wg kategorii</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Zgłoszenia wg priorytetu</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Podsumowanie</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-600 mb-1">Wszystkie zgłoszenia</p>
            <p className="text-2xl font-semibold text-indigo-900">{bugs.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Rozwiązane</p>
            <p className="text-2xl font-semibold text-green-900">
              {bugs.filter(bug => bug.status === 'resolved' || bug.status === 'closed').length}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-600 mb-1">W trakcie</p>
            <p className="text-2xl font-semibold text-yellow-900">
              {bugs.filter(bug => bug.status === 'in_progress').length}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Średni czas rozwiązania</p>
            <p className="text-2xl font-semibold text-blue-900">
              {avgResolutionTime.toFixed(1)} dni
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}