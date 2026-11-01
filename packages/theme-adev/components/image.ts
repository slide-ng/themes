import { Component, input } from '@angular/core';

@Component({
  selector: 'adev-image',
  host: {
    class: 'adev-image',
    '[class.adev-image-small]': 'size() === "small"',
    '[class.adev-image-medium]': 'size() === "medium"',
  },
  templateUrl: './image.html',
})
export class AdevImage {
  src = input.required<string>();
  alt = input('');
  caption = input('');
  size = input<'' | 'small' | 'medium'>('');
}
