import { Component, InjectionToken, computed, inject, input, signal } from '@angular/core';

export interface AdevTabsHost {
  stacked: boolean;
}

export const ADEV_TABS_HOST = new InjectionToken<AdevTabsHost>('ADEV_TABS_HOST');

let uid = 0;

@Component({
  selector: 'adev-tab',
  host: {
    class: 'adev-tab-panel',
    role: 'tabpanel',
    '[attr.id]': 'panelId',
    '[attr.aria-labelledby]': 'tabId',
    '[attr.tabindex]': 'host?.stacked ? null : 0',
    '[hidden]': '!shown()',
  },
  templateUrl: './tab.html',
})
export class AdevTab {
  label = input('');
  readonly active = signal(false);
  readonly host = inject(ADEV_TABS_HOST, { optional: true });
  readonly shown = computed(() => this.active() || !!this.host?.stacked);
  readonly tabId = `adev-tab-${++uid}`;
  readonly panelId = `${this.tabId}-panel`;
}
