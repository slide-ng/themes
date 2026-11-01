import { Component } from '@angular/core';

// Section title, vertically centered, light text on brown.
@Component({
  selector: 'shibainu-section',
  host: { class: 'slidev-layout section section-1 grid shibainu-bg-section' },
  templateUrl: './section.html',
})
export class ShibainuSection {}
