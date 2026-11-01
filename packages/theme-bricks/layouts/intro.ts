import { Component } from '@angular/core';

// Two columns (3:4): the `::left::` slot, and the title centered in the right one.
@Component({
  selector: 'bricks-intro',
  host: { class: 'slidev-layout intro bricks-bg-intro' },
  templateUrl: './intro.html',
})
export class BricksIntro {}
