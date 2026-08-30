import React from 'react';
import { 
  Car, 
  UserPlus, 
  Download, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Users,
  Award
} from 'lucide-react';

interface NavbarProps {
  onAddCustomer: () => void;
  onExportCSV: () => void;
  onOpenInsuranceBatch: () => void;
  onResetData: () => void;
  totalCustomers: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddCustomer,
  onExportCSV,
  onOpenInsuranceBatch,
  onResetData,
  totalCustomers
}) => {
  return (
    <header id="main-navbar" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
              <Car className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Shinde Motor Driving School
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200/80">
                  Govt. Approved
                </span>
              </div>
              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 font-medium mt-0.5">
                <span className="flex items-center gap-1 text-slate-700">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <strong>Owner:</strong> Anil Shinde
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <strong>Staff:</strong> Karan Shinde, Pushpa Shinde
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              id="btn-insurance-batch"
              onClick={onOpenInsuranceBatch}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
              title="Batch verify Personal Accident Insurance"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Insurance</span> Compliance
            </button>

            <button
              id="btn-export-csv"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
              title="Export Customer Roster to CSV"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              id="btn-add-customer"
              onClick={onAddCustomer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-sm shadow-amber-600/20 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>New Admission</span>
            </button>

            <button
              id="btn-reset-data"
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset to demo customer data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
