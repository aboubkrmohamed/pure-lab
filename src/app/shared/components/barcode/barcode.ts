import { Component, computed, input } from '@angular/core';

// Code 39: n = رفيع، w = عريض (بار، مسافة، بار...)
const P: Record<string, string> = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn',
  '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw',
  '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', '*': 'nwnnwnwnn',
};

@Component({
  selector: 'app-barcode',
  template: `
    @let b = bars();
    <svg [attr.viewBox]="'0 0 ' + b.width + ' 40'" preserveAspectRatio="none"
         width="210" height="56" role="img" [attr.aria-label]="value()">
      @for (r of b.rects; track $index) {
        <rect [attr.x]="r.x" y="0" [attr.width]="r.w" height="40" fill="#000" />
      }
    </svg>`,
})
export class Barcode {
  value = input.required<string>();

  bars = computed(() => {
    const rects: { x: number; w: number }[] = [];
    let x = 0;
    for (const ch of `*${this.value()}*`) {
      const pat = P[ch];
      if (!pat) continue;
      for (let i = 0; i < 9; i++) {
        const w = pat[i] === 'w' ? 3 : 1;
        if (i % 2 === 0) rects.push({ x, w });
        x += w;
      }
      x += 1;
    }
    return { rects, width: x };
  });
}
