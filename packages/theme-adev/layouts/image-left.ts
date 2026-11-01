import { Component, computed, input } from '@angular/core';
import { background } from 'slide-ng/layouts/background';

@Component({
  selector: 'adev-image-left',
  host: { class: 'grid grid-cols-2 w-full h-full auto-rows-fr' },
  templateUrl: './image-left.html',
})
export class AdevImageLeft {
  image = input('');
  contentClass = input('');
  backgroundSize = input('cover');
  style = computed(() => background(this.image(), false, this.backgroundSize()));
}
