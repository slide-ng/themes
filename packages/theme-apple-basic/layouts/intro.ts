import { Component } from '@angular/core';

// Title slide (Keynote "Title"): big bold title, vertically centered.
@Component({
  selector: 'apple-intro',
  host: { class: 'slidev-layout intro' },
  templateUrl: './intro.html',
})
export class AppleIntro {}
