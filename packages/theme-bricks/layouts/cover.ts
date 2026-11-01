import { Component } from '@angular/core';

// Title slide in the serif font, with coloured shapes around the edges.
@Component({
  selector: 'bricks-cover',
  host: { class: 'slidev-layout cover bricks-bg-cover' },
  templateUrl: './cover.html',
})
export class BricksCover {}
