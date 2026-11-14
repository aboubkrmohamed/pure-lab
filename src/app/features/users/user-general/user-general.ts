import { AppUser } from './../../../core/services/models/user.model';
import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BRANCHES } from '../../../core/services/constants/branches.config';
@Component({
  selector: 'app-user-general',
  imports: [FormsModule],
  templateUrl: './user-general.html',
  styleUrl: './user-general.scss',
})
export class UserGeneral {
  user = model.required<AppUser>();
  branches = BRANCHES;

  patch(changes: Partial<AppUser>) {
    this.user.update(u => ({ ...u, ...changes }));
  }

  setDiscount(value: number | null) {
    const n = Math.min(100, Math.max(0, Number(value) || 0));
    this.patch({ discountPercent: n });
  }
}
