import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ActiveUser, BranchSummary, PatientsTrendData } from '../services/models/summary.model';
@Injectable({
  providedIn: 'root',
})
export class SummaryService {

   private activeUsers: ActiveUser[] = [
    { id: 1, fullName: 'حسام محمد علي', username: 'Dashboard1', branchName: 'فرع الإسماعيلية' },
    { id: 2, fullName: 'معمل المعمل', username: 'Reg Edit', branchName: 'فرع الإسماعيلية' },
  ];


   private summaries: Record<string, BranchSummary> = {
    all: {
      branchId: null, todaySubtotal: 100,
      users: [{ userName: 'ma3mal', lastClosure: null, payments: 120, discount: 32, expenses: 20, subtotal: 100 }],
      daily: { patientVisits: 2, subtotalIncome: 100, expenses: 20, discount: 32 },
      tests: { requested: 7, printed: 2, delayed: 0, deleted: 0 },
    },
    '1': {
      branchId: 1, todaySubtotal: 100,
      users: [{ userName: 'ma3mal', lastClosure: null, payments: 120, discount: 32, expenses: 20, subtotal: 100 }],
      daily: { patientVisits: 2, subtotalIncome: 100, expenses: 20, discount: 32 },
      tests: { requested: 7, printed: 2, delayed: 0, deleted: 0 },
    },
    '2': {
      branchId: 2, todaySubtotal: 0, users: [],
      daily: { patientVisits: 0, subtotalIncome: 0, expenses: 0, discount: 0 },
      tests: { requested: 0, printed: 0, delayed: 0, deleted: 0 },
    },
  };

  getSummary(branchId: number | null): Observable<BranchSummary> {
    return of(structuredClone(this.summaries[branchId ?? 'all'])).pipe(delay(250));
  }

  getActiveUsers(): Observable<ActiveUser[]> {
    return of(structuredClone(this.activeUsers)).pipe(delay(250));
  }

  logoutUser(id: number): Observable<void> {
    this.activeUsers = this.activeUsers.filter(u => u.id !== id);
    return of(void 0).pipe(delay(250));
  }

  getTrend(): Observable<PatientsTrendData> {
    return of({
      total: 2,
      points: [
        { hour: '01 PM', patients: 0 }, { hour: '02 PM', patients: 2 }, { hour: '03 PM', patients: 0 },
      ],
    }).pipe(delay(250));
  }

  downloadBackup(): Observable<Blob> {
    return of(new Blob(['mock backup'], { type: 'application/octet-stream' })).pipe(delay(400));
  }

}
