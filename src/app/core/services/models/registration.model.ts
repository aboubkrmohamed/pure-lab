export interface Page<T> { items: T[]; total: number; }

export interface Patient {
  fullName: string; gender: string; title: string;
  ageYears: number; ageMonths: number; ageDays: number; birthDate: string;
  phone: string; nationality: string; nationalId: string; passport: string; address: string;
}

export interface Referral {
  doctorId: number | null;
  title: string;
  name: string;
  priceListId: number | null;
  priceListName: string;
  priceCategory: string;
  relation: string;
  contracted: string;
  treatmentCardNo: string;
}

export interface LabTest {
  id: number; code: number; name: string; price: number;
  sampleType: string; department: string;
}

export interface RequestedTest extends LabTest {
  status: 'ordered' | 'collected' | 'received' | 'done';
}

export interface TestPackage {
  id: number; name: string;
  items: { test: LabTest; free: boolean }[];
}

export interface Doctor { id: number; title: string; name: string; }
export interface PricePlan { id: number; name: string; categories: string[]; }

export interface PaymentEntry {
  id: number;
  kind: 'payment' | 'discount';
  method: 'cash' | 'card';
  date: string;
  amount: number;
  user: string;
}

export interface VisitInfo { visitNo: number; dailyNo: number; fileNo: number; }

export interface SavedVisit {
  visit: VisitInfo;
  patient: Patient;
  referral: Referral;
  tests: RequestedTest[];
  payments: PaymentEntry[];
  priority: string;
  notes?: VisitNote[];
  services?: ServiceItem[];
  answers?: Record<number, string>;
  attachments?: AttachmentFile[];
}


export interface VisitNote { id: number; text: string; user: string; date: string; }
export interface ServiceItem { id: number; name: string; price: number; }
export interface AttachmentFile { id: number; name: string; size: number; dataUrl: string; }
export interface QuestionDef { id: number; text: string; type: 'text' | 'yesno'; }

export interface UserSummary {
  visits: number; total: number; discount: number; paid: number; remaining: number;
}
