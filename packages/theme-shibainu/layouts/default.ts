import { Component } from '@angular/core';

// The normal slide: light text on brown, content in the left 70%.
@Component({
  selector: 'shibainu-default',
  host: { class: 'slidev-layout default default-1 shibainu-bg-1' },
  templateUrl: './default.html',
})
export class ShibainuDefault {}
