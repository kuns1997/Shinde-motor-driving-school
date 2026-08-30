import React from 'react';
import { Customer, StaffMember } from '../types';
import { STAFF_INFO } from '../data/initialData';
import { Calendar, UserCheck, Shield, Phone, Sparkles, Filter } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface YearTabsAndStaffProps {
  selectedYear: string;
  onSelectYear: (year: string) => void;
  selectedStaff: string;
  onSelectStaff: (staff: string) => void;
  customers: Customer[];
}

export const YearTabsAndStaff: React.FC<YearTabsAndStaffProps> = ({
  selectedYear,
  onSelectYear,
  selectedStaff,
  onSelectStaff,
  customers
}) => {
  const years = ['all', '2026', '2025', '2024'];

  const getYearMetrics = (yr: string) => {
    const subset = yr === 'all' ? customers : customers.filter(c => c.year.toString() === yr);
    const total = subset.length;
    const males = subset.filter(c => c.gender === 'Male').length;
    const females = subset.filter(c => c.gender === 'Female').length;
    const paid = subset.reduce((acc, c) => acc + c.paidFee, 0);
    const remaining = subset.reduce((acc, c) => acc + c.remainingFee, 0);
    const insuranceDone = subset.filter(c => c.insuranceStatus === 'Done').length;
    return { total, males, females, paid, remaining, insuranceDone };
  };

  return (
    <div className="space-y-4">
      {/* 1. Year-wise Categories Row */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Year-wise Batches & Summaries
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click any year tab to filter customer ledger & analytics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {years.map((yr) => {
            const m = getYearMetrics(yr);
            const isSelected = selectedYear === yr;
            const label = yr === 'all' ? 'All Years (Overview)' : `Batch Year ${yr}`;

            return (
              <button
                key={yr}
                id={`tab-year-${yr}`}
                onClick={() => onSelectYear(yr)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-amber-950 ring-1 ring-amber-500 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold ${isSelected ? 'text-amber-800' : 'text-slate-800'}`}>
                    {label}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {m.total}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-0.5 mt-1 border-t border-slate-200/60 pt-1.5">
                  <div className="flex justify-between">
                    <span>M / F split:</span>
                    <span className="font-semibold text-slate-700">{m.males}M / {m.females}F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid / Due:</span>
                    <span className="font-semibold text-emerald-700">
                      {formatINR(m.paid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance Done:</span>
                    <span className="font-semibold text-slate-700">{m.insuranceDone}/{m.total}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Management & Instructor Staff Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Driving School Leadership & Training Staff
            </h3>
          </div>
          {selectedStaff !== 'all' && (
            <button
              onClick={() => onSelectStaff('all')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Filter className="w-3 h-3" /> Clear Staff Filter ({selectedStaff})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STAFF_INFO.map((staff) => {
            const assignedCount = customers.filter(c => c.assignedStaff === staff.name).length;
            const isSelected = selectedStaff === staff.name;

            return (
              <div
                key={staff.name}
                id={`staff-card-${staff.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectStaff(isSelected ? 'all' : staff.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/30 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                      staff.badge === 'Owner' ? 'bg-amber-600' : staff.name === 'Karan Shinde' ? 'bg-indigo-600' : 'bg-emerald-600'
                    }`}>
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900">{staff.name}</h4>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          staff.badge === 'Owner'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                        }`}>
                          {staff.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">{staff.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs block">
                      {assignedCount} Students
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 flex items-center justify-between">
                  <span className="truncate max-w-[200px]" title={staff.speciality}>
                    {staff.speciality}
                  </span>
                  <span className="font-mono text-slate-500 shrink-0">{staff.phone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
