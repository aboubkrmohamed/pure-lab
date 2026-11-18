import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Doctor, LabTest, Page, PricePlan, QuestionDef, SavedVisit, ServiceItem, TestPackage, UserSummary,
} from './models/registration.model';

const t = (id: number, code: number, name: string, price: number,
           sampleType = 'Serum', department = 'Clinical Chemistry'): LabTest =>
  ({ id, code, name, price, sampleType, department });

const TESTS: LabTest[] = [
  t(1, 0, '1,25-OH vitamin D-3', 11000, 'Serum', 'Hormones'),
  t(2, 44, '17 Ketosteroids in Urine (24 hrs)', 455, 'Urine', 'Clinical Chemistry'),
  t(3, 0, '17 OH progesterone', 170, 'Serum', 'Hormones'),
  t(4, 0, '17- Hydroxyprogesterone', 170, 'Serum', 'Hormones'),
  t(5, 30100, '1h. P.P blood glucose (100 gm glucose)', 30),
  t(6, 3050, '1h. P.P blood glucose (50 gm glucose)', 30),
  t(7, 1001, 'S.G.O.T (AST)', 50),
  t(8, 1002, 'S.G.P.T (ALT)', 50),
  t(9, 1003, 'Serum Creatinine', 30),
  t(10, 2001, 'T4', 80, 'Serum', 'Hormones'),
  t(11, 2002, 'T3', 80, 'Serum', 'Hormones'),
  t(12, 2003, 'TSH', 125, 'Serum', 'Hormones'),
  t(13, 3001, 'H. Pylori Ag', 150, 'Stool', 'Microbiology'),
  t(14, 4001, 'CBC', 60, 'Whole Blood', 'Hematology'),
];

const byId = (id: number) => TESTS.find(x => x.id === id)!;

const PACKAGES: TestPackage[] = [
  { id: 1, name: 'متابعة الحمل', items: [{ test: byId(14), free: false }] },
  { id: 2, name: 'Pre op Dr Mohamed Yousef', items: [{ test: byId(14), free: false }, { test: byId(9), free: false }] },
  { id: 3, name: 'THYROID package',
    items: [{ test: byId(10), free: true }, { test: byId(11), free: true }, { test: byId(12), free: false }] },
  { id: 4, name: 'kidney profile', items: [{ test: byId(9), free: false }, { test: byId(7), free: false }] },
];

const DOCTORS: Doctor[] = [
  { id: 1, title: 'أستاذ دكتور', name: 'رشا محمد عماد' },
  { id: 2, title: 'دكتور', name: 'محمد عبد الحميد مطاوع' },
  { id: 3, title: 'أستاذ دكتور', name: 'احمد عاطف' },
  { id: 4, title: 'أستاذ دكتور', name: 'صبحي رمضان' },
  { id: 5, title: 'أستاذ دكتور', name: 'احمد تاج الدين' },
  { id: 6, title: 'أستاذ دكتور', name: 'حاتم حسين محمد' },
  { id: 7, title: 'أستاذ دكتور', name: 'حسان مجدي سعيد' },
  { id: 8, title: 'أستاذة دكتورة', name: 'داليا محسوب' },
];
const SERVICES: ServiceItem[] = [
  { id: 1, name: 'سحب عينة منزلي', price: 100 },
  { id: 2, name: 'نسخة إضافية من النتيجة', price: 20 },
  { id: 3, name: 'نتيجة مستعجلة', price: 50 },
  { id: 4, name: 'شحن النتيجة', price: 30 },
];

const QUESTIONS: QuestionDef[] = [
  { id: 1, text: 'هل المريض صائم؟', type: 'yesno' },
  { id: 2, text: 'الأدوية الحالية', type: 'text' },
  { id: 3, text: 'هل المريضة حامل؟', type: 'yesno' },
  { id: 4, text: 'ملاحظات للمعمل', type: 'text' },
];

