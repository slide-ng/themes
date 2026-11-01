import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RENDER_CONTEXT } from 'slide-ng/lib/slide-context';

type Scheme = 'light' | 'dark';

const KEY = 'adev-scheme';
const root = document.documentElement;

function stored(): Scheme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function initial(): Scheme {
  const set = root.dataset['adevScheme'];
  if (set === 'light' || set === 'dark') return set;
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return stored() ?? system;
}

@Component({
  selector: 'adev-global-top',
  templateUrl: './global-top.html',
})
export default class AdevGlobalTop {
  shown = ['slide', 'presenter'].includes(inject(RENDER_CONTEXT));
  scheme = signal<Scheme>(initial());

  constructor() {
    root.dataset['adevScheme'] = this.scheme();
    const watch = new MutationObserver(() => {
      const now = root.dataset['adevScheme'];
      if (now === 'light' || now === 'dark') this.scheme.set(now);
    });
    watch.observe(root, { attributes: true, attributeFilter: ['data-adev-scheme'] });
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        root.dataset['adevScheme'] = e.newValue;
      }
    };
    window.addEventListener('storage', onStorage);
    inject(DestroyRef).onDestroy(() => {
      watch.disconnect();
      window.removeEventListener('storage', onStorage);
    });
  }

  toggle() {
    const next: Scheme = this.scheme() === 'dark' ? 'light' : 'dark';
    this.scheme.set(next);
    root.dataset['adevScheme'] = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  }
}
