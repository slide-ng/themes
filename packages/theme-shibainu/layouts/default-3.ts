import { Component, input } from '@angular/core';

// Wide content with side margins. The frontmatter `class` goes on the content box (theme.json: classProp).
@Component({
  selector: 'shibainu-default-3',
  host: { class: 'slidev-layout default-3 dark shibainu-bg-3' },
  templateUrl: './default-3.html',
})
export class ShibainuDefault3 {
  contentClass = input('');
}
