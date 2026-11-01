import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  booleanAttribute,
  contentChildren,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ClicksContext } from 'slide-ng/lib/clicks';
import { RENDER_CONTEXT } from 'slide-ng/lib/slide-context';
import { ADEV_TABS_HOST, AdevTab } from './tab';

@Component({
  selector: 'adev-tab-group',
  host: { class: 'adev-tabs', '[class.adev-tabs-stacked]': 'stacked' },
  providers: [{ provide: ADEV_TABS_HOST, useExisting: AdevTabGroup }],
  templateUrl: './tab-group.html',
})
export class AdevTabGroup implements OnInit, OnDestroy {
  label = input('');
  clicks = input(false, { transform: booleanAttribute });

  protected tabs = contentChildren(AdevTab);
  protected selected = signal(0);
  readonly stacked = inject(RENDER_CONTEXT) === 'print';

  private ctx = inject(ClicksContext);
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private start: number | null = null;

  constructor() {
    effect(() => {
      const selected = this.selected();
      this.tabs().forEach((tab, i) => tab.active.set(i === selected));
    });
    effect(() => {
      const start = this.start;
      const count = this.tabs().length;
      if (start === null || count === 0) return;
      const index = this.ctx.current() - start + 1;
      this.selected.set(Math.min(Math.max(index, 0), count - 1));
    });
  }

  ngOnInit() {
    if (!this.clicks()) return;
    const count = this.el.querySelectorAll(':scope > .adev-tab-panels > adev-tab').length;
    const info = this.ctx.calculateSince('+1', Math.max(count - 1, 1));
    if (!info) return;
    this.ctx.register(this, info);
    this.start = info.start;
  }

  ngOnDestroy() {
    this.ctx.unregister(this);
  }

  protected select(index: number, focus = false) {
    this.selected.set(index);
    if (focus) this.el.querySelectorAll<HTMLElement>('.adev-tab')[index]?.focus();
  }

  protected onKey(event: KeyboardEvent) {
    const count = this.tabs().length;
    const now = this.selected();
    const next =
      event.key === 'ArrowRight'
        ? (now + 1) % count
        : event.key === 'ArrowLeft'
          ? (now - 1 + count) % count
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? count - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    this.select(next, true);
  }
}
