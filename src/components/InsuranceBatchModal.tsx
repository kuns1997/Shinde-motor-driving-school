import React, { useState } from 'react';
import { Customer } from '../types';
import { ShieldCheck, AlertCircle, Check, X, Search, Sparkles } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface InsuranceBatchModalProps {
  customers: Customer[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateInsurance: (customerIds: string[], status: 'Done' | 'Not Done') => void;
}

export const InsuranceBatchModal: React.FC<InsuranceBatchModalProps> = ({
  customers,
  isOpen,
  onClose,
  onUpdateInsurance
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'pending' | 'all' | 'done'>('pending');

  const pendingCount = customers.filter(c => c.insuranceStatus === 'Not Done').length;
  const doneCount = customers.filter(c => c.insuranceStatus === 'Done').length;

  const filtered = customers.filter(c => {
    if (filterType === 'pending' && c.insuranceStatus !== 'Not Done') return false;
    if (filterType === 'done' && c.insuranceStatus !== 'Done') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.admissionNo.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return true;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filtered.map(c => c.id);
    if (selectedIds.length === visibleIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleIds);
    }
  };

  const handleApplyBatchDone = () => {
    if (selectedIds.length === 0) return;
    onUpdateInsurance(selectedIds, 'Done');
    setSelectedIds([]);
  };

  const handleApplyBatchPending = () => {
    if (selectedIds.length === 0) return;
    onUpdateInsurance(selectedIds, 'Not Done');
    setSelectedIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Personal Accident Insurance Compliance Desk
              </h3>
              <p className="text-xs text-emerald-200">
                Ensure 100% RTO & Safety insurance coverage for all students
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Actions Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg">
              <button
                onClick={() => setFilterType('pending')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterType === 'pending'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Needs Insurance ({pendingCount})
              </button>
              <button
                onClick={() => setFilterType('done')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterType === 'done'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Already Covered ({doneCount})
              </button>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Students ({customers.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Batch action buttons */}
          {selectedIds.length > 0 && (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">
                {selectedIds.length} students selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApplyBatchDone}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  ✓ Mark Selected as "Done"
                </button>
                <button
                  onClick={handleApplyBatchPending}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  ✕ Mark Selected as "Not Done"
                </button>
              </div>
            </div>
          )}
        </div>

        {/* List of Customers */}
        <div className="p-4 overflow-y-auto max-h-96 divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between pb-2 text-slate-500 font-semibold">
            <button
              onClick={handleSelectAllVisible}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              {selectedIds.length === filtered.length && filtered.length > 0 ? 'Deselect All' : 'Select All Visible'}
            </button>
            <span>Status</span>
          </div>

          {filtered.map((c) => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <div
                key={c.id}
                className={`py-2.5 px-2 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  isSelected ? 'bg-emerald-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(c.id)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({c.admissionNo})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {c.courseDuration} • Batch {c.year} • Assigned: {c.assignedStaff}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                    c.insuranceStatus === 'Done'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {c.insuranceStatus}
                  </span>
                  <button
                    onClick={() => onUpdateInsurance([c.id], c.insuranceStatus === 'Done' ? 'Not Done' : 'Done')}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                    title="Toggle"
                  >
                    Switch
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Personal Accident Insurance policy protects students during practical road lessons.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
