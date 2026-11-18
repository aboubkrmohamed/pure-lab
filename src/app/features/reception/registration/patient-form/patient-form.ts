import { Component, ElementRef, afterNextRender, effect, inject, untracked, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistrationApi } from '../../../../core/services/registration-api';
import { EnterNext } from '../../../../shared/directives/enter-next';
import { RegistrationStore } from '../registration.store';

@Component({
  selector: 'app-patient-form',
  imports: [ReactiveFormsModule, EnterNext],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.scss',
})
export class PatientForm {
  store = inject(RegistrationStore);
  private api = inject(RegistrationApi);
  private snack = inject(MatSnackBar);

  genders = ['ذكر', 'أنثى'];
  titles = ['السيد', 'السيدة', 'الآنسة', 'الطفل', 'الطفلة', 'دكتور', 'دكتورة'];
  nationalities = ['مصري', 'سعودي', 'سوداني', 'سوري', 'ليبي', 'يمني', 'أخرى'];
  relations = ['نفسه', 'زوج / زوجة', 'ابن / ابنة', 'أب', 'أم', 'أخ / أخت'];

  nameEl = viewChild<ElementRef<HTMLInputElement>>('nameEl');
  refTitleEl = viewChild<ElementRef<HTMLInputElement>>('refTitleEl');

  constructor() {
    afterNextRender(() => this.nameEl()?.nativeElement.focus());

    effect(() => {
      if (this.store.referralFocus() === 0) return;
      untracked(() => this.refTitleEl()?.nativeElement.focus());
    });
  }

  onRefNo(e: Event) {
    const id = this.store.referralForm.controls.doctorId.value;
    if (!id) return;
    e.stopPropagation(); e.preventDefault();
    this.api.getDoctor(id).subscribe(d => d
      ? this.store.selectDoctor(d)
      : this.snack.open('رقم الإحالة غير موجود', 'إغلاق', { duration: 2000 }));
  }

  onRefTitle(e: Event) {
    e.stopPropagation(); e.preventDefault();
    const r = this.store.referralForm.getRawValue();
    if (!r.doctorId && r.title.trim()) this.store.openDoctors(r.title);
    else this.store.go('tests');
  }
}
