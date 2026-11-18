import { RequestedTest } from './../../../../core/services/models/registration.model';
import { Component, computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Barcode } from '../../../../shared/components/barcode/barcode';
import { RegistrationStore } from '../registration.store';
interface SampleGroup {
  type: string; department: string; barcode: string; status: string; tests: RequestedTest[];
}

@Component({
  selector: 'app-samples-view',
  imports: [Barcode],
  templateUrl: './samples-view.html',
  styleUrl: './samples-view.scss',
})
export class SamplesView {
  store = inject(RegistrationStore);
  private snack = inject(MatSnackBar);

  readonly branchName = 'فرع الإسماعيلية';   // TODO: من بيانات اليوزر

  samples = computed<SampleGroup[]>(() => {
    const visitNo = this.store.visit().visitNo;
    const map = new Map<string, RequestedTest[]>();
    for (const t of this.store.tests()) map.set(t.sampleType, [...(map.get(t.sampleType) ?? []), t]);

    return [...map].map(([type, tests], i) => ({
      type, tests,
      department: tests[0].department,
      status: tests[0].status,
      barcode: visitNo ? (i === 0 ? `0${visitNo}` : `0${visitNo}${i + 1}`) : '',
    }));
  });

  soon(what: string) {
    this.snack.open(`${what}: قريبًا`, 'إغلاق', { duration: 1500 });
  }
}
