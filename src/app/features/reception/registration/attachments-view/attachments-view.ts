import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistrationStore } from '../registration.store';
import { RegHeader } from '../reg-header/reg-header';

const MAX_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-attachments-view',
  imports: [RegHeader],
  templateUrl: './attachments-view.html',
})
export class AttachmentsView {
  store = inject(RegistrationStore);
  private snack = inject(MatSnackBar);

  onFiles(e: Event) {
    const input = e.target as HTMLInputElement;
    for (const f of Array.from(input.files ?? [])) {
      if (f.size > MAX_BYTES) {
        this.snack.open(`${f.name} أكبر من 2 ميجا`, 'إغلاق', { duration: 2500 });
        continue;
      }
      const r = new FileReader();
      r.onload = () => this.store.addAttachment({ name: f.name, size: f.size, dataUrl: r.result as string });
      r.readAsDataURL(f);
    }
    input.value = '';
  }

  isImage(dataUrl: string) { return dataUrl.startsWith('data:image/'); }
  kb(n: number) { return Math.round(n / 1024); }
}
