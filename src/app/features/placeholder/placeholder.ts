
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  imports: [RouterLink],
  template: `
    <div style="text-align:center; padding:60px">
      <h2>{{ title }}</h2>
      <p>الصفحة دي تحت الإنشاء</p>
      <a routerLink="/home">الرجوع للرئيسية</a>
    </div>
  `,
})
export class Placeholder {
  title = inject(ActivatedRoute).snapshot.data['title'];
}
