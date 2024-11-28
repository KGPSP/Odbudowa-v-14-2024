import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Clock, PieChart as PieChartIcon } from 'lucide-react';
import type { Claim } from '../../types/claim';

interface StatisticsPanelProps {
  claims: Claim[];
}

const COLORS = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B'];

export default function StatisticsPanel({ claims }: StatisticsPanelProps) {
  // Calculate statistics
  const statusCounts = claims.reduce((acc, claim) => {
    acc[claim.status] = (acc[claim.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levelCounts = claims.reduce((acc, claim) => {
    acc[claim.currentLevel] = (acc[claim.currentLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate average processing time for each level
  const processingTimes = claims.reduce((acc, claim) => {
    claim.history.forEach((entry, index) => {
      if (index === 0) return;
      
      const prevEntry = claim.history[index - 1];
      const timeDiff = new Date(entry.updatedAt).getTime() - new Date(prevEntry.updatedAt).getTime();
      const days = timeDiff / (1000 * 60 * 60 * 24);
      
      acc[entry.level] = acc[entry.level] || { total: 0, count: 0 };
      acc[entry.level].total += days;
      acc[entry.level].count += 1;
    });
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const averageProcessingTimes = Object.entries(processingTimes).map(([level, data]) => ({
    level: level === 'voivodeship' ? 'Wojewódzki' : 
           level === 'mswia' ? 'MSWiA' : 
           level === 'kprm' ? 'KPRM' : level,
    days: Math.round(data.total / data.count)
  }));

  const statusData = [
    { name: 'Złożone', value: statusCounts.submitted || 0 },
    { name: 'Zaakceptowane', value: statusCounts.approved || 0 },
    { name: 'Odrzucone', value: statusCounts.rejected || 0 },
    { name: 'W trakcie', value: Object.entries(statusCounts)
      .filter(([status]) => !['submitted', 'approved', 'rejected'].includes(status))
      .reduce((sum, [, count]) => sum + count, 0)
    }
  ];

  const levelData = [
    { name: 'Wojewódzki', count: levelCounts.voivodeship || 0 },
    { name: 'MSWiA', count: levelCounts.mswia || 0 },
    { name: 'KPRM', count: levelCounts.kprm || 0 },
    { name: 'Zakończone', count: levelCounts.completed || 0 }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Status wniosków</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Wnioski na poziomach</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Średni czas procedowania (dni)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={averageProcessingTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="days" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Szczegółowe statystyki</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-600 mb-1">Wszystkie wnioski</p>
            <p className="text-2xl font-semibold text-indigo-900">{claims.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Zaakceptowane</p>
            <p className="text-2xl font-semibold text-green-900">{statusCounts.approved || 0}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 mb-1">Odrzucone</p>
            <p className="text-2xl font-semibold text-red-900">{statusCounts.rejected || 0}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-600 mb-1">W trakcie</p>
            <p className="text-2xl font-semibold text-yellow-900">
              {claims.length - (statusCounts.approved || 0) - (statusCounts.rejected || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}