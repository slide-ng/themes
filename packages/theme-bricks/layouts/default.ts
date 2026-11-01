import { Component } from '@angular/core';

// The normal slide: wide padding and a few shapes in the corners.
@Component({
  selector: 'bricks-default',
  host: { class: 'slidev-layout default bricks-bg-default' },
  templateUrl: './default.html',
})
export class BricksDefault {}
