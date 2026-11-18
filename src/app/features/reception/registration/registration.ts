import { Component, HostListener, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToolbarService } from '../../../core/services/toolbar-service';
import { RegistrationStore, VIEW_TITLES } from './registration.store';
import { VisitBar } from './visit-bar/visit-bar';
import { PatientForm } from './patient-form/patient-form';
import { DoctorsList } from './doctors-list/doctors-list';
import { RequestsPanel } from './requests-panel/requests-panel';
import { effect } from '@angular/core';
import { TestsView } from './tests-view/tests-view';
import { PaymentsView } from './payments-view/payments-view';
import { PricePlansView } from './price-plans-view/price-plans-view';
import { SamplesView } from './samples-view/samples-view';
import { NotesView } from './notes-view/notes-view';
import { ServicesView } from './services-view/services-view';
import { QuestionsView } from './questions-view/questions-view';
import { AttachmentsView } from './attachments-view/attachments-view';
import { UserSummaryView } from './user-summary-view/user-summary-view';
import { PaymentsReportView } from './payments-report-view/payments-report-view';
import { SettingsView } from './settings-view/settings-view';
import { RegSettings } from '../../../core/services/reg-settings';
import { RegistrationApi } from '../../../core/services/registration-api';
@Component({
  selector: 'app-registration',
  imports: [VisitBar, PatientForm, DoctorsList, RequestsPanel,TestsView, PaymentsView,
    PricePlansView, SamplesView,   VisitBar, PatientForm, DoctorsList, RequestsPanel,
    TestsView, PaymentsView, PricePlansView, SamplesView,
    NotesView, ServicesView, QuestionsView, AttachmentsView,
    UserSummaryView, PaymentsReportView, SettingsView,
  ],
  providers: [RegistrationStore],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration implements OnInit, OnDestroy {
  store = inject(RegistrationStore);
  private toolbar = inject(ToolbarService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);
  private settings = inject(RegSettings);
  title = computed(() => VIEW_TITLES[this.store.view()] ?? '');
  private api = inject(RegistrationApi);
  ngOnInit() {
    this.toolbar.set([
      { icon: 'fa-floppy-disk', tooltip: 'حفظ (Ctrl+S)', run: () => this.save() },
      { icon: 'fa-plus', tooltip: 'مريض جديد', run: () => this.newPatient() },
      { icon: 'fa-magnifying-glass', tooltip: 'بحث', run: () => this.router.navigate(['/reception/search']) },
      { icon: 'fa-gear', tooltip: 'الإعدادات', run: () => this.store.go('settings') },
    ]);
  }

  ngOnDestroy() { this.toolbar.clear(); }


    @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    // Ctrl+S لسه شغال
    if (e.ctrlKey && e.key.toLowerCase() === 's') { e.preventDefault(); this.save(); return; }

    const actions: Record<string, () => void> = {
      F1: () => this.store.go('main'),
      F2: () => this.store.go('tests'),
      F3: () => this.store.go('payments'),
      F4: () => this.printIfSaved('label'),
      F5: () => this.printIfSaved('receipt'),
      F6: () => this.printIfSaved('joborder'),
      F7: () => this.newPatient(),
      F8: () => this.loadLast(),
      F10: () => this.save(),
      F11: () => this.repeat(),
      F12: () => this.router.navigate(['/reception/search']),
    };

    const run = actions[e.key];
    if (!run) return;
    e.preventDefault();
    e.stopPropagation();
    run();
  }

  private loadLast() {
    this.api.getLastVisit().subscribe(v => v
      ? this.store.applySaved(v)
      : this.snack.open('مفيش زيارات متسجلة', 'إغلاق', { duration: 1800 }));
  }

  private repeat() {
    if (!this.store.repeatVisit())
      this.snack.open('F11 بيشتغل على مريض محفوظ بس', 'إغلاق', { duration: 2200 });
    else
      this.snack.open('زيارة جديدة بنفس تحاليل آخر زيارة', 'إغلاق', { duration: 2200 });
  }

  private printIfSaved(kind: 'label' | 'receipt' | 'joborder') {
    if (!this.store.isSaved()) {
      this.snack.open('احفظ الزيارة الأول (F10)', 'إغلاق', { duration: 1800 });
      return;
    }
    this.printJob(kind);
  }

  constructor() {
    effect(() => {
      const saveBtn = { icon: 'fa-floppy-disk', tooltip: 'حفظ (Ctrl+S)', run: () => this.save() };
      this.toolbar.set(this.store.view() === 'main'
        ? [
            saveBtn,
            { icon: 'fa-plus', tooltip: 'مريض جديد', run: () => this.newPatient() },
            { icon: 'fa-magnifying-glass', tooltip: 'بحث', run: () => this.router.navigate(['/reception/search']) },
            { icon: 'fa-gear', tooltip: 'الإعدادات', run: () => this.store.go('settings') },
          ]
        : [saveBtn]);
    });
  }




  save() {
    const error = this.store.validate();
    if (error) { this.snack.open(error, 'إغلاق', { duration: 2500 }); return; }

    this.store.save().subscribe(v => {
      this.snack.open(`تم الحفظ - رقم الزيارة ${v.visit.visitNo}`, 'إغلاق', { duration: 3000 });
      this.autoPrint();
    });
  }

  /** الـ 3 اللي بيتطبعوا تلقائي بعد الحفظ حسب الإعدادات */
  private autoPrint() {
    const s = this.settings.data();
    if (s.autoprintLabel) this.printJob('label');
    if (s.autoprintReceipt) this.printJob('receipt');
    if (s.autoprintJoborder) this.printJob('joborder');
  }

  private printJob(kind: 'label' | 'receipt' | 'joborder') {
    // TODO: إرسال الأمر لـ Print Service على printServiceIp (لازم تتفق مع الباك إند / برنامج الطباعة)
    console.log('PRINT', kind, this.settings.data().printServiceIp);
  }
  newPatient() {
    if (this.store.isDirty() && !confirm('فيه بيانات ماتحفظتش، تكمل؟')) return;
    this.store.newVisit();
  }


}
