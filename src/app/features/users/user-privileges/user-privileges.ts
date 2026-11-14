import { AppUser , PrivilegeGroup} from './../../../core/services/models/user.model';
import { Component, computed, model, signal } from '@angular/core';
import { BRANCHES } from '../../../core/services/constants/branches.config';
import { PRIVILEGE_GROUPS,PRIVILEGES } from '../../../core/services/constants/privileges.config';


@Component({
  selector: 'app-user-privileges',
  imports: [],
  templateUrl: './user-privileges.html',
  styleUrl: './user-privileges.scss',
})
export class UserPrivileges{
  user = model.required<AppUser>();

  branches = BRANCHES;
  groups = PRIVILEGE_GROUPS;

  branchId = signal(BRANCHES[0].id);
  group = signal<PrivilegeGroup>('reg');

  visible = computed(() => PRIVILEGES.filter(p => p.group === this.group()));
  left = computed(() => this.visible().slice(0, 7));    // 7 في العمود زي الصورة
  right = computed(() => this.visible().slice(7));

  isChecked(key: string): boolean {
    return (this.user().privileges[this.branchId()] ?? []).includes(key);
  }

  setKey(key: string, on: boolean) {
    const cur = this.user().privileges[this.branchId()] ?? [];
    this.write(on ? [...new Set([...cur, key])] : cur.filter(k => k !== key));
  }

  checkAll() {
    const cur = this.user().privileges[this.branchId()] ?? [];
    this.write([...new Set([...cur, ...this.visible().map(p => p.key)])]);
  }

  uncheckAll() {
    const remove = new Set(this.visible().map(p => p.key));
    const cur = this.user().privileges[this.branchId()] ?? [];
    this.write(cur.filter(k => !remove.has(k)));
  }

  private write(keys: string[]) {
    this.user.update(u => ({
      ...u,
      privileges: { ...u.privileges, [this.branchId()]: keys },
    }));
  }
}
