import { AppUser } from './models/user.model';
import { Observable, defer, delay, of } from 'rxjs';
import { Injectable, signal } from '@angular/core';

const mk = (id: number, fullName: string, username: string, isAdmin = false): AppUser => ({
  id, fullName, username, email: '', branchId: 1, discountPercent: 0,
  isAdmin, isActive: true, privileges: {}, roles: [],
});

const SEED: AppUser[] = [
  mk(72, 'مدير النظام', 'admin', true),
  mk(89, 'حسام محمد علي', 'hosam', true),
  mk(117, 'براء', 'bara'),
  mk(118, 'Mega', 'mega'),
  mk(119, 'مختبرات القضاة', 'kodat1'),
  mk(120, 'د/ مدحت الديب', 'medhat'),
  mk(121, 'مختبرات القضاة', 'kodat2'),
  mk(122, 'Amoun', 'amoun'),
  mk(123, 'مستخدم ميدلاب', 'medlab'),
  mk(124, 'مستخدم عادي', 'user124'),
  ...Array.from({ length: 6 }, (_, i) => mk(125 + i, `مستخدم تجريبي ${i + 1}`, `demo${i + 1}`)),
];

@Injectable({
  providedIn: 'root',
})
export class UsersService {

   private store = signal<AppUser[]>(SEED);
  readonly users = this.store.asReadonly();

  createEmpty(): AppUser {
    return {
      id: 0, fullName: '', username: '', email: '', branchId: 1,
      discountPercent: 0, isAdmin: false, isActive: true, privileges: {}, roles: [],
    };
  }

  isUsernameTaken(username: string, id: number): boolean {
    const name = username.trim().toLowerCase();
    return this.store().some(u => u.id !== id && u.username.toLowerCase() === name);
  }

  // id بيتولّد هنا دلوقتي، ومع الباك إند هيرجع من الـ database
  save(user: AppUser): Observable<AppUser> {
    return defer(() => {
      const saved = structuredClone(user);
      saved.fullName = saved.fullName.trim();
      saved.username = saved.username.trim();

      if (saved.id === 0) {
        saved.id = Math.max(0, ...this.store().map(u => u.id)) + 1;
        this.store.update(list => [...list, saved]);
      } else {
        this.store.update(list => list.map(u => (u.id === saved.id ? saved : u)));
      }
      return of(structuredClone(saved)).pipe(delay(300));
    });
  }

  setActive(id: number, isActive: boolean): Observable<AppUser> {
    return defer(() => {
      this.store.update(list => list.map(u => (u.id === id ? { ...u, isActive } : u)));
      return of(structuredClone(this.store().find(u => u.id === id)!)).pipe(delay(200));
    });
  }

}
