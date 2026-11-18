import { Injectable, signal } from '@angular/core';

export interface ToolbarAction {
  icon: string;
  tooltip: string;
  run: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToolbarService {
  readonly actions = signal<ToolbarAction[]>([]);
  set(actions: ToolbarAction[]) { this.actions.set(actions); }
  clear() { this.actions.set([]); }
}
