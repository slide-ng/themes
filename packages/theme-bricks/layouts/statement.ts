import { Component } from '@angular/core';

// One short statement, centered.
@Component({
  selector: 'bricks-statement',
  host: { class: 'slidev-layout statement bricks-bg-statement' },
  templateUrl: './statement.html',
})
export class BricksStatement {}
