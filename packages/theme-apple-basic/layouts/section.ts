import { Component } from '@angular/core';

// Section title, vertically centered.
@Component({
  selector: 'apple-section',
  host: { class: 'slidev-layout h-full grid section' },
  templateUrl: './section.html',
})
export class AppleSection {}
