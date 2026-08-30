import React from 'react';
import { Customer } from '../types';
import { formatINR } from '../utils/formatters';
import { Clock, Moon, Car, Bike, Truck, Sparkles } from 'lucide-react';

interface CategoryDurationSummaryProps {
  customers: Customer[];
  onFilterDuration: (duration: string) => void;
}

export const CategoryDurationSummary: React.FC<CategoryDurationSummaryProps> = ({
  customers,
  onFilterDuration
}) => {
  const durations = [
    {
      id: '25 Days',
      title: '25 Days Regular Course',
      badge: 'Comprehensive',
      icon: Clock,
      color: 'indigo'
    },
    {
      id: '20 Days',
      title: '20 Days Fast Track',
      badge: 'Accelerated',
      icon: Clock,
      color: 'sky'
    },
    {
      id: '5-Day Night Shift',
      title: '5-Day Night Shift Special',
      badge: 'Night Traffic & Highway',
      icon: Moon,
      color: 'amber'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Course Package Categories & Performance Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Analysis across 25 Days Regular, 20 Days Fast Track, and 5-Day Night Shift Special batches
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {durations.map((d) => {
          const subset = customers.filter(c => c.courseDuration === d.id);
          const total = subset.length;
          const males = subset.filter(c => c.gender === 'Male').length;
          const females = subset.filter(c => c.gender === 'Female').length;
          const totalRevenue = subset.reduce((acc, c) => acc + c.totalFee, 0);
          const totalPaid = subset.reduce((acc, c) => acc + c.paidFee, 0);
          const totalRemaining = subset.reduce((acc, c) => acc + c.remainingFee, 0);
          const insuranceDone = subset.filter(c => c.insuranceStatus === 'Done').length;
          const Icon = d.icon;

          return (
            <div
              key={d.id}
              onClick={() => onFilterDuration(d.id)}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      d.id === '5-Day Night Shift' 
                        ? 'bg-amber-100 text-amber-800' 
                        : d.id === '25 Days' 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{d.title}</h4>
                      <span className="text-[10px] text-slate-500">{d.badge}</span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800 shadow-2xs">
                    {total} Enrolled
                  </span>
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200/80">
                  <div className="flex justify-between text-slate-600">
                    <span>Gender Ratio:</span>
                    <span className="font-semibold text-slate-900">{males} Male / {females} Female</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Total Fee Volume:</span>
                    <span className="font-semibold text-slate-900">{formatINR(totalRevenue)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Fee Collected:</span>
                    <span className="font-semibold text-emerald-700">{formatINR(totalPaid)}</span>
                  </div>

                  {totalRemaining > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>Pending Due:</span>
                      <span>{formatINR(totalRemaining)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Insurance Covered:</span>
                    <span className="font-semibold text-slate-900">
                      {insuranceDone} of {total} ({total > 0 ? Math.round((insuranceDone / total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[11px] text-indigo-600 font-semibold flex items-center justify-between border-t border-slate-200/60">
                <span>Filter this course</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
