import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MODULES } from '../../shared/core/constants';
@Component({
  selector: 'app-home',
  imports: [RouterLink, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  modules = MODULES;
  labName = 'مختبرات بيور للتحاليل الطبية';
  branch = 'فرع الإسماعيلية';
  userName = 'حسام محمد علي';
}
