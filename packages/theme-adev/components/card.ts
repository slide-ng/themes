import { Component, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'adev-card',
  host: { class: 'adev-card', '[class.adev-card-hot]': 'hot()' },
  templateUrl: './card.html',
})
export class AdevCard {
  label = input('');
  title = input('');
  hot = input(false, { transform: booleanAttribute });
}
