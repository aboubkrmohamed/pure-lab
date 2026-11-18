import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RECEPTION_TABS } from './reception.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reception',
  imports: [RouterLink,CommonModule],
  templateUrl: './reception.html',
  styleUrl: './reception.scss',
})
export class Reception {
  labName = 'مختبرات بيور للتحاليل الطبية';
  tabs = RECEPTION_TABS;
}
