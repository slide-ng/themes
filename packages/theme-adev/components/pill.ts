import { Component, input } from '@angular/core';

@Component({
  selector: 'adev-pill-row',
  host: { class: 'adev-pill-row' },
  templateUrl: './pill.adev-pill-row.html',
})
export class AdevPillRow {}

@Component({
  selector: 'adev-pill',
  host: { class: 'adev-pill', '[attr.title]': 'null' },
  templateUrl: './pill.adev-pill.html',
})
export class AdevPill {
  title = input('');
  href = input('');
}
