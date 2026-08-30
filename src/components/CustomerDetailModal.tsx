import React, { useRef } from 'react';
import { Customer } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { 
  X, 
  Printer, 
  Car, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Moon, 
  CreditCard, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  UserCheck, 
  Award,
  Plus
} from 'lucide-react';

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onQuickCollectFee: (customer: Customer) => void;
  onIncrementAttendance: (customer: Customer) => void;
  onToggleInsurance: (customer: Customer) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onQuickCollectFee,
  onIncrementAttendance,
  onToggleInsurance
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !customer) return null;

  const handlePrint = () => {
    window.print();
  };

  const isFullPaid = customer.remainingFee <= 0;
  const isNightShift = customer.courseDuration === '5-Day Night Shift';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-4">
        
        {/* Header with Print & Close */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {customer.name}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${
                  customer.gender === 'Female' ? 'bg-pink-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {customer.gender}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Admission No: {customer.admissionNo} • Batch Year {customer.year}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Top Quick Status Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Course Duration Card */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                {isNightShift ? <Moon className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">
                  Course Package
                </span>
                <span className="text-xs font-bold text-slate-900">{customer.courseDuration}</span>
                <span className="text-[11px] text-slate-600 block">{customer.courseType}</span>
              </div>
            </div>

            {/* Insurance Card */}
            <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
              customer.insuranceStatus === 'Done'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 ${
                  customer.insuranceStatus === 'Done' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    Accident Insurance
                  </span>
                  <span className="text-xs font-extrabold">
                    {customer.insuranceStatus === 'Done' ? 'Covered (Done)' : 'Not Done (Pending)'}
                  </span>
                  {customer.insurancePolicyNo && (
                    <span className="text-[10px] font-mono block opacity-80">{customer.insurancePolicyNo}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onToggleInsurance(customer)}
                className="text-[10px] px-2 py-1 bg-white hover:bg-slate-100 rounded border font-bold text-slate-800 shadow-2xs cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Assigned Staff */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold">
                {customer.assignedStaff.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                  Assigned Staff
                </span>
                <span className="text-xs font-bold text-slate-900">{customer.assignedStaff}</span>
                <span className="text-[11px] text-slate-600 block">
                  {customer.assignedStaff === 'Anil Shinde' ? 'Founder & Head Instructor' : 'Senior Instructor'}
                </span>
              </div>
            </div>
          </div>

          {/* Student Profile & Batch Info */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <UserCheck className="w-3.5 h-3.5 text-slate-700" />
              Customer Information & Schedule
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Phone Number:</span>
                <span className="font-semibold text-slate-900 font-mono">{customer.phone}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Email Address:</span>
                <span className="font-semibold text-slate-900">{customer.email || 'N/A'}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Registration Date:</span>
                <span className="font-semibold text-slate-900">{formatDate(customer.registrationDate)}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Training Slot:</span>
                <span className="font-semibold text-slate-900">{customer.slotTiming}</span>
              </div>
            </div>

            {customer.address && (
              <div className="pt-2 border-t border-slate-200/70 text-xs flex items-start gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{customer.address}</span>
              </div>
            )}
          </div>

          {/* Fee & Payment Ledger */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                Fee Payment Ledger
              </h4>
              {!isFullPaid && (
                <button
                  onClick={() => onQuickCollectFee(customer)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  + Collect Remaining Fee ({formatINR(customer.remainingFee)})
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-lg border border-slate-200 text-center">
              <div>
                <span className="text-slate-500 text-[11px] block">Total Agreed Fee</span>
                <span className="text-base font-extrabold text-slate-900">{formatINR(customer.totalFee)}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Total Amount Paid</span>
                <span className="text-base font-extrabold text-emerald-700">{formatINR(customer.paidFee)}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Remaining Due</span>
                <span className={`text-base font-extrabold ${customer.remainingFee > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                  {formatINR(customer.remainingFee)}
                </span>
              </div>
            </div>

            {/* Payment Transactions Table */}
            {customer.paymentHistory && customer.paymentHistory.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-600">Payment Receipts History:</span>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
                  {customer.paymentHistory.map((p, idx) => (
                    <div key={p.id || idx} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{formatINR(p.amount)}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="text-slate-600 font-mono">{p.mode}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="text-slate-500">Collected by {p.collectedBy}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 text-[11px]">{formatDate(p.date)}</span>
                        <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded ml-2">
                          {p.receiptNo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Attendance & Days Completed */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Training Attendance ({customer.completedDays} / {customer.totalDays} Days)
              </h4>
              {customer.completedDays < customer.totalDays && (
                <button
                  onClick={() => onIncrementAttendance(customer)}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded font-semibold text-xs transition-colors cursor-pointer"
                >
                  + Mark Today's Session
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {Array.from({ length: customer.totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const isDone = dayNum <= customer.completedDays;
                return (
                  <div
                    key={dayNum}
                    className={`py-1.5 text-center rounded text-[11px] font-bold ${
                      isDone 
                        ? 'bg-emerald-600 text-white shadow-2xs' 
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    D{dayNum}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes / Remarks */}
          {customer.notes && (
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900">
              <strong className="block mb-0.5">Instructor Remarks:</strong>
              {customer.notes}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Shinde Motor Driving School • Owner: Anil Shinde</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
