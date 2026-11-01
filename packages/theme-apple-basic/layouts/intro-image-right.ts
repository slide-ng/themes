import { Component, computed, input } from '@angular/core';
import { background } from 'slide-ng/layouts/background';

// Title on the left (vertically centered), photo on the right. The frontmatter `class` goes on the text side.
@Component({
  selector: 'apple-intro-image-right',
  host: { class: 'grid grid-cols-2 w-full h-full' },
  templateUrl: './intro-image-right.html',
})
export class AppleIntroImageRight {
  image = input('');
  contentClass = input('');
  style = computed(() => background(this.image()));
}
