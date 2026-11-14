import { AppUser } from './../../../core/services/models/user.model';
import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { UsersService } from '../../../core/services/users-service';
@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {

 private service = inject(UsersService);

  selectedId = input<number | null>(null);
  draftName = input<string | null>(null);   // لو فيه يوزر جديد لسه ماتحفظش
  selected = output<AppUser>();
  add = output<void>();

  readonly pageSize = 10;
  search = signal('');
  page = signal(0);

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.service.users().filter(u =>
      !q ||
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      String(u.id).includes(q));
  });

  pages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));

  rows = computed(() => {
    const start = this.page() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  constructor() {
    // لما يتحفظ يوزر جديد، نروح للصفحة اللي هو فيها
    effect(() => {
      const id = this.selectedId();
      if (!id) return;
      const idx = untracked(() => this.filtered()).findIndex(u => u.id === id);
      if (idx > -1) untracked(() => this.page.set(Math.floor(idx / this.pageSize)));
    });
  }

  onSearch(value: string) {
    this.search.set(value);
    this.page.set(0);
  }

  prev() { if (this.page() > 0) this.page.update(p => p - 1); }
  next() { if (this.page() < this.pages() - 1) this.page.update(p => p + 1); }
}
