import { Component } from '@angular/core';

// Content with the theme's padding and no background shapes.
@Component({
  selector: 'bricks-blank',
  host: { class: 'slidev-layout blank' },
  templateUrl: './blank.html',
})
export class BricksBlank {}
