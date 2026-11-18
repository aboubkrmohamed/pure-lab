import { PricePlan,Page } from './../../../../core/services/models/registration.model';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, switchMap } from 'rxjs';
import { RegistrationApi } from '../../../../core/services/registration-api';
import { RegistrationStore } from '../registration.store';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-price-plans-view',
  imports: [FormsModule,CommonModule],
  templateUrl: './price-plans-view.html',
  styleUrl: './price-plans-view.scss',
})
export class PricePlansView {
  store = inject(RegistrationStore);
  private api = inject(RegistrationApi);
  private snack = inject(MatSnackBar);

  readonly pageSize = 10;
  query = signal('');
  page = signal(0);
  selected = signal<PricePlan | null>(null);

  private result = toSignal(
    toObservable(computed(() => ({ q: this.query(), p: this.page() }))).pipe(
      debounceTime(120),
      switchMap(({ q, p }) => this.api.searchPlans(q, p, this.pageSize))),
    { initialValue: { items: [], total: 0 } as Page<PricePlan> });

  plans = computed(() => this.result().items);
  pages = computed(() => Math.max(1, Math.ceil(this.result().total / this.pageSize)));

  onSearch(v: string) { this.query.set(v); this.page.set(0); }
  go(p: number) { if (p >= 0 && p < this.pages()) this.page.set(p); }

  choose(category: string) {
    const plan = this.selected();
    if (!plan) return;
    if (!this.store.applyPlan(plan, category))
      this.snack.open('الزيارة محفوظة، دوس على القلم للتعديل', 'إغلاق', { duration: 2200 });
  }
}
