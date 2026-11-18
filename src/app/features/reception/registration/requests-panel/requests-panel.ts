import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pager } from '../../../../shared/components/pager/pager';
import { RegView, RegistrationStore } from '../registration.store';
import { TotalsBar } from '../totals-bar/totals-bar';
import { RegistrationApi } from '../../../../core/services/registration-api';
import { RegSettings } from '../../../../core/services/reg-settings';

interface MenuItem { icon: string; label: string; view?: RegView; needsSaved?: boolean; }

@Component({
  selector: 'app-requests-panel',
  imports: [DecimalPipe, FormsModule, MatMenuModule, Pager, TotalsBar],
  templateUrl: './requests-panel.html',
  styleUrl: './requests-panel.scss',
})
export class RequestsPanel {
  store = inject(RegistrationStore);
  private snack = inject(MatSnackBar);
settings = inject(RegSettings);
  readonly pageSize = 8;
  filter = signal('ALL');
  page = signal(0);

  departments = computed(() => [...new Set(this.store.tests().map(t => t.department))]);
  filtered = computed(() => this.filter() === 'ALL'
    ? this.store.tests()
    : this.store.tests().filter(t => t.department === this.filter()));
  pages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  curPage = computed(() => Math.min(this.page(), this.pages() - 1));
  rows = computed(() => this.filtered().slice(this.curPage() * this.pageSize, (this.curPage() + 1) * this.pageSize));

  menuItems: MenuItem[] = [
    { icon: 'fa-flask', label: 'Samples', view: 'samples' },
    { icon: 'fa-folder-open', label: 'Price plans', view: 'price-plans' },
    { icon: 'fa-pen', label: 'Notes', view: 'notes' },
    { icon: 'fa-notes-medical', label: 'Services', view: 'services' },
    { icon: 'fa-circle-info', label: 'Questions', view: 'questions' },
    { icon: 'fa-rotate', label: 'Reload ranges' },
    { icon: 'fa-lock', label: 'Lock patient' },
    { icon: 'fa-table-columns', label: 'User summary', view: 'user-summary' },
    { icon: 'fa-camera', label: 'Attachments', view: 'attachments' },
    { icon: 'fa-plus', label: 'Add request' },
    { icon: 'fa-trash', label: 'Cancel', needsSaved: true },
    { icon: 'fa-list', label: 'تقرير مدفوعات', view: 'payments-report' },
  ];

  // open(m: MenuItem) {
  //   if (m.view) this.store.go(m.view);
  //   else this.soon(m.label);
  // }

  soon(what: string) {
    this.snack.open(`${what}: قريبًا`, 'إغلاق', { duration: 1500 });
  }


    private api = inject(RegistrationApi);

  open(m: MenuItem) {
    if (m.label === 'Cancel') { this.cancel(); return; }
    if (m.view) this.store.go(m.view);
    else this.soon(m.label);
  }

  cancel() {
    if (!confirm('تأكيد إلغاء الزيارة دي؟')) return;
    this.api.cancelVisit(this.store.visit().visitNo).subscribe(() => {
      this.store.newVisit();
      this.snack.open('تم إلغاء الزيارة', 'إغلاق', { duration: 2000 });
    });
  }


}
