import { BranchSummary } from './../../../core/services/models/summary.model';
import { Component, effect, inject, model, signal } from '@angular/core';
import { UserSubtotal } from './user-subtotal/user-subtotal';
import { DailyStats } from './daily-stats/daily-stats';
import { ActiveUsers } from './active-users/active-users';
import { PatientsTrend } from './patients-trend/patients-trend';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-summary',
  imports: [UserSubtotal, DailyStats, ActiveUsers, PatientsTrend,CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary {
  branchId = signal<number | null>(null);

}
