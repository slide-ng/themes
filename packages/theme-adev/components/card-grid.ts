import { Component, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'adev-card-grid',
  host: {
    class: 'adev-card-grid',
    '[style.grid-template-columns]': '"repeat(" + cols() + ", 1fr)"',
  },
  templateUrl: './card-grid.html',
})
export class AdevCardGrid {
  cols = input(2, { transform: numberAttribute });
}
