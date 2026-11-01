import { Component, computed, input } from '@angular/core';
import { background } from 'slide-ng/layouts/background';

// Centered title slide. Without `background` the slide gets the theme's own gradient
// (Slidev's seriph loads a random photo here; this port draws a gradient instead).
@Component({
  selector: 'seriph-cover',
  host: {
    class: 'slidev-layout cover seriph-cover text-center',
    '[class.seriph-cover-plain]': '!background()',
    '[style]': 'style()',
  },
  templateUrl: './cover.html',
})
export class SeriphCover {
  background = input('');
  style = computed(() => background(this.background(), true));
}
