import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LabelSize, RegSettings, RegSettingsData } from '../../../../core/services/reg-settings';
import { RegHeader } from '../reg-header/reg-header';

type TextKey = 'barcodePrinter' | 'receiptPrinter' | 'defaultReferralTitle' | 'printServiceIp' | 'autoFileLabels';
type NumKey = 'labelTopMargin' | 'labelLeftMargin';
type BoolKey = { [K in keyof RegSettingsData]: RegSettingsData[K] extends boolean ? K : never }[keyof RegSettingsData];

@Component({
  selector: 'app-settings-view',
  imports: [RegHeader],
  templateUrl: './settings-view.html',
  styleUrl: './settings-view.scss',
})
export class SettingsView {
  s = inject(RegSettings);
  private snack = inject(MatSnackBar);

  sizes: LabelSize[] = ['Large', 'Medium', 'Small'];

  toggles: { key: BoolKey; label: string }[] = [
    { key: 'autoprintLabel', label: 'Autoprint Label' },
    { key: 'autoprintReceipt', label: 'Autoprint Receipt' },
    { key: 'autoprintJoborder', label: 'Autoprint Joborder' },
    { key: 'a5Receipt', label: 'A5 Receipt' },
    { key: 'extraWideLabel', label: 'Extra Wide Label' },
    { key: 'thermalReceipt', label: 'Thermal Receipt' },
    { key: 'hideDeletedTests', label: 'Hide Deleted Tests' },
    { key: 'autoContextSearch', label: 'Auto Context Search' },
    { key: 'voiceRecognition', label: 'Voice Recognition' },
    { key: 'joborderPage', label: 'Joborder page' },
    { key: 'sampleList', label: 'Sample list' },
  ];

  setText(k: TextKey, e: Event) { this.s.patch({ [k]: (e.target as HTMLInputElement).value }); }
  setNum(k: NumKey, e: Event) { this.s.patch({ [k]: Number((e.target as HTMLInputElement).value) || 0 }); }
  setSize(e: Event) { this.s.patch({ labelSize: (e.target as HTMLSelectElement).value as LabelSize }); }
  setBool(k: BoolKey, e: Event) { this.s.patch({ [k]: (e.target as HTMLInputElement).checked }); }

  soon(what: string) { this.snack.open(`${what}: قريبًا (محتاج Print Service على الجهاز)`, 'إغلاق', { duration: 2200 }); }

  refreshLists() {
    this.snack.open('تم تحديث القوائم', 'إغلاق', { duration: 1500 });
  }
}
