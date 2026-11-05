import { Branch } from './../module-card.model';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Branches } from '../../../../core/services/branches';
@Component({
  selector: 'app-branch-settings',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule,
    MatCheckboxModule, MatButtonModule, MatPaginatorModule, MatSnackBarModule,
  ],
  templateUrl: './branch-settings.html',
  styleUrl: './branch-settings.scss',
})
export class BranchSettings implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(Branches);
  private snack = inject(MatSnackBar);

  branches = signal<Branch[]>([]);
  pageIndex = signal(0);
  saving = signal(false);

  receiptStyles = [
    { value: 'with-prices', label: 'Show services with prices' },
    { value: 'without-prices', label: 'Show services without prices' },
    { value: 'hidden', label: 'Hide services' },
  ];

  form = this.fb.group({
    receiptStyle: [null as string | null],
    footer1: [''],
    footer2: [''],
    footer3: [''],
    printDailySerial: [false],
  });

  headerImage: string | null = null;

  get currentBranch(): Branch | undefined {
    return this.branches()[this.pageIndex()];
  }

  ngOnInit() {
    this.service.getBranches().subscribe(list => {
      this.branches.set(list);
      this.loadBranch();
    });
  }

  onPageChange(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.loadBranch();
  }

  private loadBranch() {
    const b = this.currentBranch;
    if (!b) return;
    this.form.patchValue({
      receiptStyle: b.receiptStyle,
      footer1: b.footer1,
      footer2: b.footer2,
      footer3: b.footer3,
      printDailySerial: b.printDailySerial,
    });
    this.headerImage = b.headerImage;
  }

  onHeaderSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (this.headerImage = reader.result as string);
    reader.readAsDataURL(file);
  }

  removeHeader() {
    this.headerImage = null;
  }

  save() {
    const b = this.currentBranch;
    if (!b) return;
    const updated: Branch = {
      ...b,
      ...(this.form.getRawValue() as Partial<Branch>),
      headerImage: this.headerImage,
    };
    this.saving.set(true);
    this.service.saveBranch(updated).subscribe(() => {
      const list = [...this.branches()];
      list[this.pageIndex()] = updated;
      this.branches.set(list);
      this.saving.set(false);
      this.snack.open('تم حفظ الإعدادات', 'إغلاق', { duration: 2500 });
    });
  }

}
