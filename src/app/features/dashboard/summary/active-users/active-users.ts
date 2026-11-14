import { ActiveUser } from './../../../../core/services/models/summary.model';
import { Component, inject, signal, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SummaryService } from '../../../../core/services/summary-service';
@Component({
  selector: 'app-active-users',
  imports: [MatSnackBarModule],
  templateUrl: './active-users.html',
  styleUrl: './active-users.scss',
})
export class ActiveUsers implements OnInit {
  private service = inject(SummaryService);
  private snack = inject(MatSnackBar);

  users = signal<ActiveUser[]>([]);

  ngOnInit() { this.load(); }

  load() {
    this.service.getActiveUsers().subscribe(u => this.users.set(u));
  }

  logout(u: ActiveUser) {
    if (!confirm(`تسجيل خروج ${u.fullName}؟`)) return;
    this.service.logoutUser(u.id).subscribe(() => {
      this.load();
      this.snack.open('تم تسجيل خروج المستخدم', 'إغلاق', { duration: 2000 });
    });
  }
}
