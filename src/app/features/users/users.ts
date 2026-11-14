import { AppUser } from './../../core/services/models/user.model';
import { Component, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersService } from '../../core/services/users-service';
import { UsersList } from './users-list/users-list';
import { UserGeneral } from './user-general/user-general';
import { UserPrivileges } from './user-privileges/user-privileges';
import { UserRoles } from './user-roles/user-roles';
@Component({
  selector: 'app-users',
  imports: [MatTabsModule, MatSnackBarModule, UsersList, UserGeneral, UserPrivileges, UserRoles],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
private service = inject(UsersService);
  private snack = inject(MatSnackBar);

  // نسخة شغّالة من اليوزر المختار (التعديلات عليها ومابتتحفظش غير بالـ Save)
  draft = signal<AppUser | null>(null);

  select(u: AppUser) {
    this.draft.set(structuredClone(u));
  }

  addNew() {
    this.draft.set(this.service.createEmpty());
  }

  save() {
    const d = this.draft();
    if (!d) return;

    if (!d.fullName.trim() || !d.username.trim()) {
      this.snack.open('الاسم واسم المستخدم مطلوبين', 'إغلاق', { duration: 2500 });
      return;
    }
    if (this.service.isUsernameTaken(d.username, d.id)) {
      this.snack.open('اسم المستخدم موجود قبل كده', 'إغلاق', { duration: 2500 });
      return;
    }

    const isNew = d.id === 0;
    this.service.save(d).subscribe(saved => {
      this.draft.set(structuredClone(saved));
      this.snack.open(
        isNew ? `تم إنشاء المستخدم برقم ${saved.id}` : 'تم حفظ التعديلات',
        'إغلاق', { duration: 2500 });
    });
  }

  toggleActive() {
    const d = this.draft();
    if (!d || d.id === 0) return;
    this.service.setActive(d.id, !d.isActive).subscribe(u => {
      this.draft.update(x => (x ? { ...x, isActive: u.isActive } : x));
      this.snack.open(u.isActive ? 'تم تفعيل المستخدم' : 'تم إيقاف المستخدم', 'إغلاق', { duration: 2000 });
    });
  }

  refresh() {
    const d = this.draft();
    if (!d) return;
    if (d.id === 0) return this.addNew();
    const original = this.service.users().find(u => u.id === d.id);
    if (original) this.select(original);
  }
}
