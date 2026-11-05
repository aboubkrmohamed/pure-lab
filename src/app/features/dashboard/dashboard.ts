import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface DashboardTab {
  label: string;
  icon: string;      // أيقونة Font Awesome
  route: string;
  color: string;     // كلاس اللون
  disabled?: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

   labName = 'مختبرات بيور للتحاليل الطبية';

  tabs: DashboardTab[] = [
    { label: 'SUMMARY', icon: 'fa-chart-column', route: 'summary', color: 'tab-blue' },
    { label: 'ADMIN TOOLS', icon: 'fa-id-card', route: 'admin-tools', color: 'tab-green' },
    { label: 'WORKFLOW', icon: 'fa-bars-progress', route: 'workflow', color: 'tab-gray', disabled: true },
  ];

}
