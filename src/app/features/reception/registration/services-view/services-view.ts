import { ServiceItem } from './../../../../core/services/models/registration.model';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistrationApi } from '../../../../core/services/registration-api';
// import { ServiceItem } from '../../../../core/models/registration.model';
import { RegistrationStore } from '../registration.store';
import { RegHeader } from '../reg-header/reg-header';
import { TotalsBar } from '../totals-bar/totals-bar';
@Component({
  selector: 'app-services-view',
  imports: [DecimalPipe, RegHeader, TotalsBar,CommonModule],
  templateUrl: './services-view.html',
})
export class ServicesView {
  store = inject(RegistrationStore);
  private snack = inject(MatSnackBar);
  catalog = toSignal(inject(RegistrationApi).getServices(), { initialValue: [] as ServiceItem[] });

  add(s: ServiceItem) {
    if (this.store.locked()) {
      this.snack.open('الزيارة محفوظة، دوس على القلم للتعديل', 'إغلاق', { duration: 2200 });
      return;
    }
    if (!this.store.addService(s)) this.snack.open('الخدمة مضافة بالفعل', 'إغلاق', { duration: 1500 });
  }
}
