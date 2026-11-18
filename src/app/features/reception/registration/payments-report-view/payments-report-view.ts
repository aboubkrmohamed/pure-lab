import { Component, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RegistrationStore } from '../registration.store';
import { RegHeader } from '../reg-header/reg-header';

@Component({
  selector: 'app-payments-report-view',
  imports: [DatePipe, DecimalPipe, RegHeader],
  templateUrl: './payments-report-view.html',
})
export class PaymentsReportView {
  store = inject(RegistrationStore);
  print() { window.print(); }
}
