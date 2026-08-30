import React, { useState, useEffect, useMemo } from 'react';
import { Customer, FilterState, DashboardStats, PaymentMode, StaffMember } from './types';
import { INITIAL_CUSTOMERS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { YearTabsAndStaff } from './components/YearTabsAndStaff';
import { CategoryDurationSummary } from './components/CategoryDurationSummary';
import { FiltersBar } from './components/FiltersBar';
import { CustomerTable } from './components/CustomerTable';
import { CustomerModal } from './components/CustomerModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { FeePaymentModal } from './components/FeePaymentModal';
import { InsuranceBatchModal } from './components/InsuranceBatchModal';
import { exportCustomersToCSV, generateReceiptNo, generateAdmissionNo } from './utils/formatters';

const STORAGE_KEY = 'shinde_motor_driving_school_v1';

export default function App() {
  // Load customers from LocalStorage or mock data
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved customers', e);
    }
    return INITIAL_CUSTOMERS;
  });

  // Save to LocalStorage whenever customers change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers', e);
    }
  }, [customers]);

  // Active filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    year: 'all',
    courseDuration: 'all',
    gender: 'all',
    insuranceStatus: 'all',
    paymentStatus: 'all',
    assignedStaff: 'all',
    courseStatus: 'all'
  });

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  
  const [customerToView, setCustomerToView] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [customerForFee, setCustomerForFee] = useState<Customer | null>(null);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

  const [isInsuranceBatchOpen, setIsInsuranceBatchOpen] = useState(false);

  // Quick filter updater
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      year: 'all',
      courseDuration: 'all',
      gender: 'all',
      insuranceStatus: 'all',
      paymentStatus: 'all',
      assignedStaff: 'all',
      courseStatus: 'all'
    });
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Search filter
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesPhone = c.phone.includes(q);
        const matchesAdm = c.admissionNo.toLowerCase().includes(q);
        const matchesAddress = (c.address || '').toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesAdm && !matchesAddress) return false;
      }

      // Year filter
      if (filters.year !== 'all' && c.year.toString() !== filters.year) {
        return false;
      }

      // Course duration filter
      if (filters.courseDuration !== 'all' && c.courseDuration !== filters.courseDuration) {
        return false;
      }

      // Gender filter
      if (filters.gender !== 'all' && c.gender !== filters.gender) {
        return false;
      }

      // Insurance status filter
      if (filters.insuranceStatus !== 'all' && c.insuranceStatus !== filters.insuranceStatus) {
        return false;
      }

      // Payment status filter
      if (filters.paymentStatus === 'paid' && c.remainingFee > 0) return false;
      if (filters.paymentStatus === 'partial' && c.remainingFee <= 0) return false;

      // Staff filter
      if (filters.assignedStaff !== 'all' && c.assignedStaff !== filters.assignedStaff) {
        return false;
      }

      return true;
    });
  }, [customers, filters]);

  // Overall & filtered statistics computation
  const stats = useMemo<DashboardStats>(() => {
    const subset = filters.year === 'all' 
      ? customers 
      : customers.filter(c => c.year.toString() === filters.year);

    const totalCustomers = subset.length;
    const maleCount = subset.filter(c => c.gender === 'Male').length;
    const femaleCount = subset.filter(c => c.gender === 'Female').length;
    const otherCount = subset.filter(c => c.gender === 'Other').length;
    
    const totalRevenue = subset.reduce((acc, c) => acc + c.totalFee, 0);
    const totalPaid = subset.reduce((acc, c) => acc + c.paidFee, 0);
    const totalRemaining = subset.reduce((acc, c) => acc + c.remainingFee, 0);

    const insuranceDoneCount = subset.filter(c => c.insuranceStatus === 'Done').length;
    const insurancePendingCount = subset.filter(c => c.insuranceStatus === 'Not Done').length;

    const course25DaysCount = subset.filter(c => c.courseDuration === '25 Days').length;
    const course20DaysCount = subset.filter(c => c.courseDuration === '20 Days').length;
    const course5DaysNightCount = subset.filter(c => c.courseDuration === '5-Day Night Shift').length;

    const activeStudentsCount = subset.filter(c => c.courseStatus === 'Active').length;

    return {
      totalCustomers,
      maleCount,
      femaleCount,
      otherCount,
      totalRevenue,
      totalPaid,
      totalRemaining,
      insuranceDoneCount,
      insurancePendingCount,
      course25DaysCount,
      course20DaysCount,
      course5DaysNightCount,
      activeStudentsCount
    };
  }, [customers, filters.year]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.year !== 'all') count++;
    if (filters.courseDuration !== 'all') count++;
    if (filters.gender !== 'all') count++;
    if (filters.insuranceStatus !== 'all') count++;
    if (filters.paymentStatus !== 'all') count++;
    if (filters.assignedStaff !== 'all') count++;
    return count;
  }, [filters]);

  // Customer Management Handlers
  const handleOpenAddModal = () => {
    setCustomerToEdit(null);
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = (customerData: Partial<Customer>) => {
    if (customerToEdit) {
      // Update existing
      setCustomers(prev =>
        prev.map(c => (c.id === customerToEdit.id ? ({ ...c, ...customerData } as Customer) : c))
      );
      if (customerToView && customerToView.id === customerToEdit.id) {
        setCustomerToView(prev => (prev ? ({ ...prev, ...customerData } as Customer) : null));
      }
    } else {
      // Create new customer
      const currentYear = customerData.year || new Date().getFullYear();
      const newAdmissionNo = generateAdmissionNo(currentYear, customers.filter(c => c.year === currentYear).length);
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        admissionNo: newAdmissionNo,
        name: customerData.name || 'New Student',
        gender: customerData.gender || 'Male',
        phone: customerData.phone || '',
        email: customerData.email,
        address: customerData.address,
        registrationDate: customerData.registrationDate || new Date().toISOString().split('T')[0],
        year: currentYear,
        courseDuration: customerData.courseDuration || '25 Days',
        courseType: customerData.courseType || '4-Wheeler (Car LMV)',
        assignedStaff: customerData.assignedStaff || 'Anil Shinde',
        slotTiming: customerData.slotTiming || '07:00 AM - 08:00 AM',
        totalFee: customerData.totalFee || 7500,
        paidFee: customerData.paidFee || 0,
        remainingFee: customerData.remainingFee || (customerData.totalFee || 7500) - (customerData.paidFee || 0),
        paymentHistory: (customerData.paidFee && customerData.paidFee > 0) ? [
          {
            id: `p-${Date.now()}`,
            date: customerData.registrationDate || new Date().toISOString().split('T')[0],
            amount: customerData.paidFee,
            mode: 'UPI / GPay',
            receiptNo: generateReceiptNo(),
            collectedBy: customerData.assignedStaff || 'Anil Shinde',
            note: 'Initial Admission Token'
          }
        ] : [],
        insuranceStatus: customerData.insuranceStatus || 'Done',
        insurancePolicyNo: customerData.insurancePolicyNo,
        courseStatus: 'Active',
        completedDays: customerData.completedDays || 0,
        totalDays: customerData.totalDays || 25,
        licenseTypeRequested: customerData.licenseTypeRequested || 'Learner + Permanent DL',
        notes: customerData.notes
      };

      setCustomers(prev => [newCustomer, ...prev]);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    if (window.confirm(`Are you sure you want to remove ${cust.name} (${cust.admissionNo}) from the student registry?`)) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      if (customerToView && customerToView.id === id) {
        setIsDetailModalOpen(false);
      }
    }
  };

  // 1-Click Toggle Personal Accident Insurance Status
  const handleToggleInsurance = (customer: Customer) => {
    const newStatus = customer.insuranceStatus === 'Done' ? 'Not Done' : 'Done';
    const newPolicyNo = newStatus === 'Done' ? (customer.insurancePolicyNo || `PA-${customer.year}-${Math.floor(100000 + Math.random() * 900000)}`) : undefined;

    setCustomers(prev =>
      prev.map(c => (c.id === customer.id ? { ...c, insuranceStatus: newStatus, insurancePolicyNo: newPolicyNo } : c))
    );

    if (customerToView && customerToView.id === customer.id) {
      setCustomerToView(prev => (prev ? { ...prev, insuranceStatus: newStatus, insurancePolicyNo: newPolicyNo } : null));
    }
  };

  // Batch insurance updater
  const handleBatchUpdateInsurance = (customerIds: string[], status: 'Done' | 'Not Done') => {
    setCustomers(prev =>
      prev.map(c => {
        if (customerIds.includes(c.id)) {
          const policyNo = status === 'Done' ? (c.insurancePolicyNo || `PA-${c.year}-${Math.floor(100000 + Math.random() * 900000)}`) : undefined;
          return { ...c, insuranceStatus: status, insurancePolicyNo: policyNo };
        }
        return c;
      })
    );
  };

  // Quick Attendance increment
  const handleIncrementAttendance = (customer: Customer) => {
    if (customer.completedDays >= customer.totalDays) return;
    const nextDays = customer.completedDays + 1;
    const nextStatus = nextDays >= customer.totalDays ? 'Completed' : customer.courseStatus;

    setCustomers(prev =>
      prev.map(c => (c.id === customer.id ? { ...c, completedDays: nextDays, courseStatus: nextStatus } : c))
    );

    if (customerToView && customerToView.id === customer.id) {
      setCustomerToView(prev => (prev ? { ...prev, completedDays: nextDays, courseStatus: nextStatus } : null));
    }
  };

  // Collect Fee Installment
  const handleOpenFeeModal = (customer: Customer) => {
    setCustomerForFee(customer);
    setIsFeeModalOpen(true);
  };

  const handleConfirmFeePayment = (
    customerId: string,
    amount: number,
    mode: PaymentMode,
    collectedBy: StaffMember,
    note?: string
  ) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          const newPaid = c.paidFee + amount;
          const newRemaining = Math.max(0, c.totalFee - newPaid);
          const newPaymentRecord = {
            id: `pay-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount,
            mode,
            receiptNo: generateReceiptNo(),
            collectedBy,
            note: note || 'Fee Installment'
          };
          return {
            ...c,
            paidFee: newPaid,
            remainingFee: newRemaining,
            paymentHistory: [...(c.paymentHistory || []), newPaymentRecord]
          };
        }
        return c;
      })
    );

    if (customerToView && customerToView.id === customerId) {
      setCustomerToView(prev => {
        if (!prev) return null;
        const newPaid = prev.paidFee + amount;
        const newRemaining = Math.max(0, prev.totalFee - newPaid);
        return {
          ...prev,
          paidFee: newPaid,
          remainingFee: newRemaining,
          paymentHistory: [
            ...(prev.paymentHistory || []),
            {
              id: `pay-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              amount,
              mode,
              receiptNo: generateReceiptNo(),
              collectedBy,
              note: note || 'Fee Installment'
            }
          ]
        };
      });
    }
  };

  // Open customer detail view
  const handleViewCustomer = (customer: Customer) => {
    setCustomerToView(customer);
    setIsDetailModalOpen(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    exportCustomersToCSV(filteredCustomers);
  };

  // Reset to default initial data
  const handleResetData = () => {
    if (window.confirm('Reset all customer records to default initial database? Any newly added records will be restored.')) {
      setCustomers(INITIAL_CUSTOMERS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div id="shinde-driving-school-app" className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        onAddCustomer={handleOpenAddModal}
        onExportCSV={handleExportCSV}
        onOpenInsuranceBatch={() => setIsInsuranceBatchOpen(true)}
        onResetData={handleResetData}
        totalCustomers={customers.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* Key Metrics Overview Cards */}
        <StatsCards
          stats={stats}
          selectedYear={filters.year}
          onFilterDuration={(dur) => handleFilterChange('courseDuration', dur)}
          onFilterGender={(g) => handleFilterChange('gender', g)}
          onFilterInsurance={(ins) => handleFilterChange('insuranceStatus', ins)}
          onFilterPayment={(p) => handleFilterChange('paymentStatus', p)}
        />

        {/* Year-wise Categories & Staff Leadership */}
        <YearTabsAndStaff
          selectedYear={filters.year}
          onSelectYear={(yr) => handleFilterChange('year', yr)}
          selectedStaff={filters.assignedStaff}
          onSelectStaff={(st) => handleFilterChange('assignedStaff', st)}
          customers={customers}
        />

        {/* Course Duration & Package Breakdown Summary */}
        <CategoryDurationSummary
          customers={customers}
          onFilterDuration={(dur) => handleFilterChange('courseDuration', dur)}
        />

        {/* Filter Controls Bar */}
        <FiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          activeFilterCount={activeFilterCount}
          totalFilteredCount={filteredCustomers.length}
          totalAllCount={customers.length}
        />

        {/* Customer Wise Table */}
        <CustomerTable
          customers={filteredCustomers}
          onViewCustomer={handleViewCustomer}
          onEditCustomer={handleOpenEditModal}
          onDeleteCustomer={handleDeleteCustomer}
          onToggleInsurance={handleToggleInsurance}
          onQuickCollectFee={handleOpenFeeModal}
          onIncrementAttendance={handleIncrementAttendance}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Shinde Motor Driving School</strong> • Est. 2002 • Founder & Owner: <strong>Anil Shinde</strong>
          </span>
          <span>
            Instructors: <strong>Karan Shinde</strong> & <strong>Pushpa Shinde</strong> • RTO Authorized Training
          </span>
        </div>
      </footer>

      {/* Modals */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        customerToEdit={customerToEdit}
        totalCustomersCount={customers.length}
      />

      <CustomerDetailModal
        customer={customerToView}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onQuickCollectFee={handleOpenFeeModal}
        onIncrementAttendance={handleIncrementAttendance}
        onToggleInsurance={handleToggleInsurance}
      />

      <FeePaymentModal
        customer={customerForFee}
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        onConfirmPayment={handleConfirmFeePayment}
      />

      <InsuranceBatchModal
        customers={customers}
        isOpen={isInsuranceBatchOpen}
        onClose={() => setIsInsuranceBatchOpen(false)}
        onUpdateInsurance={handleBatchUpdateInsurance}
      />

    </div>
  );
}
