import { Branch } from './models/module-card.model';
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Branches {
  private branches: Branch[] = [
    {
      id: 1, name: 'فرع الإسماعيلية', receiptStyle: null,
      footer1: '0100000000', footer2: '7501195348',
      footer3: 'مواعيد العمل: التاسعة صباحاً إلى الحادية عشرة مساءاً',
      printDailySerial: false, headerImage: null,
    },
    {
      id: 2, name: 'فرع بورسعيد', receiptStyle: 'with-prices',
      footer1: 'برج الشروق 2000 - أمام مجمع المحاكم و الموقف الجديد',
      footer2: '01025578222 - 0643227786',
      footer3: 'مواعيد العمل: التاسعة صباحاً إلى الحادية عشرة مساءاً',
      printDailySerial: true, headerImage: null,
    },
  ];


getBranches(): Observable<Branch[]> {
    return of(structuredClone(this.branches)).pipe(delay(300));
  }

  saveBranch(branch: Branch): Observable<Branch> {
    const i = this.branches.findIndex(b => b.id === branch.id);
    if (i > -1) this.branches[i] = structuredClone(branch);
    return of(branch).pipe(delay(300));
  }



}
