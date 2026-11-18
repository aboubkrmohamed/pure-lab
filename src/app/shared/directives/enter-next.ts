import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appEnterNext]',
  host: { '(keydown.enter)': 'onEnter($event)' },
})
export class EnterNext {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly finished = output<void>();

  onEnter(e: Event) {
    const t = e.target as HTMLElement;
    if (!(t instanceof HTMLInputElement || t instanceof HTMLSelectElement)) return;
    e.preventDefault();

    const fields = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>(
      'input:not([disabled]):not([readonly]):not([type="hidden"]), select:not([disabled])'));
    const next = fields[fields.indexOf(t) + 1];

    if (next) {
      next.focus();
      if (next instanceof HTMLInputElement && ['text', 'number', 'tel', 'email'].includes(next.type)) next.select();
    } else {
      this.finished.emit();
    }
  }
}
