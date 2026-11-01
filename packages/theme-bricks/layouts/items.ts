import { Component, input, numberAttribute } from '@angular/core';

// A title, then a row of `cols` items (the `::items::` slot, one grid cell per child).
@Component({
  selector: 'bricks-items',
  host: { class: 'slidev-layout items bricks-bg-items' },
  templateUrl: './items.html',
})
export class BricksItems {
  cols = input(4, { transform: numberAttribute });
}
