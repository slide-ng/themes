import { Component, computed, input } from '@angular/core';
import { background } from 'slide-ng/layouts/background';

// Title over a full-bleed photo (Keynote "Title & Photo"). `image` is a picture address or a colour.
@Component({
  selector: 'apple-intro-image',
  host: { class: 'slidev-layout w-full h-full intro-image', '[style]': 'style()' },
  templateUrl: './intro-image.html',
})
export class AppleIntroImage {
  image = input('');
  style = computed(() => background(this.image()));
}
