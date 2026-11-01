import { Component } from '@angular/core';

// Title slide on a tan background with brown shapes (drawn in styles/index.css).
@Component({
  selector: 'shibainu-cover',
  host: { class: 'slidev-layout cover shibainu-bg-cover' },
  templateUrl: './cover.html',
})
export class ShibainuCover {}
