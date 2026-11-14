import { GeneralSettingsModel } from './../../../../core/services/models/general-settings.model';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GeneralSettingsService } from '../../../../core/services/GeneralSettingsService';

@Component({
  selector: 'app-general-settings',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatSelectModule,
    MatCheckboxModule, MatSnackBarModule,
  ],  templateUrl: './general-settings.html',
  styleUrl: './general-settings.scss',
})
export class GeneralSettings implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(GeneralSettingsService);
  private snack = inject(MatSnackBar);

  saving = signal(false);

    flagStyles = [
    { value: 'none', label: 'No flags' },
    { value: 'hl-star', label: 'H L *' },
    { value: 'arrows', label: 'Arrows' },
    { value: 'star', label: '*' },
  ];

  form = this.fb.nonNullable.group({
    abnormalFlagStyle: ['hl-star'],
    samplingListPagePerSample: [false],
  });

  ngOnInit() {
    this.service.getSettings().subscribe(s => this.form.patchValue(s));
  }

  save() {
    this.saving.set(true);
    this.service
      .saveSettings(this.form.getRawValue() as GeneralSettingsModel)
      .subscribe(() => {
        this.saving.set(false);
        this.snack.open('تم حفظ التغييرات', 'إغلاق', { duration: 2500 });
      });
  }

}
