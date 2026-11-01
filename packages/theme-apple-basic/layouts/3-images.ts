import { Component, computed, input } from '@angular/core';
import { background } from 'slide-ng/layouts/background';

// Three photos: one tall on the left, two stacked on the right (mirrored right to left) (Keynote "Photo - 3").
@Component({
  selector: 'apple-three-images',
  host: { class: 'grid grid-cols-2 w-full h-full gap-x-7' },
  templateUrl: './3-images.html',
})
export class AppleThreeImages {
  imageLeft = input('');
  imageTopRight = input('');
  imageBottomRight = input('');
  left = computed(() => background(this.imageLeft()));
  topRight = computed(() => background(this.imageTopRight()));
  bottomRight = computed(() => background(this.imageBottomRight()));
}
