import { Component, inject, input } from '@angular/core';
import { RegistrationStore } from '../registration.store';

@Component({
  selector: 'app-reg-header',
  template: `
    <div class="d-flex align-items-center gap-2 p-2 bg-light border-bottom">
      <button class="rbtn teal" title="الرئيسية" (click)="store.go('main')"><i class="fa-solid fa-house"></i></button>
      <h5 class="m-0 flex-grow-1 text-center fw-bold">{{ title() }}</h5>
      <ng-content />
    </div>`,
})
export class RegHeader {
  store = inject(RegistrationStore);
  title = input.required<string>();
}
