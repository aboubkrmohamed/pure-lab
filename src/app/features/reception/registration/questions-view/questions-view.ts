import { QuestionDef } from './../../../../core/services/models/registration.model';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RegistrationApi } from '../../../../core/services/registration-api';
import { RegistrationStore } from '../registration.store';
import { RegHeader } from '../reg-header/reg-header';
@Component({
  selector: 'app-questions-view',
  imports: [RegHeader],
  templateUrl: './questions-view.html',
})
export class QuestionsView {
  store = inject(RegistrationStore);
  questions = toSignal(inject(RegistrationApi).getQuestions(), { initialValue: [] as QuestionDef[] });
}
