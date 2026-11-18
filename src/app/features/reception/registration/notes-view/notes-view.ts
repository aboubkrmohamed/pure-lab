import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrationStore } from '../registration.store';
import { RegHeader } from '../reg-header/reg-header';

@Component({
  selector: 'app-notes-view',
  imports: [DatePipe, FormsModule, RegHeader],
  templateUrl: './notes-view.html',
})
export class NotesView {
  store = inject(RegistrationStore);
  text = signal('');

  add() {
    const t = this.text().trim();
    if (!t) return;
    this.store.addNote(t);
    this.text.set('');
  }
}
