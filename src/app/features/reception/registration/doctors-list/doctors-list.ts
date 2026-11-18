import { Doctor } from './../../../../core/services/models/registration.model';
// import {  } from './../../../../core/services/models/registration.model';
import { Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap } from 'rxjs';
import { RegistrationApi } from '../../../../core/services/registration-api';
import { RegistrationStore } from '../registration.store';
@Component({
  selector: 'app-doctors-list',
  template: `
    <div class="shadow-sm rounded overflow-hidden">
      <div class="d-flex justify-content-between align-items-center bg-primary text-white px-3 py-2">
        <b>اختار الإحالة</b>
        <button class="btn btn-sm text-white" (click)="store.closeDoctors()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      @for (d of doctors(); track d.id) {
        <button type="button" class="doc w-100 border-0 d-flex align-items-center justify-content-between px-3 py-2"
                (click)="store.selectDoctor(d)">
          <span><i class="fa-solid fa-user-doctor me-2"></i>{{ d.name }}</span>
          <small>{{ d.title }}</small>
        </button>
      } @empty {
        <div class="p-4 text-center text-muted bg-white">مفيش نتائج</div>
      }
    </div>`,
  styles: `
    .doc { background: #1e5fa8; color: #fff; border-bottom: 1px solid rgba(255,255,255,.35) !important; }
    .doc:hover { background: #2a74c4; }
  `,
})
export class DoctorsList {
  store = inject(RegistrationStore);
  private api = inject(RegistrationApi);

  doctors = toSignal(
    toObservable(this.store.doctorQuery).pipe(
      debounceTime(150),
      switchMap(q => this.api.searchDoctors(q))),
    { initialValue: [] as Doctor[] });
}
