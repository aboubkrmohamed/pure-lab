import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';

export interface DiscountResult { value: number; percentage: boolean; }

@Component({
  selector: 'app-discount-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule,CommonModule, MatSlideToggleModule],
  template: `
    <h2 mat-dialog-title>INSTALL DISCOUNT</h2>
    <mat-dialog-content>
      <mat-slide-toggle [(ngModel)]="percentage">Percentage</mat-slide-toggle>
      <mat-form-field class="w-100 mt-3">
        <mat-label>Amount to discount</mat-label>
        <input matInput type="number" min="0" [(ngModel)]="value" (keydown.enter)="add()" cdkFocusInitial />
        @if (percentage) { <span matTextSuffix>%</span> }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close()">CANCEL</button>
      <button mat-button (click)="add()">ADD</button>
    </mat-dialog-actions>`,
})
export class DiscountDialog {
  ref = inject<MatDialogRef<DiscountDialog, DiscountResult>>(MatDialogRef);
  percentage = false;
  value: number | null = null;

  add() {
    const v = Number(this.value);
    if (v > 0) this.ref.close({ value: v, percentage: this.percentage });
  }
}
