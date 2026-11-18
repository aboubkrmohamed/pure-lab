import { Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistrationStore } from '../registration.store';
import { TotalsBar } from '../totals-bar/totals-bar';
import { DiscountDialog, DiscountResult } from '../discount-dialog/discount-dialog';

@Component({
  selector: 'app-payments-view',
  imports: [DatePipe, FormsModule, TotalsBar],
  templateUrl: './payments-view.html',
  styleUrl: './payments-view.scss',
})
export class PaymentsView {
  store = inject(RegistrationStore);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  amount = signal<number | null>(null);
  amountEl = viewChild<ElementRef<HTMLInputElement>>('amountEl');

  constructor() {
    afterNextRender(() => this.amountEl()?.nativeElement.focus());
  }

  payCash() { this.pay('cash'); }
  payCard() { this.pay('card'); }

  private pay(method: 'cash' | 'card') {
    const raw = this.amount();
    if (!raw && method === 'cash') return;                       // Enter على خانة فاضية: مفيش حاجة
    const value = raw ? Number(raw) : this.store.remaining();   // فيزا من غير مبلغ = كل المتبقي
    const error = this.store.addPayment(value, method);
    if (error) { this.snack.open(error, 'إغلاق', { duration: 2000 }); return; }
    this.amount.set(null);
    this.amountEl()?.nativeElement.focus();
  }

  openDiscount() {
    this.dialog.open<DiscountDialog, void, DiscountResult>(DiscountDialog, { width: '420px' })
      .afterClosed().subscribe(r => {
        if (!r) return;
        const error = this.store.addDiscount(r.value, r.percentage);
        if (error) this.snack.open(error, 'إغلاق', { duration: 2200 });
      });
  }

  remove(id: number) {
    if (confirm('حذف السجل ده؟')) this.store.removePayment(id);
  }
}
