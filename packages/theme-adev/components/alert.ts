import { Component, booleanAttribute, computed, input } from '@angular/core';

const KINDS = {
  note: ['Note', 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z'],
  tip: ['Tip', 'm12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.4l6-.8Z'],
  todo: ['To do', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 5h2v6h-2Zm0 8h2v2h-2Z'],
  question: [
    'Question',
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 15h2v2h-2Zm1-11a3.6 3.6 0 0 1 1.9 6.7c-.7.5-.9.8-.9 1.3h-2c0-1.2.6-1.9 1.6-2.5.5-.3.6-.6.6-1a1.2 1.2 0 0 0-1.2-1.2c-.7 0-1.2.4-1.4 1.1l-1.9-.5A3.3 3.3 0 0 1 12 6Z',
  ],
  summary: [
    'Summary',
    'M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1Zm3 4v2h10V8Zm0 4v2h7v-2Z',
  ],
  tldr: [
    'TL;DR',
    'M4 4h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm3 4v2h10V8Zm0 4v2h6v-2Z',
  ],
  warning: ['Warning', 'M12 2 22 12 12 22 2 12Zm-1 5v6h2V7Zm0 8v2h2v-2Z'],
  critical: ['Critical', 'M12 3 22 20H2Zm-1 7v5h2v-5Zm0 6.5v2h2v-2Z'],
  important: ['Important', 'M10.5 4h3v10.5h-3Zm0 12.5h3v3.5h-3Z'],
  helpful: [
    'Helpful',
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.6 14.4L6 12l1.4-1.4 3 3 6.2-6.2L18 9Z',
  ],
} as const;

type Kind = keyof typeof KINDS;

@Component({
  selector: 'adev-alert',
  host: { class: 'adev-alert', '[class]': '"adev-alert-" + kind()', '[attr.title]': 'null' },
  templateUrl: './alert.html',
})
export class AdevAlert {
  kind = input<Kind>('note');
  title = input('');
  bare = input(false, { transform: booleanAttribute });
  data = computed(() => KINDS[this.kind()] ?? KINDS.note);
}
