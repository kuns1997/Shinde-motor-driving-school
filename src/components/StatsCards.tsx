import React from 'react';
import { 
  Users, 
  UserCheck, 
  IndianRupee, 
  ShieldCheck, 
  Clock, 
  Moon, 
  Calendar,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { DashboardStats } from '../types';
import { formatINR } from '../utils/formatters';

interface StatsCardsProps {
  stats: DashboardStats;
  selectedYear: string;
  onFilterDuration: (duration: string) => void;
  onFilterGender: (gender: string) => void;
  onFilterInsurance: (status: string) => void;
  onFilterPayment: (status: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  selectedYear,
  onFilterDuration,
  onFilterGender,
  onFilterInsurance,
  onFilterPayment
}) => {
  const malePercent = stats.totalCustomers > 0 ? Math.round((stats.maleCount / stats.totalCustomers) * 100) : 0;
  const femalePercent = stats.totalCustomers > 0 ? Math.round((stats.femaleCount / stats.totalCustomers) * 100) : 0;
  
  const paidPercent = stats.totalRevenue > 0 ? Math.round((stats.totalPaid / stats.totalRevenue) * 100) : 0;
  const insurancePercent = stats.totalCustomers > 0 ? Math.round((stats.insuranceDoneCount / stats.totalCustomers) * 100) : 0;

  return (
    <div id="dashboard-metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Customers & Gender Split */}
      <div 
        id="card-total-customers"
        className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Admissions {selectedYear !== 'all' ? `(${selectedYear})` : ''}
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalCustomers}
            </span>
            <span className="text-xs text-slate-500 font-medium">Students enrolled</span>
          </div>

          {/* Male / Female distribution pills */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <button 
                onClick={() => onFilterGender('Male')} 
                className="flex items-center gap-1.5 text-slate-700 hover:text-blue-700 font-medium transition-colors cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span>Male: <strong>{stats.maleCount}</strong></span>
              </button>
              <button 
                onClick={() => onFilterGender('Female')} 
                className="flex items-center gap-1.5 text-slate-700 hover:text-pink-700 font-medium transition-colors cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span>
                <span>Female: <strong>{stats.femaleCount}</strong></span>
              </button>
            </div>
            
            {/* Visual ratio bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${malePercent}%` }} 
                title={`Male: ${stats.maleCount} (${malePercent}%)`}
              />
              <div 
                className="h-full bg-pink-500 transition-all duration-500" 
                style={{ width: `${femalePercent}%` }} 
                title={`Female: ${stats.femaleCount} (${femalePercent}%)`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Fee Collection Status (Paid vs Remaining) */}
      <div 
        id="card-fees-summary"
        className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fee Collection Overview
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-500 block font-medium">Total Fees</span>
              <span className="text-xl font-bold text-slate-900">{formatINR(stats.totalRevenue)}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-600 font-semibold">{paidPercent}% Collected</span>
            </div>
          </div>

          {/* Paid vs Remaining breakdown */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <button 
                onClick={() => onFilterPayment('paid')}
                className="text-emerald-700 hover:underline font-semibold cursor-pointer"
              >
                Paid: {formatINR(stats.totalPaid)}
              </button>
              <button 
                onClick={() => onFilterPayment('partial')}
                className="text-amber-700 hover:underline font-semibold cursor-pointer"
              >
                Remaining: {formatINR(stats.totalRemaining)}
              </button>
            </div>
            <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${paidPercent}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Personal Accident Insurance Status */}
      <div 
        id="card-insurance-status"
        className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Accident Insurance Status
            </span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stats.insurancePendingCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.insuranceDoneCount}
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {insurancePercent}% Done
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => onFilterInsurance('Done')}
              className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Done: <strong>{stats.insuranceDoneCount}</strong></span>
            </button>
            <button
              onClick={() => onFilterInsurance('Not Done')}
              className="inline-flex items-center gap-1 text-rose-700 font-semibold hover:underline cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Not Done: <strong>{stats.insurancePendingCount}</strong></span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Course Duration Breakdown */}
      <div 
        id="card-course-durations"
        className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Course Durations
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <button 
              onClick={() => onFilterDuration('25 Days')}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-900 transition-colors cursor-pointer"
            >
              <span className="font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                25 Days Regular
              </span>
              <span className="font-bold bg-white px-2 py-0.5 rounded text-indigo-700 shadow-2xs">
                {stats.course25DaysCount}
              </span>
            </button>

            <button 
              onClick={() => onFilterDuration('20 Days')}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-sky-50/60 hover:bg-sky-100/70 text-sky-900 transition-colors cursor-pointer"
            >
              <span className="font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                20 Days Fast Track
              </span>
              <span className="font-bold bg-white px-2 py-0.5 rounded text-sky-700 shadow-2xs">
                {stats.course20DaysCount}
              </span>
            </button>

            <button 
              onClick={() => onFilterDuration('5-Day Night Shift')}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 transition-colors cursor-pointer"
            >
              <span className="font-medium flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-600" />
                5-Day Night Shift
              </span>
              <span className="font-bold bg-white px-2 py-0.5 rounded text-amber-800 shadow-2xs">
                {stats.course5DaysNightCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
