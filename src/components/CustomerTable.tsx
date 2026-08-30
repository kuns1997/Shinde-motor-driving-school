import React from 'react';
import { Customer } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  Clock, 
  Moon, 
  CreditCard,
  CheckCircle2,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onToggleInsurance: (customer: Customer) => void;
  onQuickCollectFee: (customer: Customer) => void;
  onIncrementAttendance: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onToggleInsurance,
  onQuickCollectFee,
  onIncrementAttendance
}) => {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800 mb-1">No customers match your criteria</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try adjusting your search keywords, year, duration, gender, or insurance filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Student & Admission</th>
              <th className="py-3.5 px-4">Course & Duration</th>
              <th className="py-3.5 px-4">Assigned Staff</th>
              <th className="py-3.5 px-4">Fees Summary</th>
              <th className="py-3.5 px-4 text-center">Accident Insurance</th>
              <th className="py-3.5 px-4">Days Progress</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => {
              const isFullPaid = c.remainingFee <= 0;
              const isNightShift = c.courseDuration === '5-Day Night Shift';
              const progressPercent = Math.min(100, Math.round((c.completedDays / c.totalDays) * 100));

              return (
                <tr 
                  key={c.id} 
                  id={`customer-row-${c.id}`}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Student & Admission */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        c.gender === 'Female' 
                          ? 'bg-pink-100 text-pink-700 border border-pink-200' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onViewCustomer(c)}
                            className="font-bold text-slate-900 hover:text-amber-600 text-sm transition-colors text-left cursor-pointer"
                          >
                            {c.name}
                          </button>
                          <span className={`text-[10px] px-1.5 py-0.2 font-semibold rounded ${
                            c.gender === 'Female' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {c.gender}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                          <span>{c.admissionNo}</span>
                          <span>•</span>
                          <a href={`tel:${c.phone}`} className="hover:text-slate-800 inline-flex items-center gap-0.5">
                            <Phone className="w-3 h-3" /> {c.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Course & Duration */}
                  <td className="py-3.5 px-4">
                    <div>
                      {/* Duration Tag */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        c.courseDuration === '25 Days'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/70'
                          : c.courseDuration === '20 Days'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200/70'
                          : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {isNightShift ? <Moon className="w-3 h-3 text-amber-600" /> : <Clock className="w-3 h-3" />}
                        {c.courseDuration}
                      </span>
                      <div className="text-[11px] text-slate-600 font-medium mt-1">
                        {c.courseType}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Batch {c.year} • {c.slotTiming}
                      </div>
                    </div>
                  </td>

                  {/* Assigned Staff */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        c.assignedStaff === 'Anil Shinde' 
                          ? 'bg-amber-500' 
                          : c.assignedStaff === 'Karan Shinde' 
                          ? 'bg-indigo-500' 
                          : 'bg-emerald-500'
                      }`} />
                      <div>
                        <span className="font-semibold text-slate-800 block text-xs">
                          {c.assignedStaff}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {c.assignedStaff === 'Anil Shinde' ? 'Owner / Chief Trainer' : 'Instructor'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Fees Summary */}
                  <td className="py-3.5 px-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-800">
                          {formatINR(c.paidFee)} <span className="text-slate-400 font-normal">/ {formatINR(c.totalFee)}</span>
                        </span>
                      </div>

                      {isFullPaid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                          <CheckCircle2 className="w-3 h-3" /> Fully Paid
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            Due: {formatINR(c.remainingFee)}
                          </span>
                          <button
                            id={`btn-collect-fee-${c.id}`}
                            onClick={() => onQuickCollectFee(c)}
                            className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer shadow-2xs"
                            title="Collect balance payment"
                          >
                            Collect
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Personal Accident Insurance */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      id={`btn-toggle-insurance-${c.id}`}
                      onClick={() => onToggleInsurance(c)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                        c.insuranceStatus === 'Done'
                          ? 'bg-emerald-100/90 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300 animate-pulse'
                      }`}
                      title={`Click to change status (Currently: ${c.insuranceStatus})`}
                    >
                      {c.insuranceStatus === 'Done' ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                          <span>Not Done</span>
                        </>
                      )}
                    </button>
                    {c.insurancePolicyNo && c.insuranceStatus === 'Done' && (
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        {c.insurancePolicyNo}
                      </div>
                    )}
                  </td>

                  {/* Days Progress */}
                  <td className="py-3.5 px-4">
                    <div className="w-28">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                        <span>Day {c.completedDays} / {c.totalDays}</span>
                        {c.completedDays < c.totalDays && (
                          <button
                            onClick={() => onIncrementAttendance(c)}
                            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:bg-indigo-50 p-0.5 rounded cursor-pointer"
                            title="Mark attendance +1 day"
                          >
                            +1 Day
                          </button>
                        )}
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        id={`btn-view-${c.id}`}
                        onClick={() => onViewCustomer(c)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="View Full Profile & Admission Slip"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-edit-${c.id}`}
                        onClick={() => onEditCustomer(c)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                        title="Edit Customer Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-delete-${c.id}`}
                        onClick={() => onDeleteCustomer(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
