import { Component } from '@angular/core';

// A centered quotation.
@Component({
  selector: 'bricks-quote',
  host: { class: 'slidev-layout quote bricks-bg-quote' },
  templateUrl: './quote.html',
})
export class BricksQuote {}
