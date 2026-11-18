import { Injectable, effect, signal } from '@angular/core';

export type LabelSize = 'Large' | 'Medium' | 'Small';

export interface RegSettingsData {
  barcodePrinter: string;
  receiptPrinter: string;
  labelSize: LabelSize;
  defaultReferralTitle: string;
  labelTopMargin: number;
  labelLeftMargin: number;
  printServiceIp: string;
  autoFileLabels: string;
  autoprintLabel: boolean;
  autoprintReceipt: boolean;
  autoprintJoborder: boolean;
  a5Receipt: boolean;
  extraWideLabel: boolean;
  thermalReceipt: boolean;
  hideDeletedTests: boolean;
  autoContextSearch: boolean;
  voiceRecognition: boolean;
  joborderPage: boolean;
  sampleList: boolean;
}

export const DEFAULT_REG_SETTINGS: RegSettingsData = {
  barcodePrinter: '', receiptPrinter: '', labelSize: 'Large', defaultReferralTitle: '',
  labelTopMargin: 0, labelLeftMargin: 0, printServiceIp: '127.0.0.1', autoFileLabels: '',
  autoprintLabel: false, autoprintReceipt: false, autoprintJoborder: false, a5Receipt: false,
  extraWideLabel: false, thermalReceipt: false, hideDeletedTests: true, autoContextSearch: true,
  voiceRecognition: false, joborderPage: true, sampleList: true,
};

const KEY = 'pure-lab.reg-settings.v2';

@Injectable({ providedIn: 'root' })
export class RegSettings {
  readonly data = signal<RegSettingsData>(this.read());

  constructor() {
    effect(() => {
      try { localStorage.setItem(KEY, JSON.stringify(this.data())); } catch { /* تجاهل */ }
    });
  }

  patch(changes: Partial<RegSettingsData>) {
    this.data.update(d => ({ ...d, ...changes }));
  }

  reset() { this.data.set({ ...DEFAULT_REG_SETTINGS }); }

  private read(): RegSettingsData {
    try {
      return { ...DEFAULT_REG_SETTINGS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
    } catch { return { ...DEFAULT_REG_SETTINGS }; }
  }
}
