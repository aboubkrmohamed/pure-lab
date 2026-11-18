// import { Doctor } from './../../../core/services/models/registration.model';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { merge, Observable, tap } from 'rxjs';
import {Doctor, LabTest, PaymentEntry, RequestedTest,
  TestPackage,PricePlan, SavedVisit, VisitInfo,AttachmentFile,ServiceItem,VisitNote} from './../../../core/services/models/registration.model';
import { RegistrationApi } from '../../../core/services/registration-api';
import { ageFrom ,birthFrom} from '../../../core/services/utils/age';


import { RegSettings } from '../../../core/services/reg-settings';



export type RegView =
  | 'main' | 'tests' | 'payments' | 'samples' | 'price-plans' | 'notes' | 'services'
  | 'questions' | 'user-summary' | 'attachments' | 'payments-report' | 'settings';

export const VIEW_TITLES: Partial<Record<RegView, string>> = {
  tests: 'اختيار التحاليل', payments: 'المدفوعات', samples: 'العينات',
  'price-plans': 'خطط الأسعار', notes: 'الملاحظات', services: 'الخدمات',
  questions: 'الأسئلة', 'user-summary': 'ملخص المستخدم', attachments: 'المرفقات',
  'payments-report': 'تقرير المدفوعات', settings: 'الإعدادات',
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const EMPTY_VISIT: VisitInfo = { visitNo: 0, dailyNo: 0, fileNo: 0 };

@Injectable()
export class RegistrationStore {
  private fb = inject(FormBuilder);
  private api = inject(RegistrationApi);

  readonly currentUser = 'hosam';
  readonly maxDiscountPercent = 100;

  readonly view = signal<RegView>('main');
  readonly showDoctors = signal(false);
  readonly doctorQuery = signal('');
  readonly referralFocus = signal(0);
  readonly locked = signal(false);

  readonly patientForm = this.fb.nonNullable.group({
    fullName: '', gender: 'ذكر', title: '',
    ageYears: 0, ageMonths: 0, ageDays: 0, birthDate: '',
    phone: '', nationality: '', nationalId: '', passport: '', address: '',
  });

  readonly referralForm = this.fb.nonNullable.group({
    doctorId: this.fb.nonNullable.control<number | null>(null),
    title: '', name: '',
    priceListId: this.fb.nonNullable.control<number | null>(null),
    priceListName: '', priceCategory: '',
    relation: '', contracted: '', treatmentCardNo: '',
  });
  private settings = inject(RegSettings);

  readonly visit = signal<VisitInfo>({ ...EMPTY_VISIT });
  readonly tests = signal<RequestedTest[]>([]);
  readonly payments = signal<PaymentEntry[]>([]);
  readonly priority = signal('Routine');
  private paymentSeq = 1;
    // private paymentSeq = 1;
  readonly isSaved = computed(() => this.visit().visitNo > 0);
  readonly total = computed(() =>
    round2(this.tests().reduce((s, x) => s + x.price, 0) + this.services().reduce((s, x) => s + x.price, 0)));  readonly discount = computed(() => this.sum('discount'));
  readonly paid = computed(() => this.sum('payment'));
  readonly remaining = computed(() => round2(this.total() - this.discount() - this.paid()));

  constructor() {
    const f = this.patientForm.controls;

    f.birthDate.valueChanges.pipe(takeUntilDestroyed()).subscribe(b => {
      const a = b ? ageFrom(b) : null;
      if (a) this.patientForm.patchValue({ ageYears: a.y, ageMonths: a.m, ageDays: a.d }, { emitEvent: false });
    });

    merge(f.ageYears.valueChanges, f.ageMonths.valueChanges, f.ageDays.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        const v = this.patientForm.getRawValue();
        f.birthDate.setValue(birthFrom(+v.ageYears || 0, +v.ageMonths || 0, +v.ageDays || 0), { emitEvent: false });
      });
  }

    readonly notes = signal<VisitNote[]>([]);
  readonly services = signal<ServiceItem[]>([]);
  readonly answers = signal<Record<number, string>>({});
  readonly attachments = signal<AttachmentFile[]>([]);
  private seq = 1;


  private sum(kind: PaymentEntry['kind']) {
    return round2(this.payments().filter(p => p.kind === kind).reduce((s, p) => s + p.amount, 0));
  }

  go(view: RegView) { this.view.set(view); }

  openDoctors(query: string) { this.doctorQuery.set(query); this.showDoctors.set(true); }
  closeDoctors() { this.showDoctors.set(false); }

  selectDoctor(d: Doctor) {
    this.referralForm.patchValue({ doctorId: d.id, title: d.title, name: d.name });
    this.showDoctors.set(false);
    this.referralFocus.update(n => n + 1);
  }

  addTest(t: LabTest, price = t.price): boolean {
    if (this.locked() || this.tests().some(x => x.id === t.id)) return false;
    this.tests.update(list => [...list, { ...t, price, status: 'ordered' }]);
    return true;
  }

  removeTest(id: number) {
    if (this.locked()) return;
    this.tests.update(list => list.filter(x => x.id !== id));
  }



    addNote(text: string) {
    this.notes.update(l => [...l, { id: Date.now() + this.seq++, text, user: this.currentUser, date: new Date().toISOString() }]);
  }
  removeNote(id: number) { this.notes.update(l => l.filter(n => n.id !== id)); }

  addService(s: ServiceItem): boolean {
    if (this.locked() || this.services().some(x => x.id === s.id)) return false;
    this.services.update(l => [...l, s]);
    return true;
  }
  removeService(id: number) {
    if (this.locked()) return;
    this.services.update(l => l.filter(x => x.id !== id));
  }

  setAnswer(id: number, value: string) { this.answers.update(a => ({ ...a, [id]: value })); }

  addAttachment(f: Omit<AttachmentFile, 'id'>) {
    this.attachments.update(l => [...l, { ...f, id: Date.now() + this.seq++ }]);
  }
  removeAttachment(id: number) { this.attachments.update(l => l.filter(x => x.id !== id)); }

    /** بيضيف تحاليل الباكج، والمجاني بيتحط بسعر 0. بيرجّع عدد اللي اتضاف */
  addPackage(p: TestPackage): number {
    if (this.locked()) return 0;
    let n = 0;
    for (const it of p.items) {
      if (this.addTest(it.test, it.free ? 0 : it.test.price)) n++;
    }
    return n;
  }

  applyPlan(plan: PricePlan, category: string): boolean {
    if (this.locked()) return false;
    this.referralForm.patchValue({
      priceListId: plan.id, priceListName: plan.name, priceCategory: category,
    });
    this.view.set('main');
    return true;
  }

  addPayment(amount: number, method: 'cash' | 'card' = 'cash'): string | null {
    if (!(amount > 0)) return 'اكتب مبلغ صحيح';
    if (amount > this.remaining()) return 'المبلغ أكبر من المتبقي';
    this.push('payment', method, amount);
    return null;
  }

  addDiscount(value: number, percentage: boolean): string | null {
    const amount = percentage ? Math.round(this.total() * value) / 100 : value;
    if (!(amount > 0)) return 'قيمة الخصم غير صحيحة';
    if (amount > this.remaining()) return 'الخصم أكبر من المتبقي';
    if (this.discount() + amount > (this.total() * this.maxDiscountPercent) / 100)
      return 'الخصم أكبر من الحد المسموح لك';
    this.push('discount', 'cash', amount);
    return null;
  }

  removePayment(id: number) { this.payments.update(l => l.filter(p => p.id !== id)); }

  private push(kind: PaymentEntry['kind'], method: PaymentEntry['method'], amount: number) {
    this.payments.update(l => [...l, {
      id: this.paymentSeq++, kind, method, amount,
      date: new Date().toISOString(), user: this.currentUser,
    }]);
  }

  isDirty(): boolean {
    return !this.isSaved() && (this.tests().length > 0 || this.services().length > 0 || this.patientForm.dirty);
  }
  validate(): string | null {
    if (!this.patientForm.getRawValue().fullName.trim()) return 'اكتب اسم المريض';
    if (!this.tests().length) return 'اختار تحليل واحد على الأقل';
    return null;
  }

  save(): Observable<SavedVisit> {
    const payload: SavedVisit = {
      visit: this.visit(),
      patient: this.patientForm.getRawValue(),
      referral: this.referralForm.getRawValue(),
      tests: this.tests(),
      payments: this.payments(),
      priority: this.priority(),
      notes: this.notes(),
      services: this.services(),
      answers: this.answers(),
      attachments: this.attachments(),
    };
    return this.api.saveVisit(payload).pipe(tap(v => this.applySaved(v)));
  }

  applySaved(v: SavedVisit) {
    this.visit.set(v.visit);
    this.patientForm.reset(v.patient, { emitEvent: false });
    this.referralForm.reset(v.referral, { emitEvent: false });
        // this.referralForm.patchValue({ title: this.settings.data().defaultReferralTitle });
    this.tests.set(v.tests);
    this.payments.set(v.payments);
    this.priority.set(v.priority);
       this.notes.set(v.notes ?? []);
    this.services.set(v.services ?? []);
    this.answers.set(v.answers ?? {});
    this.attachments.set(v.attachments ?? []);
    this.view.set('main');
    this.showDoctors.set(false);
    this.setLocked(true);
  }

  newVisit() {
    this.visit.set({ ...EMPTY_VISIT });
    this.patientForm.reset();
    this.referralForm.reset();
    this.referralForm.patchValue({ title: this.settings.data().defaultReferralTitle });
    this.tests.set([]);
    this.payments.set([]);
    this.priority.set('Routine');
    this.notes.set([]);
    this.services.set([]);
    this.answers.set({});
    this.attachments.set([]);
    this.view.set('main');
    this.showDoctors.set(false);
    this.setLocked(false);
  }

  startEdit() { if (this.isSaved()) this.setLocked(false); }

  private setLocked(on: boolean) {
    this.locked.set(on);
    [this.patientForm, this.referralForm].forEach(f =>
      on ? f.disable({ emitEvent: false }) : f.enable({ emitEvent: false }));
  }

    /** زيارة جديدة لنفس المريض مع تحاليل آخر زيارة */
  repeatVisit(): boolean {
    if (!this.isSaved()) return false;
    const patient = this.patientForm.getRawValue();
    const referral = this.referralForm.getRawValue();
    const lastTests = this.tests().map(t => ({ ...t, status: 'ordered' as const }));
    const fileNo = this.visit().fileNo;

    this.newVisit();
    this.patientForm.patchValue(patient);
    this.referralForm.patchValue(referral);
    this.visit.set({ visitNo: 0, dailyNo: 0, fileNo });   // نفس رقم الملف
    this.tests.set(lastTests);
    return true;
  }
}
