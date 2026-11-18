import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { RegistrationApi } from '../../../../core/services/registration-api';
import { RegistrationStore } from '../registration.store';
import { RegHeader } from '../reg-header/reg-header';

@Component({
  selector: 'app-user-summary-view',
  imports: [DecimalPipe, RegHeader],
  templateUrl: './user-summary-view.html',
})
export class UserSummaryView {
  store = inject(RegistrationStore);
  summary = toSignal(inject(RegistrationApi).getTodaySummary(), { initialValue: null });
}
