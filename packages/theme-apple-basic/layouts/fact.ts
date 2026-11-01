import { Component } from '@angular/core';

// A big fact, centered on the slide.
@Component({
  selector: 'apple-fact',
  host: { class: 'slidev-layout center h-full grid place-content-center fact' },
  templateUrl: './fact.html',
})
export class AppleFact {}
