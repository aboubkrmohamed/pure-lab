import { BranchSummary } from './../../../../core/services/models/summary.model';
import { Component, effect, inject, model, signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SummaryService } from '../../../../core/services/summary-service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-subtotal',
  imports: [MatMenuModule, MatIconModule, MatButtonModule, MatTooltipModule,CommonModule],
  templateUrl: './user-subtotal.html',
  styleUrl: './user-subtotal.scss',
})
export class UserSubtotal {
  private service = inject(SummaryService);

  branchId = model<number | null>(null);
  data = signal<BranchSummary | null>(null);
  userIndex = signal(0);

  branches = [
    { id: null, name: 'All Branches' },
    { id: 1, name: 'فرع الإسماعيلية' },
    { id: 2, name: 'فرع بورسعيد' },
  ];

  constructor() {
    effect(() => {
      this.service.getSummary(this.branchId()).subscribe(d => {
        this.data.set(d);
        this.userIndex.set(0);
      });
    });
  }

  get currentBranchName() {
    return this.branches.find(b => b.id === this.branchId())?.name ?? 'All Branches';
  }

  get currentUser() {
    return this.data()?.users[this.userIndex()];
  }

  next() {
    const n = this.data()?.users.length ?? 0;
    if (this.userIndex() < n - 1) this.userIndex.update(i => i + 1);
  }

  prev() {
    if (this.userIndex() > 0) this.userIndex.update(i => i - 1);
  }

  backup() {
    this.service.downloadBackup().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pure-lab-backup-${new Date().toISOString().slice(0, 10)}.bak`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
