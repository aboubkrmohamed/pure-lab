import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RegistrationStore } from '../registration.store';

@Component({
  selector: 'app-totals-bar',
  imports: [DecimalPipe],
  template: `
    <div class="row g-1 m-0">
      <div class="col-6"><div class="t teal"><b>{{ s.total() }}</b>TOTAL</div></div>
      <div class="col-6"><div class="t orange"><b>{{ s.discount() }}</b>DISCOUNT</div></div>
      <div class="col-6"><div class="t green"><b>{{ s.paid() }}</b>PAID</div></div>
      <div class="col-6">
        <div class="t" [class.blue]="s.remaining() <= 0" [class.red]="s.remaining() > 0">
          <b>{{ s.remaining() | number: '1.2-2' }}</b>REM
        </div>
      </div>
    </div>`,
  styles: `
    .t { display: flex; align-items: center; gap: 10px; color: #fff; font-weight: 600; padding: 4px 8px; border-radius: 3px; min-height: 42px; }
    .t b { background: var(--d); min-width: 80px; text-align: center; padding: 5px 12px; border-radius: 3px; font-weight: 500; }
    .teal { background: #0fa886; --d: #00614e; }
    .orange { background: #e8790c; --d: #d84e0c; }
    .green { background: #54c157; --d: #1b6b1f; }
    .blue { background: #2196f3; --d: #0d47a1; }
    .red { background: #e53345; --d: #a50d1f; }
  `,
})
export class TotalsBar {
  s = inject(RegistrationStore);
}
