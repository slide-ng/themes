import { Component } from '@angular/core';

// A quotation; the line under the title (the author) is indented.
@Component({
  selector: 'apple-quote',
  host: { class: 'slidev-layout h-full grid quote' },
  templateUrl: './quote.html',
})
export class AppleQuote {}
