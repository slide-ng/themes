import { Component } from '@angular/core';

// Two columns: the title low on the left, the `::right::` slot on the right.
@Component({
  selector: 'bricks-section',
  host: { class: 'slidev-layout section-1 grid grid-cols-2 bricks-bg-section' },
  templateUrl: './section.html',
})
export class BricksSection {}