const PLAN_NAMES = [
  'أسعار أساسية', 'نادى الأمل للمسنين', 'نقابة المهندسين', 'وزارة الصحة', 'القضاة والمستشارين',
  'نقابة الأطباء', 'نقابة المعلمين', 'شركة المقاولون العرب',
  'شركة توزيع الكهرباء جنوب سيناء', 'شركة مصر للخليج لتصنيع الزيوت',
];
const PLANS: PricePlan[] = PLAN_NAMES.map((name, i) => ({
  id: i + 1, name, categories: i === 0 ? ['عادي'] : ['عضو', 'خلافه'],
}));

const paged = <T>(all: T[], page: number, size: number): Page<T> =>
  ({ items: all.slice(page * size, (page + 1) * size), total: all.length });

@Injectable({ providedIn: 'root' })
export class RegistrationApi {
  private visits: SavedVisit[] = [];
  private seq = { visit: 12201112, file: 1000, daily: 0 };

  searchTests(q: string, page: number, size: number): Observable<Page<LabTest>> {
    const s = q.trim().toLowerCase();
    const all = !s ? TESTS : TESTS.filter(x => x.name.toLowerCase().includes(s) || String(x.code).startsWith(s));
    return of(paged(all, page, size)).pipe(delay(120));
  }

  getPackages(): Observable<TestPackage[]> { return of(structuredClone(PACKAGES)).pipe(delay(120)); }

  searchDoctors(q: string): Observable<Doctor[]> {
    const s = q.trim();
    return of(!s ? DOCTORS : DOCTORS.filter(d => d.title.includes(s) || d.name.includes(s))).pipe(delay(120));
  }


    getServices(): Observable<ServiceItem[]> { return of(structuredClone(SERVICES)).pipe(delay(100)); }
  getQuestions(): Observable<QuestionDef[]> { return of(structuredClone(QUESTIONS)).pipe(delay(100)); }

  cancelVisit(visitNo: number): Observable<void> {
    this.visits = this.visits.filter(x => x.visit.visitNo !== visitNo);
    return of(void 0).pipe(delay(200));
  }

  getTodaySummary(): Observable<UserSummary> {
    let total = 0, discount = 0, paid = 0;
    for (const v of this.visits) {
      total += v.tests.reduce((s, t) => s + t.price, 0) + (v.services ?? []).reduce((s, x) => s + x.price, 0);
      for (const p of v.payments) {
        if (p.kind === 'discount') discount += p.amount; else paid += p.amount;
      }
    }
    return of({
      visits: this.visits.length, total, discount, paid,
      remaining: Math.round((total - discount - paid) * 100) / 100,
    }).pipe(delay(200));
  }




  getDoctor(id: number): Observable<Doctor | null> {
    return of(DOCTORS.find(d => d.id === id) ?? null).pipe(delay(100));
  }

  searchPlans(q: string, page: number, size: number): Observable<Page<PricePlan>> {
    const s = q.trim();
    return of(paged(!s ? PLANS : PLANS.filter(p => p.name.includes(s)), page, size)).pipe(delay(120));
  }

  saveVisit(v: SavedVisit): Observable<SavedVisit> {
    const saved = structuredClone(v);
    if (!saved.visit.visitNo) {
      saved.visit = {
        visitNo: ++this.seq.visit,
        dailyNo: ++this.seq.daily,
        fileNo: saved.visit.fileNo || ++this.seq.file,
      };
      this.visits.push(saved);
    } else {
      const i = this.visits.findIndex(x => x.visit.visitNo === saved.visit.visitNo);
      if (i > -1) this.visits[i] = saved;
    }
    return of(structuredClone(saved)).pipe(delay(250));
  }

  getLastVisit(): Observable<SavedVisit | null> {
    return of(structuredClone(this.visits.at(-1) ?? null));
  }

  getVisit(visitNo: number): Observable<SavedVisit | null> {
    return of(structuredClone(this.visits.find(x => x.visit.visitNo === visitNo) ?? null));
  }

  getNeighbour(visitNo: number, dir: 1 | -1): Observable<SavedVisit | null> {
    const idx = visitNo ? this.visits.findIndex(x => x.visit.visitNo === visitNo) : this.visits.length;
    return of(structuredClone(this.visits[idx + dir] ?? null));
  }
}
