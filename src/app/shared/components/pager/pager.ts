import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pager',
  imports: [],
  templateUrl: './pager.html',
  styleUrl: './pager.scss',
})
export class Pager {
 page = input.required<number>();
  pages = input.required<number>();
  pageChange = output<number>();

  items = computed(() => {
    const total = this.pages(), cur = this.page();
    const set = new Set([0, 1, total - 2, total - 1, cur - 1, cur, cur + 1].filter(p => p >= 0 && p < total));
    const sorted = [...set].sort((a, b) => a - b);
    const out: number[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) out.push(-1);
      out.push(p);
    });
    return out;
  });

  go(p: number) {
    if (p >= 0 && p < this.pages() && p !== this.page()) this.pageChange.emit(p);
  }
}
