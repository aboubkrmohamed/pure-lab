import { BranchSummary } from './../../../../core/services/models/summary.model';
import { Component, effect, inject, input, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SummaryService } from '../../../../core/services/summary-service';
@Component({
  selector: 'app-daily-stats',
  imports: [MatTabsModule],
  templateUrl: './daily-stats.html',
  styleUrl: './daily-stats.scss',
})
export class DailyStats {
  private service = inject(SummaryService);

  branchId = input<number | null>(null);
  data = signal<BranchSummary | null>(null);

  constructor() {
    effect(() => {
      this.service.getSummary(this.branchId()).subscribe(d => this.data.set(d));
    });
  }
}
