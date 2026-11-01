import { Component } from '@angular/core';

// A big fact, centered.
@Component({
  selector: 'bricks-fact',
  host: { class: 'slidev-layout fact bricks-bg-fact' },
  templateUrl: './fact.html',
})
export class BricksFact {}
