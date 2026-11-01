import { Component, computed, input } from '@angular/core';
import { background } from 'slide-ng/layouts/background';

// Title and bullets on the left, photo on the right with a margin around it. The frontmatter `class` goes on the text side.
@Component({
  selector: 'apple-image-right',
  host: { class: 'grid grid-cols-2 w-full h-full' },
  templateUrl: './image-right.html',
})
export class AppleImageRight {
  image = input('');
  contentClass = input('');
  style = computed(() => background(this.image()));
}
