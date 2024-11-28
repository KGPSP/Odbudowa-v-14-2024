import React from 'react';
import { Filter, Calendar, Tag } from 'lucide-react';
import type { NewsCategory } from '../../types/news';
import { NEWS_CATEGORY_LABELS } from '../../types/news';

interface NewsFilterProps {
  onFilterChange: (filters: {
    category?: NewsCategory;
    dateFrom?: Date;
    dateTo?: Date;
    tags?: string[];
  }) => void;
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export default function NewsFilter({
  onFilterChange,
  availableTags,
  selectedTags,
  onTagSelect
}: NewsFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-900">Filtry</h3>
      </div>

      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategoria
          </label>
          <select
            onChange={(e) => onFilterChange({ category: e.target.value as NewsCategory })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Wszystkie kategorie</option>
            {Object.entries(NEWS_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline-block mr-1" />
            Zakres dat
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              onChange={(e) => onFilterChange({ dateFrom: new Date(e.target.value) })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="date"
              onChange={(e) => onFilterChange({ dateTo: new Date(e.target.value) })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline-block mr-1" />
              Tagi
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => onTagSelect(tag)}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${selectedTags.includes(tag)
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}