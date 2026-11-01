import { Component, ElementRef, inject, input, signal } from '@angular/core';
import { COPIED_ICON, COPY_ICON, copyCode } from './code-copy';

@Component({
  selector: 'adev-code-card',
  host: { class: 'adev-code-card' },
  templateUrl: './code-card.html',
})
export class AdevCodeCard {
  title = input('');
  label = input('');
  copied = signal(false);
  copyIcon = COPY_ICON;
  copiedIcon = COPIED_ICON;
  private host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  async copy() {
    if (!(await copyCode(this.host))) return;
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
