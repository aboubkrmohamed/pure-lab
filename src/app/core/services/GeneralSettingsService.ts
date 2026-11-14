import { GeneralSettingsModel } from './models/general-settings.model';
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class GeneralSettingsService {
  private settings: GeneralSettingsModel = {
    abnormalFlagStyle: 'hl-star',
    samplingListPagePerSample: false,
  };

  getSettings(): Observable<GeneralSettingsModel> {
    return of({ ...this.settings }).pipe(delay(300));
  }

  saveSettings(s: GeneralSettingsModel): Observable<GeneralSettingsModel> {
    this.settings = { ...s };
    return of(s).pipe(delay(300));
  }
}
