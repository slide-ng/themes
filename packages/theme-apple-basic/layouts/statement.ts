import { Component } from '@angular/core';

// One short statement, centered on the slide.
@Component({
  selector: 'apple-statement',
  host: { class: 'slidev-layout center h-full grid place-content-center statement' },
  templateUrl: './statement.html',
})
export class AppleStatement {}
