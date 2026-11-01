import { Component, booleanAttribute, computed, input } from '@angular/core';

const MARKS: Record<string, string> = {
  class: 'C',
  const: 'K',
  decorator: '@',
  directive: 'D',
  element: '<>',
  enum: 'E',
  function: 'f',
  interface: 'I',
  pipe: 'P',
  'ng-module': 'M',
  'type-alias': 'T',
  block: '@',
  deprecated: '!',
  experimental: 'X',
  'developer-preview': 'DP',
  stable: 'S',
};

@Component({
  selector: 'adev-api-label',
  host: {
    class: 'adev-api-label',
    '[class]': '"adev-api-label-" + kind()',
    '[class.adev-api-label-full]': 'full()',
    '[attr.title]': 'null',
  },
  templateUrl: './api-label.html',
})
export class AdevApiLabel {
  kind = input('class');
  full = input(false, { transform: booleanAttribute });
  version = input('');
  mark = computed(() => MARKS[this.kind()] ?? this.kind().charAt(0).toUpperCase());
  text = computed(() => {
    const text = this.kind().replace(/[-_]/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  });
}
