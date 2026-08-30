export type Gender = 'Male' | 'Female' | 'Other';

export type CourseDuration = '25 Days' | '20 Days' | '5-Day Night Shift';

export type CourseType = 
  | '4-Wheeler (Car LMV)' 
  | '2-Wheeler (Bike/Scooter)' 
  | 'Combo (2W + 4W)' 
  | 'Heavy Commercial (HMV)' 
  | 'Refresher Practical';

export type StaffMember = 'Anil Shinde' | 'Karan Shinde' | 'Pushpa Shinde';

export type InsuranceStatus = 'Done' | 'Not Done';

export type CourseStatus = 'Active' | 'Completed' | 'Pending Test' | 'On Hold';

export type PaymentMode = 'Cash' | 'UPI / GPay' | 'Card' | 'Bank Transfer';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  mode: PaymentMode;
  receiptNo: string;
  collectedBy: StaffMember;
  note?: string;
}

export interface Customer {
  id: string;
  admissionNo: string;
  name: string;
  gender: Gender;
  phone: string;
  email?: string;
  address?: string;
  registrationDate: string; // YYYY-MM-DD
  year: number; // e.g. 2024, 2025, 2026
  courseDuration: CourseDuration;
  courseType: CourseType;
  assignedStaff: StaffMember;
  slotTiming: string;
  totalFee: number;
  paidFee: number;
  remainingFee: number;
  paymentHistory: PaymentRecord[];
  insuranceStatus: InsuranceStatus;
  insurancePolicyNo?: string;
  insuranceValidTill?: string;
  courseStatus: CourseStatus;
  completedDays: number;
  totalDays: number;
  licenseTypeRequested: 'Learner + Permanent DL' | 'Permanent DL Only' | 'Learner License Only';
  emergencyContact?: string;
  notes?: string;
}

export interface FilterState {
  search: string;
  year: string; // 'all' | '2026' | '2025' | '2024'
  courseDuration: string; // 'all' | '25 Days' | '20 Days' | '5-Day Night Shift'
  gender: string; // 'all' | 'Male' | 'Female'
  insuranceStatus: string; // 'all' | 'Done' | 'Not Done'
  paymentStatus: string; // 'all' | 'paid' | 'partial' | 'unpaid'
  assignedStaff: string; // 'all' | 'Anil Shinde' | 'Karan Shinde' | 'Pushpa Shinde'
  courseStatus: string; // 'all' | 'Active' | 'Completed' | 'Pending Test'
}

export interface DashboardStats {
  totalCustomers: number;
  maleCount: number;
  femaleCount: number;
  otherCount: number;
  totalRevenue: number;
  totalPaid: number;
  totalRemaining: number;
  insuranceDoneCount: number;
  insurancePendingCount: number;
  course25DaysCount: number;
  course20DaysCount: number;
  course5DaysNightCount: number;
  activeStudentsCount: number;
}
