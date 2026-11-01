import { Component, input } from '@angular/core';

@Component({
  selector: 'adev-stat',
  host: { class: 'adev-stat' },
  templateUrl: './stat.html',
})
export class AdevStat {
  value = input('');
  label = input('');
}
