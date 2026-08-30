import React, { useState, useEffect } from 'react';
import { Customer, Gender, CourseDuration, CourseType, StaffMember, InsuranceStatus } from '../types';
import { generateAdmissionNo } from '../utils/formatters';
import { X, UserCheck, ShieldCheck, IndianRupee, Clock, Moon, Car, Phone, Calendar } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Partial<Customer>) => void;
  customerToEdit: Customer | null;
  totalCustomersCount: number;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customerToEdit,
  totalCustomersCount
}) => {
  const currentYear = new Date().getFullYear();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [year, setYear] = useState<number>(currentYear);
  const [courseDuration, setCourseDuration] = useState<CourseDuration>('25 Days');
  const [courseType, setCourseType] = useState<CourseType>('4-Wheeler (Car LMV)');
  const [assignedStaff, setAssignedStaff] = useState<StaffMember>('Anil Shinde');
  const [slotTiming, setSlotTiming] = useState('07:00 AM - 08:00 AM');
  const [totalFee, setTotalFee] = useState<number>(7500);
  const [paidFee, setPaidFee] = useState<number>(4000);
  const [insuranceStatus, setInsuranceStatus] = useState<InsuranceStatus>('Done');
  const [insurancePolicyNo, setInsurancePolicyNo] = useState('');
  const [notes, setNotes] = useState('');
  const [completedDays, setCompletedDays] = useState<number>(0);
  const [licenseType, setLicenseType] = useState<'Learner + Permanent DL' | 'Permanent DL Only' | 'Learner License Only'>('Learner + Permanent DL');

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name);
      setGender(customerToEdit.gender);
      setPhone(customerToEdit.phone);
      setEmail(customerToEdit.email || '');
      setAddress(customerToEdit.address || '');
      setRegistrationDate(customerToEdit.registrationDate);
      setYear(customerToEdit.year);
      setCourseDuration(customerToEdit.courseDuration);
      setCourseType(customerToEdit.courseType);
      setAssignedStaff(customerToEdit.assignedStaff);
      setSlotTiming(customerToEdit.slotTiming);
      setTotalFee(customerToEdit.totalFee);
      setPaidFee(customerToEdit.paidFee);
      setInsuranceStatus(customerToEdit.insuranceStatus);
      setInsurancePolicyNo(customerToEdit.insurancePolicyNo || '');
      setNotes(customerToEdit.notes || '');
      setCompletedDays(customerToEdit.completedDays || 0);
      setLicenseType(customerToEdit.licenseTypeRequested || 'Learner + Permanent DL');
    } else {
      // Defaults for new admission
      setName('');
      setGender('Male');
      setPhone('');
      setEmail('');
      setAddress('');
      setRegistrationDate(new Date().toISOString().split('T')[0]);
      setYear(currentYear);
      setCourseDuration('25 Days');
      setCourseType('4-Wheeler (Car LMV)');
      setAssignedStaff('Anil Shinde');
      setSlotTiming('07:00 AM - 08:00 AM');
      setTotalFee(7500);
      setPaidFee(4000);
      setInsuranceStatus('Done');
      setInsurancePolicyNo(`PA-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`);
      setNotes('');
      setCompletedDays(0);
      setLicenseType('Learner + Permanent DL');
    }
  }, [customerToEdit, isOpen, currentYear]);

  // Adjust standard fee when course duration changes
  const handleDurationChange = (duration: CourseDuration) => {
    setCourseDuration(duration);
    if (!customerToEdit) {
      if (duration === '25 Days') {
        setTotalFee(7500);
        setSlotTiming('07:00 AM - 08:00 AM');
      } else if (duration === '20 Days') {
        setTotalFee(6500);
        setSlotTiming('08:00 AM - 09:00 AM');
      } else if (duration === '5-Day Night Shift') {
        setTotalFee(5500);
        setSlotTiming('08:00 PM - 09:30 PM (Night)');
        setAssignedStaff('Karan Shinde');
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please provide student name and phone number.');
      return;
    }

    const calculatedTotalDays = courseDuration === '25 Days' ? 25 : courseDuration === '20 Days' ? 20 : 5;
    const remaining = Math.max(0, totalFee - paidFee);

    const payload: Partial<Customer> = {
      name: name.trim(),
      gender,
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      registrationDate,
      year: Number(year),
      courseDuration,
      courseType,
      assignedStaff,
      slotTiming,
      totalFee: Number(totalFee),
      paidFee: Number(paidFee),
      remainingFee: remaining,
      insuranceStatus,
      insurancePolicyNo: insuranceStatus === 'Done' ? (insurancePolicyNo || `PA-${year}-Auto`) : undefined,
      notes: notes.trim(),
      totalDays: calculatedTotalDays,
      completedDays: Math.min(completedDays, calculatedTotalDays),
      licenseTypeRequested: licenseType
    };

    onSave(payload);
    onClose();
  };

  const calculatedRemaining = Math.max(0, totalFee - paidFee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {customerToEdit ? 'Edit Customer Information' : 'New Driving Student Admission'}
              </h3>
              <p className="text-xs text-slate-400">
                Shinde Motor Driving School • Admission Ledger
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Personal Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kadam"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 98220 12345"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@example.com"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
              />
            </div>
          </div>

          {/* Course Duration & Batch Year */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Course Duration & Training Package
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: '25 Days', label: '25 Days Regular', desc: 'Standard Comprehensive Course', icon: Clock },
                { id: '20 Days', label: '20 Days Fast Track', desc: 'Accelerated Daily Training', icon: Clock },
                { id: '5-Day Night Shift', label: '5-Day Night Shift', desc: 'Night Traffic & Highway Special', icon: Moon }
              ].map((c) => {
                const isSel = courseDuration === c.id;
                const Icon = c.icon;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => handleDurationChange(c.id as CourseDuration)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500 shadow-2xs' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Icon className={`w-3.5 h-3.5 ${c.id === '5-Day Night Shift' ? 'text-amber-600' : 'text-indigo-600'}`} />
                      <span>{c.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">{c.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Batch Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value={2026}>2026 (Current Year)</option>
                  <option value={2025}>2025 (Previous Batch)</option>
                  <option value={2024}>2024 (Archive)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Vehicle / Course Type
                </label>
                <select
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value as CourseType)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="4-Wheeler (Car LMV)">4-Wheeler (Car LMV)</option>
                  <option value="2-Wheeler (Bike/Scooter)">2-Wheeler (Bike/Scooter)</option>
                  <option value="Combo (2W + 4W)">Combo (2W + 4W)</option>
                  <option value="Heavy Commercial (HMV)">Heavy Commercial (HMV)</option>
                  <option value="Refresher Practical">Refresher Practical</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Instructor / Staff
                </label>
                <select
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value as StaffMember)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                >
                  <option value="Anil Shinde">Anil Shinde (Owner / Head)</option>
                  <option value="Karan Shinde">Karan Shinde (Senior Staff)</option>
                  <option value="Pushpa Shinde">Pushpa Shinde (Senior Staff)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fee & Insurance Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fee Box */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                Fee Payment Structure
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-600 mb-0.5">Total Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={totalFee}
                    onChange={(e) => setTotalFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-0.5">Paid Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    max={totalFee}
                    value={paidFee}
                    onChange={(e) => setPaidFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Remaining Balance:</span>
                <span className={`px-2 py-0.5 rounded ${calculatedRemaining > 0 ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-emerald-100 text-emerald-900'}`}>
                  ₹{calculatedRemaining.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Personal Accident Insurance Box */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Personal Accident Insurance Status
              </h4>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInsuranceStatus('Done')}
                  className={`flex-1 py-2 px-3 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                    insuranceStatus === 'Done'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  ✓ Done (Covered)
                </button>

                <button
                  type="button"
                  onClick={() => setInsuranceStatus('Not Done')}
                  className={`flex-1 py-2 px-3 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                    insuranceStatus === 'Not Done'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  ✕ Not Done (Pending)
                </button>
              </div>

              {insuranceStatus === 'Done' && (
                <div>
                  <label className="block font-semibold text-slate-600 mb-0.5">Insurance Policy No.</label>
                  <input
                    type="text"
                    value={insurancePolicyNo}
                    onChange={(e) => setInsurancePolicyNo(e.target.value)}
                    placeholder="e.g. PA-2026-992311"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono text-slate-900"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Address & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address for RTO file..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Instructor Notes / License Status</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Learner License passed, hill-start test pending..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/20 transition-colors cursor-pointer"
            >
              {customerToEdit ? 'Save Changes' : 'Complete Admission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
