import { Component, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'adev-decorative-header',
  host: {
    class: 'adev-decorative-header',
    '[class.adev-decorative-header-gradient]': 'gradient()',
    '[attr.title]': 'null',
  },
  templateUrl: './decorative-header.html',
})
export class AdevDecorativeHeader {
  title = input('');
  imgSrc = input('');
  imgAlt = input('');
  gradient = input(false, { transform: booleanAttribute });
}
