import { TestPackage,Page,LabTest } from './../../../../core/services/models/registration.model';
import { Component, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, switchMap } from 'rxjs';
import { RegistrationApi } from '../../../../core/services/registration-api';
import { Pager } from '../../../../shared/components/pager/pager';
import { RegistrationStore } from '../registration.store';
import { TotalsBar } from '../totals-bar/totals-bar';
import { PackageDialog } from '../package-dialog/package-dialog';
@Component({
  selector: 'app-tests-view',
  imports: [DecimalPipe, FormsModule, Pager, TotalsBar,CommonModule],
  templateUrl: './tests-view.html',
  styleUrl: './tests-view.scss',
})
export class TestsView {
  store = inject(RegistrationStore);
  private api = inject(RegistrationApi);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  readonly pageSize = 8;
  mode = signal<'tests' | 'packages'>('tests');
  query = signal('');
  page = signal(0);
  tab = signal<'info' | 'questions' | 'samples'>('info');
  focused = signal<LabTest | null>(null);

  searchEl = viewChild<ElementRef<HTMLInputElement>>('searchEl');

  private result = toSignal(
    toObservable(computed(() => ({ q: this.query(), p: this.page() }))).pipe(
      debounceTime(120),
      switchMap(({ q, p }) => this.api.searchTests(q, p, this.pageSize))),
    { initialValue: { items: [], total: 0 } as Page<LabTest> });

  rows = computed(() => this.result().items);
  pages = computed(() => Math.max(1, Math.ceil(this.result().total / this.pageSize)));
  addedIds = computed(() => new Set(this.store.tests().map(t => t.id)));
  packages = toSignal(this.api.getPackages(), { initialValue: [] as TestPackage[] });

  constructor() {
    afterNextRender(() => this.searchEl()?.nativeElement.focus());
  }

  get patientName() {
    return this.store.patientForm.controls.fullName.value || 'مريض جديد';
  }

  onSearch(v: string) {
    this.query.set(v);
    this.page.set(0);
  }

  /** Enter: خانة فاضية ← المدفوعات، غير كده ← يضيف أول نتيجة */
  onEnter() {
    const q = this.query().trim();
    if (!q) { this.store.go('payments'); return; }
    this.api.searchTests(q, 0, 1).subscribe(r => {
      const t = r.items[0];
      if (!t) { this.snack.open('مفيش تحليل بالاسم أو الرقم ده', 'إغلاق', { duration: 1800 }); return; }
      this.pick(t);
      this.onSearch('');
    });
  }

  pick(t: LabTest) {
    this.focused.set(t);
    if (this.store.locked()) { this.lockedMsg(); return; }
    if (!this.store.addTest(t)) this.snack.open('التحليل موجود بالفعل', 'إغلاق', { duration: 1500 });
  }

  setMode(m: 'tests' | 'packages') {
    this.mode.set(m);
    if (m === 'tests') setTimeout(() => this.searchEl()?.nativeElement.focus());
  }

  openPackage(p: TestPackage) {
    this.dialog.open(PackageDialog, { data: p, width: '380px' }).afterClosed().subscribe(ok => {
      if (!ok) return;
      if (this.store.locked()) { this.lockedMsg(); return; }
      const n = this.store.addPackage(p);
      this.snack.open(n ? `تمت إضافة ${n} تحليل` : 'تحاليل الباكج موجودة بالفعل', 'إغلاق', { duration: 2000 });
    });
  }

  private lockedMsg() {
    this.snack.open('الزيارة محفوظة، دوس على القلم للتعديل', 'إغلاق', { duration: 2200 });
  }
}
