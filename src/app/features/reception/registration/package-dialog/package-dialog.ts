import { TestPackage } from './../../../../core/services/models/registration.model';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
// import { TestPackage } from '../../../../core/models/registration.model';
@Component({
  selector: 'app-package-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title><i class="fa-solid fa-paperclip text-danger"></i> {{ pkg.name }}</h2>
    <mat-dialog-content>
      <p class="text-muted">Total Price: {{ total }}</p>
      @for (it of pkg.items; track it.test.id) {
        <div>
          {{ it.test.name }}
          @if (it.free) { <span class="text-success">(Free)</span> }
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">DISAGREE</button>
      <button mat-button [mat-dialog-close]="true">AGREE</button>
    </mat-dialog-actions>`,
})
export class PackageDialog {
  pkg = inject<TestPackage>(MAT_DIALOG_DATA);
  total = this.pkg.items.filter(i => !i.free).reduce((s, i) => s + i.test.price, 0);
}
