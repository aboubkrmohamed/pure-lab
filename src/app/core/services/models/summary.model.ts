export interface UserSubtotalItem {
  userName: string;
  lastClosure: string | null;
  payments: number;
  discount: number;
  expenses: number;
  subtotal: number;
}

export interface BranchSummary {
  branchId: number | null;          // null = كل الفروع
  todaySubtotal: number;
  users: UserSubtotalItem[];
  daily: { patientVisits: number; subtotalIncome: number; expenses: number; discount: number };
  tests: { requested: number; printed: number; delayed: number; deleted: number };
}

export interface ActiveUser {
  id: number;
  fullName: string;
  username: string;
  branchName: string;
}

export interface TrendPoint {
  hour: string;      // مثال '01 PM'
  patients: number;
}

export interface PatientsTrendData {
  total: number;
  points: TrendPoint[];
}
