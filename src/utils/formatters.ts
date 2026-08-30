import { Customer } from '../types';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function generateAdmissionNo(year: number, currentCount: number): string {
  const padded = String(currentCount + 1).padStart(3, '0');
  return `SMDS-${year}-${padded}`;
}

export function generateReceiptNo(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `REC-${randomNum}`;
}

export function exportCustomersToCSV(customers: Customer[], filename = 'shinde_driving_school_customers.csv') {
  const headers = [
    'Admission No',
    'Name',
    'Gender',
    'Phone',
    'Email',
    'Address',
    'Registration Date',
    'Year',
    'Course Duration',
    'Course Type',
    'Assigned Staff',
    'Slot Timing',
    'Total Fee (INR)',
    'Paid Fee (INR)',
    'Remaining Fee (INR)',
    'Personal Accident Insurance Status',
    'Policy No',
    'Course Status',
    'Days Progress'
  ];

  const rows = customers.map(c => [
    `"${c.admissionNo}"`,
    `"${c.name}"`,
    `"${c.gender}"`,
    `"${c.phone}"`,
    `"${c.email || ''}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    `"${c.registrationDate}"`,
    `"${c.year}"`,
    `"${c.courseDuration}"`,
    `"${c.courseType}"`,
    `"${c.assignedStaff}"`,
    `"${c.slotTiming}"`,
    c.totalFee,
    c.paidFee,
    c.remainingFee,
    `"${c.insuranceStatus}"`,
    `"${c.insurancePolicyNo || 'N/A'}"`,
    `"${c.courseStatus}"`,
    `"${c.completedDays}/${c.totalDays}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
