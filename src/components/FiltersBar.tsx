import React from 'react';
import { Search, X, Filter, Clock, Moon, ShieldCheck, IndianRupee, Users } from 'lucide-react';
import { FilterState } from '../types';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
  totalAllCount: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  totalFilteredCount,
  totalAllCount
}) => {
  return (
    <div id="filters-container" className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3.5">
      {/* Top Search & Reset Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-input"
            type="text"
            placeholder="Search by customer name, phone number, admission ID..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 placeholder:text-slate-400 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{totalFilteredCount}</strong> of {totalAllCount} records
          </span>
          {activeFilterCount > 0 && (
            <button
              id="btn-reset-filters"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills Groups */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs">
        
        {/* Course Duration Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Course:
          </span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            {(['all', '25 Days', '20 Days', '5-Day Night Shift'] as const).map((duration) => {
              const isActive = filters.courseDuration === duration;
              return (
                <button
                  key={duration}
                  onClick={() => onFilterChange('courseDuration', duration)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {duration === 'all' ? 'All Durations' : duration}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Gender:
          </span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            {(['all', 'Male', 'Female'] as const).map((gender) => {
              const isActive = filters.gender === gender;
              return (
                <button
                  key={gender}
                  onClick={() => onFilterChange('gender', gender)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {gender === 'all' ? 'All' : gender}
                </button>
              );
            })}
          </div>
        </div>

        {/* Insurance Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Insurance:
          </span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            {(['all', 'Done', 'Not Done'] as const).map((status) => {
              const isActive = filters.insuranceStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => onFilterChange('insuranceStatus', status)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    isActive
                      ? status === 'Done'
                        ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                        : status === 'Not Done'
                        ? 'bg-rose-600 text-white font-bold shadow-2xs'
                        : 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fee Payment Status */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
            Fee Status:
          </span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            {[
              { key: 'all', label: 'All' },
              { key: 'paid', label: 'Fully Paid' },
              { key: 'partial', label: 'Balance Due' }
            ].map(({ key, label }) => {
              const isActive = filters.paymentStatus === key;
              return (
                <button
                  key={key}
                  onClick={() => onFilterChange('paymentStatus', key)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-amber-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
