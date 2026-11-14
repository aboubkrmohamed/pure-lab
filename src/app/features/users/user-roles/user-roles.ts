import { CommonModule } from '@angular/common';
import { ROLES } from '../../../core/services/constants/privileges.config';
import { AppUser } from './../../../core/services/models/user.model';
import { Component ,model } from '@angular/core';
@Component({
  selector: 'app-user-roles',
  imports: [CommonModule],
  templateUrl: './user-roles.html',
  styleUrl: './user-roles.scss',
})
export class UserRoles {
  user = model.required<AppUser>();
  roles = ROLES;

  has(key: string): boolean {
    return this.user().roles.includes(key);
  }

  toggle(key: string, on: boolean) {
    this.user.update(u => ({
      ...u,
      roles: on ? [...new Set([...u.roles, key])] : u.roles.filter(r => r !== key),
    }));
  }
}
