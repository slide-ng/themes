import { Component, input } from '@angular/core';

@Component({
  selector: 'adev-two-cols',
  host: {
    class: 'slidev-layout two-columns adev-two-cols w-full h-full grid grid-cols-2',
    '[class]': 'layoutClass()',
  },
  templateUrl: './two-cols.html',
})
export class AdevTwoCols {
  layoutClass = input('');
  contentClass = input('');
}
