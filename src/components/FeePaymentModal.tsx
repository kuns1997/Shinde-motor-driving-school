import React, { useState } from 'react';
import { Customer, StaffMember, PaymentMode } from '../types';
import { formatINR, generateReceiptNo } from '../utils/formatters';
import { X, IndianRupee, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeePaymentModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (customerId: string, amount: number, mode: PaymentMode, collectedBy: StaffMember, note?: string) => void;
}

export const FeePaymentModal: React.FC<FeePaymentModalProps> = ({
  customer,
  isOpen,
  onClose,
  onConfirmPayment
}) => {
  if (!isOpen || !customer) return null;

  const [amount, setAmount] = useState<number>(customer.remainingFee);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI / GPay');
  const [collectedBy, setCollectedBy] = useState<StaffMember>(customer.assignedStaff || 'Anil Shinde');
  const [paymentNote, setPaymentNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }
    if (amount > customer.remainingFee) {
      alert(`Amount cannot exceed remaining balance of ${formatINR(customer.remainingFee)}.`);
      return;
    }

    if (amount === customer.remainingFee) {
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    onConfirmPayment(customer.id, amount, paymentMode, collectedBy, paymentNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Collect Fee Payment</h3>
              <p className="text-xs text-emerald-100">{customer.name} ({customer.admissionNo})</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Balance summary card */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[11px]">Total Remaining Dues:</span>
              <span className="text-xl font-extrabold text-slate-900">{formatINR(customer.remainingFee)}</span>
            </div>
            <button
              type="button"
              onClick={() => setAmount(customer.remainingFee)}
              className="text-xs px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors cursor-pointer shadow-2xs"
            >
              Pay Full Remaining
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Payment Amount (INR) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min={1}
                max={customer.remainingFee}
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 text-base font-bold bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Payment Method *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['UPI / GPay', 'Cash', 'Card', 'Bank Transfer'] as PaymentMode[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`py-2 px-2.5 rounded-lg border text-left font-semibold text-xs transition-all cursor-pointer ${
                    paymentMode === mode
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Collected By */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Collected By (Staff Member) *
            </label>
            <select
              value={collectedBy}
              onChange={(e) => setCollectedBy(e.target.value as StaffMember)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900 font-semibold"
            >
              <option value="Anil Shinde">Anil Shinde (Owner)</option>
              <option value="Karan Shinde">Karan Shinde (Staff)</option>
              <option value="Pushpa Shinde">Pushpa Shinde (Staff)</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Note / Reference
            </label>
            <input
              type="text"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="e.g. UPI Ref: 483921884, Part Installment 2"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors cursor-pointer"
            >
              Confirm & Issue Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
