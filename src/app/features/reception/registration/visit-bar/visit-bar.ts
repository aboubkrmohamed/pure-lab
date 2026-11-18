import { SavedVisit } from './../../../../core/services/models/registration.model';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { RegistrationApi } from '../../../../core/services/registration-api';
import { RegistrationStore } from '../registration.store';
@Component({
  selector: 'app-visit-bar',
  imports: [FormsModule],
  template: `
    <div class="bar d-flex align-items-center mb-2">
      <button class="nb" title="آخر زيارة" (click)="last()"><i class="fa-solid fa-forward-fast"></i></button>
      <button class="nb" title="الزيارة السابقة" (click)="prev()"><i class="fa-solid fa-forward-step"></i></button>

      <div class="f grow">
        <small>رقم الزيارة</small>
        <input inputmode="numeric" autocomplete="off" placeholder="0"
               [ngModel]="visitInput()" (ngModelChange)="visitInput.set($event)"
               (keydown.enter)="byNumber()" />
      </div>
      <div class="f"><small>رقم يومي</small><span>{{ store.visit().dailyNo }}</span></div>
      <div class="f"><small>رقم المريض</small><span>{{ store.visit().fileNo }}</span></div>

      <button class="nb" title="الزيارة التالية" (click)="next()"><i class="fa-solid fa-backward-step"></i></button>
      <button class="nb" title="تعديل" [disabled]="!store.isSaved() || !store.locked()" (click)="store.startEdit()">
        <i class="fa-solid fa-pencil"></i>
      </button>
    </div>`,
  styles: `
    .bar { background: #1e7fd6; color: #fff; border-radius: 3px; min-height: 58px; }
    .nb { background: none; border: 0; color: #fff; width: 44px; height: 58px; font-size: 18px; }
    .nb:disabled { opacity: .4; }
    .f { padding: 0 14px; min-width: 110px; display: flex; flex-direction: column; border-inline-start: 1px solid rgba(255,255,255,.25); }
    .f.grow { flex: 1; }
    .f small { font-size: 11px; opacity: .8; }
    .f input { background: transparent; border: 0; border-bottom: 1px solid rgba(255,255,255,.6); color: #fff; outline: 0; font-size: 18px; width: 100%; }
    .f span { font-size: 18px; }
  `,
})
export class VisitBar {
  store = inject(RegistrationStore);
  private api = inject(RegistrationApi);
  private snack = inject(MatSnackBar);

  visitInput = signal('');

  constructor() {
    effect(() => {
      const n = this.store.visit().visitNo;
      this.visitInput.set(n ? String(n) : '');
    });
  }

  last() { this.load(this.api.getLastVisit()); }
  prev() { this.load(this.api.getNeighbour(this.store.visit().visitNo, -1)); }
  next() { this.load(this.api.getNeighbour(this.store.visit().visitNo, 1)); }

  byNumber() {
    const n = Number(this.visitInput());
    if (n) this.load(this.api.getVisit(n));
  }

  private load(obs: Observable<SavedVisit | null>) {
    obs.subscribe(v => v
      ? this.store.applySaved(v)
      : this.snack.open('مفيش زيارة', 'إغلاق', { duration: 1800 }));
  }
}
