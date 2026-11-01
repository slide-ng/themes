import { Component } from '@angular/core';

// Bullets only, starting a little lower than the normal slide (Keynote "Bullets").
@Component({
  selector: 'apple-bullets',
  host: { class: 'slidev-layout h-full grid bullets' },
  templateUrl: './bullets.html',
})
export class AppleBullets {}
