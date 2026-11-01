import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RENDER_CONTEXT } from 'slide-ng/lib/slide-context';

const EMBED_HOSTS = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'];

@Component({
  selector: 'adev-video',
  host: { class: 'adev-video' },
  templateUrl: './video.html',
})
export class AdevVideo {
  src = input.required<string>();
  title = input('Video');

  protected playing = signal(false);
  protected interactive = ['slide', 'presenter'].includes(inject(RENDER_CONTEXT));
  private sanitizer = inject(DomSanitizer);

  protected embed = computed(() => {
    let url: URL;
    try {
      url = new URL(this.src());
    } catch {
      return null;
    }
    if (url.protocol !== 'https:' || !EMBED_HOSTS.includes(url.hostname)) return null;
    if (!url.pathname.startsWith('/embed/')) return null;
    url.hostname = 'www.youtube-nocookie.com';
    url.searchParams.set('autoplay', '1');
    url.searchParams.set('rel', '0');
    return this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
  });
}
