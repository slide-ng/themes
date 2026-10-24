// Browser test of the five themes against a slide.ng checkout (see README: SLIDE_NG_DIR, default ../slide.ng).
// Each deck in examples/ uses `theme: <name>`, found in node_modules/@slide-ng/theme-<name> (npm workspaces link the packages there)
// and has a slide for every layout of the theme. For each theme: build it with the slide.ng command line, open every slide in
// Chromium, check the layout element, a distinguishing computed style, the fonts asked from the provider, and that one slide
// exports to a PNG. `node tests/themes.mjs bricks` runs one theme.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const core = resolve(process.env.SLIDE_NG_DIR ?? join(root, '../slide.ng'));
const bin = join(core, 'bin/slide-ng.mjs');
if (!existsSync(bin))
  throw new Error(`slide.ng was not found at ${core}. Set SLIDE_NG_DIR to a checkout of slide.ng.`);
const { launch, reporter, serve } = await import(
  pathToFileURL(join(core, 'tests/e2e/browser.mjs')).href
);
const { makeContext } = await import(pathToFileURL(join(core, 'tests/e2e/helpers.mjs')).href);

import { measure } from './adev-contrast.mjs';

const WHITE = 'rgb(255, 255, 255)';
const rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`;
const ADEV_DARK = rgb(15, 15, 17);
const [TAN, MID, BROWN, DARK, LIGHT] = [
  rgb(191, 146, 107),
  rgb(140, 102, 69),
  rgb(115, 66, 38),
  rgb(64, 35, 18),
  rgb(235, 238, 242),
];

// slides[n-1] = [layout tag, [selector, css property, expected value or RegExp]...]. A selector is looked up inside the slide.
const THEMES = {
  seriph: {
    dark: false,
    fontUrl: ['PT+Serif', 'PT+Mono', 'ital', '700'],
    fonts: { sans: 'PT Serif', mono: 'PT Mono' },
    slides: [
      [
        'seriph-cover',
        ['seriph-cover', 'backgroundImage', /gradient/],
        ['seriph-cover', 'color', WHITE],
        ['seriph-cover', 'textAlign', 'center'],
      ],
      ['sn-intro', ['h1', 'fontSize', '60px'], ['h1 + p', 'opacity', '0.65']],
      ['sn-default', ['h1', 'color', rgb(93, 131, 146)], ['pre.shiki', 'fontFamily', /^"PT Mono"/]],
      ['sn-section', ['h1', 'color', rgb(93, 131, 146)]],
      ['sn-statement', ['h1', 'fontWeight', '700']],
      ['sn-fact', ['h1', 'fontSize', '96px']],
      ['sn-quote', ['h1', 'color', rgb(93, 131, 146)]],
    ],
    png: { slide: 1, check: (p) => p[0] < 200 && p[2] > p[0] },
  },
  shibainu: {
    dark: true,
    fontUrl: ['Titillium+Web', 'Fira+Code'],
    fonts: { sans: 'Titillium Web', mono: 'Fira Code' },
    slides: [
      [
        'shibainu-cover',
        ['shibainu-cover', 'backgroundColor', TAN],
        ['shibainu-cover', 'color', DARK],
        ['h1', 'fontSize', '60px'],
      ],
      [
        'shibainu-default',
        ['shibainu-default', 'backgroundColor', BROWN],
        ['shibainu-default', 'color', LIGHT],
        ['h1 + p', 'opacity', '1'],
        ['shibainu-default > div', 'width', /^(5[0-9]{2}|6[0-9]{2})(\.\d+)?px$/],
      ],
      [
        'shibainu-center',
        ['shibainu-center', 'backgroundColor', TAN],
        ['shibainu-center > div', 'textAlign', 'center'],
      ],
      ['shibainu-section', ['shibainu-section', 'backgroundColor', BROWN]],
      [
        'shibainu-default-2',
        ['shibainu-default-2', 'backgroundColor', BROWN],
        ['shibainu-default-2', 'color', LIGHT],
      ],
      [
        'shibainu-default-3',
        ['shibainu-default-3', 'backgroundColor', BROWN],
        ['shibainu-default-3 > div.text-center', 'textAlign', 'center'],
      ],
      [
        'shibainu-right',
        ['shibainu-right', 'backgroundColor', MID],
        ['shibainu-right > div', 'textAlign', 'right'],
      ],
      [
        'shibainu-section-2',
        ['shibainu-section-2', 'backgroundColor', TAN],
        ['shibainu-section-2', 'color', DARK],
      ],
      ['shibainu-default-4', ['shibainu-default-4', 'backgroundColor', MID]],
      ['shibainu-default-5', ['shibainu-default-5', 'backgroundColor', MID]],
      [
        'shibainu-default-6',
        ['shibainu-default-6', 'backgroundColor', DARK],
        ['shibainu-default-6 > div', 'paddingLeft', /^(1[0-9]{2})(\.\d+)?px$/],
      ],
      ['shibainu-default-7', ['shibainu-default-7', 'backgroundColor', DARK]],
      [
        'shibainu-section-3',
        ['shibainu-section-3', 'backgroundColor', DARK],
        ['h1', 'fontSize', /^(4[0-9]|5[0-9])(\.\d+)?px$/],
      ],
      [
        'shibainu-quote',
        ['shibainu-quote', 'backgroundColor', MID],
        ['h1', 'fontSize', /^(6[0-9]|7[0-9])(\.\d+)?px$/],
      ],
    ],
    png: {
      slide: 2,
      check: (p) => Math.abs(p[0] - 115) < 4 && Math.abs(p[1] - 66) < 4 && Math.abs(p[2] - 38) < 4,
    },
  },
  bricks: {
    dark: false,
    fontUrl: ['Sigmar+One', 'Signika+Negative', 'Fira+Code'],
    fonts: { sans: 'Signika Negative', serif: 'Sigmar One', mono: 'Fira Code' },
    slides: [
      [
        'bricks-cover',
        ['bricks-cover', 'backgroundImage', /gradient/],
        ['bricks-cover h1', 'fontFamily', /^"Sigmar One"/],
      ],
      [
        'bricks-intro',
        ['bricks-intro polygon-7', 'width', '160px'],
        ['bricks-intro', 'gridTemplateColumns', /^\d+(\.\d+)?px \d+(\.\d+)?px$/],
      ],
      [
        'bricks-default',
        ['bricks-default', 'paddingLeft', '88px'],
        ['h1 + p', 'opacity', '0.65'],
        ['bricks-default', 'backgroundImage', /gradient/],
      ],
      [
        'bricks-section',
        ['bricks-section .bricks-section-right h2', 'fontSize', '24px'],
        ['bricks-section', 'display', 'grid'],
      ],
      [
        'bricks-items',
        ['.bricks-items-grid', 'gridTemplateColumns', /^(\d+(\.\d+)?px ?){4}$/],
        ['bricks-items polygon-1', 'width', '80px'],
      ],
      ['bricks-quote', ['bricks-quote', 'textAlign', 'center']],
      ['bricks-fact', ['bricks-fact h1', 'fontSize', '60px']],
      ['bricks-statement', ['bricks-statement', 'textAlign', 'center']],
      ['bricks-blank', ['bricks-blank', 'backgroundImage', 'none']],
    ],
    png: { slide: 5, check: (p) => p[2] > p[0] + 50 },
  },
  'apple-basic': {
    dark: false,
    fontUrl: null, // `local: Helvetica Neue`: nothing is loaded from the provider
    fonts: { sans: 'Helvetica Neue' },
    slides: [
      [
        'apple-intro',
        ['h1', 'fontWeight', '700'],
        ['h1', 'fontSize', '60px'],
        ['h1 + p', 'opacity', '0.65'],
      ],
      ['apple-intro-image', ['apple-intro-image', 'backgroundColor', rgb(74, 111, 165)]],
      [
        'apple-intro-image-right',
        ['.apple-photo', 'backgroundColor', rgb(201, 162, 39)],
        ['apple-intro-image-right', 'gridTemplateColumns', /^\d+(\.\d+)?px \d+(\.\d+)?px$/],
      ],
      [
        'apple-image-right',
        ['.apple-photo', 'backgroundColor', rgb(107, 143, 113)],
        ['h2', 'fontWeight', '700'],
      ],
      ['sn-default', ['h1', 'fontWeight', '700'], ['ul', 'listStyleType', 'disc']],
      ['apple-bullets', ['apple-bullets .pt-18', 'paddingTop', '72px']],
      ['apple-section', ['h1', 'fontWeight', '500']],
      ['apple-statement', ['apple-statement', 'textAlign', 'center'], ['h1', 'fontWeight', '700']],
      ['apple-fact', ['h1', 'fontSize', '96px'], ['apple-fact', 'textAlign', 'center']],
      ['apple-quote', ['apple-quote h1 + p', 'marginLeft', '24px']],
      [
        'apple-three-images',
        ['apple-three-images > div:first-child', 'backgroundColor', rgb(74, 111, 165)],
        ['apple-three-images > div:first-child', 'marginLeft', '56px'],
        ['apple-three-images .grid > div:last-child', 'backgroundColor', rgb(107, 143, 113)],
      ],
    ],
    png: { slide: 2, check: (p) => p[0] === 74 && p[1] === 111 && p[2] === 165 },
  },
  adev: {
    dark: true,
    fontUrl: ['Inter', 'Inter+Tight', 'DM+Mono', 'wght@400'],
    fonts: { sans: 'Inter', mono: 'DM Mono' },
    slides: [
      [
        'adev-cover',
        ['adev-cover', 'backgroundImage', /gradient/],
        ['adev-cover', 'color', WHITE],
        ['adev-cover h1', 'fontFamily', /^"Inter Tight"/],
      ],
      [
        'adev-intro',
        ['adev-intro h1', 'backgroundImage', /gradient/],
        ['adev-intro h1', 'fontSize', '64px'],
      ],
      [
        'adev-default',
        ['adev-default', 'backgroundColor', WHITE],
        ['adev-default h1', 'color', rgb(21, 20, 23)],
        ['adev-default p code', 'fontFamily', /^"DM Mono"/],
        ['adev-default .slidev-code-wrapper', 'borderTopWidth', '1px'],
      ],
      ['adev-center', ['adev-center', 'textAlign', 'center']],
      [
        'adev-section',
        ['adev-section', 'paddingLeft', '96px'],
        ['adev-section h1', 'fontSize', '64px'],
      ],
      [
        'adev-two-cols',
        ['.col-right', 'borderLeftWidth', '1px'],
        ['adev-two-cols', 'display', 'grid'],
      ],
      ['adev-image-right', ['.adev-photo', 'backgroundImage', /gradient/]],
      ['adev-image-left', ['.adev-photo', 'backgroundImage', /gradient/]],
      ['adev-quote', ['.adev-quote-card', 'borderTopWidth', '1px']],
      [
        'adev-fact',
        ['adev-fact h1', 'fontSize', '128px'],
        ['adev-fact h1', 'backgroundClip', 'text'],
      ],
      ['adev-statement', ['adev-statement', 'textAlign', 'center']],
      [
        'adev-default',
        ['.adev-alert-note', 'borderLeftWidth', '3px'],
        ['.adev-alert-critical svg', 'width', /^22(\.\d+)?px$/],
        ['.adev-alert-warning svg', 'width', /^22(\.\d+)?px$/],
        ['adev-alert', 'backgroundColor', /^(rgb|color)\(/],
      ],
      ['adev-default'],
      ['adev-default'],
      ['adev-default'],
      ['adev-default'],
      [
        'adev-default',
        ['adev-card-grid', 'gridTemplateColumns', /^(\d+(\.\d+)?px ?){3}$/],
        ['.adev-card-hot', 'borderTopColor', 'rgba(0, 0, 0, 0)'],
      ],
      [
        'adev-center',
        ['.adev-stat-value', 'fontSize', '72px'],
        ['.adev-stat-value', 'backgroundClip', 'text'],
        ['adev-count-up', 'textContent', /^240\+$/],
      ],
      [
        'adev-default',
        ['.adev-code-card', 'borderTopWidth', '1px'],
        ['.adev-steps ol', 'listStyleType', 'none'],
        ['.adev-button-primary', 'borderTopColor', 'rgba(0, 0, 0, 0)'],
        ['.adev-button + .adev-button', 'marginInlineStart', '12px'],
        ['.flex .adev-button + .adev-button', 'marginInlineStart', '12px'],
      ],
      [
        'adev-default',
        ['adev-default th', 'fontWeight', '500'],
        ['adev-default blockquote', 'borderLeftWidth', '3px'],
        ['adev-default td code', 'fontFamily', /^"DM Mono"/],
      ],
      ['adev-default'],
      ['adev-default'],
      [
        'adev-default',
        ['.slidev-code', 'backgroundColor', WHITE],
        ['.slidev-code', 'fontSize', '14px'],
        ['.slidev-code code', 'fontFamily', /^"DM Mono"/],
        ['.slidev-code-block-title', 'backgroundClip', /^text/],
      ],
      ['adev-default', ['.slidev-code', 'backgroundColor', WHITE]],
      ...Array.from({ length: 14 }, () => ['adev-default']),
      [
        'adev-end',
        ['adev-end', 'backgroundImage', /gradient/],
        ['adev-end', 'textAlign', 'center'],
      ],
    ],
    total: 39,
    // The same slides with the page switched to dark (the colour-schema switch): [slide, checks...]
    darkChecks: [
      [1, ['adev-cover', 'backgroundImage', /gradient/]],
      [2, ['adev-intro', 'backgroundColor', ADEV_DARK]],
      [
        3,
        ['adev-default', 'backgroundColor', ADEV_DARK],
        ['adev-default h1', 'color', rgb(251, 251, 251)],
      ],
      [4, ['adev-center', 'backgroundColor', ADEV_DARK]],
      [5, ['adev-section', 'backgroundColor', ADEV_DARK]],
      [6, ['adev-two-cols', 'backgroundColor', ADEV_DARK]],
      [9, ['adev-quote', 'backgroundColor', ADEV_DARK]],
      [10, ['adev-fact', 'backgroundColor', ADEV_DARK]],
      [11, ['adev-statement', 'backgroundColor', ADEV_DARK]],
      [12, ['adev-alert', 'backgroundColor', /^(rgb|color)\(/]],
      [17, ['adev-card', 'backgroundColor', ADEV_DARK]],
      [
        19,
        ['.adev-code-card-header', 'backgroundColor', /^(rgb|color)\(/],
        ['.adev-button + .adev-button', 'marginInlineStart', '12px'],
        ['.flex .adev-button + .adev-button', 'marginInlineStart', '12px'],
      ],
      [23, ['.slidev-code', 'backgroundColor', rgb(36, 41, 46)]],
      [24, ['.slidev-code', 'backgroundColor', rgb(36, 41, 46)]],
      [39, ['adev-end', 'backgroundImage', /gradient/]],
    ],
    tokens: {
      23: {
        light: {
          export: rgb(215, 58, 73),
          "'app-user'": rgb(3, 47, 98),
          input: rgb(111, 66, 193),
          User: rgb(111, 66, 193),
          Component: rgb(111, 66, 193),
          '@if': rgb(215, 58, 73),
          h2: rgb(34, 134, 58),
        },
        dark: {
          export: rgb(249, 117, 131),
          "'app-user'": rgb(158, 203, 255),
          input: rgb(179, 146, 240),
          User: rgb(179, 146, 240),
          Component: rgb(179, 146, 240),
          '@if': rgb(249, 117, 131),
          h2: rgb(133, 232, 157),
        },
      },
      24: {
        light: { '@for': rgb(215, 58, 73), "'ok'": rgb(3, 47, 98), item: rgb(0, 92, 197) },
        dark: {
          '@defer': rgb(249, 117, 131),
          "'ok'": rgb(158, 203, 255),
          item: rgb(121, 184, 255),
        },
      },
    },
    png: { slide: 1, check: (p) => p[2] > 180 && p[1] < 80 },
    contrast: {
      light: [3, 'adev-default'],
      dark: [3, 'adev-default'],
    },
  },
};

const only = process.argv[2];
const names = Object.keys(THEMES).filter((n) => !only || n === only);
const t = reporter();
async function runChecks(page, label, checks) {
  for (const [selector, prop, expected] of checks) {
    if (prop === 'textContent') await page.waitForTimeout(2200);
    const got = await page
      .locator(selector)
      .first()
      .evaluate(
        (e, p) => (p === 'textContent' ? e.textContent.trim() : getComputedStyle(e)[p]),
        prop,
      );
    t.ok(
      `${label}: ${selector} ${prop}`,
      expected instanceof RegExp ? expected.test(got) : got === expected,
      `${got}`,
    );
  }
}

const scratch = mkdtempSync(join(tmpdir(), 'slide-ng-themes-'));
const env = {
  ...process.env,
  CHROME_PATH: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
};

// The colour of one pixel of a PNG, read back by a browser.
async function pixel(browser, file) {
  const page = await browser.newPage();
  await page.setContent(
    `<img src="data:image/png;base64,${readFileSync(file).toString('base64')}">`,
  );
  const rgba = await page.evaluate(async () => {
    const img = document.querySelector('img');
    await img.decode();
    const c = Object.assign(document.createElement('canvas'), {
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    c.getContext('2d').drawImage(img, 0, 0);
    return [...c.getContext('2d').getImageData(3, 3, 1, 1).data];
  });
  await page.close();
  return rgba;
}

const browser = await launch();
try {
  for (const name of names) {
    const spec = THEMES[name];
    const deck = join(root, 'examples', `${name}.md`);
    const dist = join(scratch, 'site', name);
    console.log(`\n== ${name}`);
    if (!existsSync(join(root, 'node_modules/@slide-ng', `theme-${name}`)))
      throw new Error('Run npm install first: it links the packages into node_modules/@slide-ng.');
    execFileSync(process.execPath, [bin, 'build', deck, '--out', dist], { stdio: 'inherit', env });
    const { server, port } = await serve(dist);
    const ctx = makeContext(`http://localhost:${port}`, browser, t);
    // The font style sheet comes from the network in a real deck; here the request is recorded and answered with an empty sheet.
    const fontRequests = [];
    const routeFonts = async (page) =>
      page.route('**/fonts.googleapis.com/**', (route) => {
        fontRequests.push(route.request().url());
        route.fulfill({ status: 200, contentType: 'text/css', body: '' });
      });

    for (const [i, [tag, ...checks]] of spec.slides.entries()) {
      const n = i + 1;
      const page = await ctx.open(`/${n}`, { width: 1280, height: 720 }, routeFonts);
      const label = `${name} slide ${n} (${tag})`;
      t.ok(`${label}: layout element is there`, (await page.locator(tag).count()) === 1);
      await runChecks(page, label, checks);
      if (i === 0) {
        const total = Number(/slide 1\/(\d+)/.exec(await ctx.hud(page))?.[1]);
        t.ok(
          `${name}: the deck has ${spec.total ?? spec.slides.length} slides`,
          total === (spec.total ?? spec.slides.length),
          String(total),
        );
        t.ok(
          `${name}: ${spec.dark ? 'dark' : 'light'} colour schema from the theme`,
          (await page.evaluate(() => document.documentElement.classList.contains('dark'))) ===
            spec.dark,
        );
        const sans = await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--slidev-font-sans'),
        );
        t.ok(
          `${name}: the body font is the theme's sans font`,
          sans.startsWith(`"${spec.fonts.sans}"`) &&
            (await page.evaluate(() => getComputedStyle(document.body).fontFamily))
              .replace(/"/g, '')
              .startsWith(spec.fonts.sans),
          sans.slice(0, 40),
        );
        if (spec.fonts.mono) {
          const mono = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue(
              '--slidev-code-font-family',
            ),
          );
          t.ok(
            `${name}: the code font is the theme's mono font`,
            mono.includes(spec.fonts.mono) || mono.includes('var(--slidev-font-mono)'),
            mono.slice(0, 40),
          );
        }
      }
      await page.close();
    }
    // The fonts are asked from the provider, like Slidev (and nothing is asked when only a local font is named).
    if (spec.fontUrl)
      t.ok(
        `${name}: the web fonts are requested from the provider`,
        fontRequests.length > 0 && spec.fontUrl.every((part) => fontRequests[0].includes(part)),
        fontRequests[0] ?? 'no request',
      );
    else
      t.ok(
        `${name}: a local font is not requested from the provider`,
        fontRequests.length === 0,
        fontRequests.join(),
      );
    t.ok(
      `${name}: no console errors or warnings`,
      ctx.problems.length === 0,
      JSON.stringify(ctx.problems),
    );

    for (const [scheme, [n, selector]] of Object.entries(spec.contrast ?? {})) {
      const page = await ctx.open(`/${n}`, { width: 1280, height: 720 }, routeFonts);
      await page.evaluate(
        (dark) => (document.documentElement.dataset.adevScheme = dark ? 'dark' : 'light'),
        scheme === 'dark',
      );
      for (const [what, ratio, min] of await measure(
        page,
        selector,
        scheme === 'light' ? 'light' : 'dark',
      ))
        t.ok(
          `${name} ${scheme}: contrast ${what}`,
          ratio >= min,
          `${ratio.toFixed(2)} (>= ${min})`,
        );
      await page.close();
    }

    for (const [n, ...checks] of spec.darkChecks ?? []) {
      const page = await ctx.open(`/${n}`, { width: 1280, height: 720 }, routeFonts);
      await page.evaluate(() => (document.documentElement.dataset.adevScheme = 'dark'));
      await runChecks(page, `${name} slide ${n} in the dark scheme`, checks);
      await page.close();
    }

    for (const [n, bySchemes] of Object.entries(spec.tokens ?? {})) {
      for (const [scheme, tokens] of Object.entries(bySchemes)) {
        const page = await ctx.open(`/${n}`, { width: 1280, height: 720 }, routeFonts);
        await page.evaluate(
          (dark) => (document.documentElement.dataset.adevScheme = dark ? 'dark' : 'light'),
          scheme === 'dark',
        );
        for (const [text, expected] of Object.entries(tokens)) {
          const got = await page.evaluate((word) => {
            const span = [...document.querySelectorAll('pre.shiki .line span')].find(
              (e) => e.textContent.trim() === word,
            );
            return span ? getComputedStyle(span).color : 'no such token';
          }, text);
          t.ok(`${name} slide ${n} ${scheme}: code token ${text} colour`, got === expected, got);
        }
        await page.close();
      }
    }

    if (name === 'adev') {
      const sized = { width: 1280, height: 720 };
      const look = (page) =>
        page.evaluate(() => {
          const color = (e) => getComputedStyle(e).color;
          const keyword = [...document.querySelectorAll('pre.shiki .line span')].find(
            (e) => e.textContent.trim() === 'import',
          );
          return [
            getComputedStyle(document.querySelector('adev-default')).backgroundColor,
            getComputedStyle(document.querySelector('.slidev-code')).backgroundColor,
            color(keyword),
          ].join(' | ');
        });
      const dock = (page) =>
        page.evaluate(() => {
          const bar = getComputedStyle(document.querySelector('app-nav-bar nav > div'));
          const next = getComputedStyle(document.querySelector('#nav-next'));
          return [bar.backgroundColor, bar.color, bar.borderTopColor, next.color].join(' | ');
        });
      const scheme = (page) => page.evaluate(() => document.documentElement.dataset.adevScheme);
      const button = (page) => page.getByRole('button', { name: 'Switch slide colour scheme' });

      const page = await ctx.open('/3', sized, routeFonts);
      const lightLook = await look(page);
      await page.waitForTimeout(600);
      const dockBefore = await dock(page);
      const htmlDark = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );
      t.ok(
        'adev: the slides start light without a stored choice',
        (await scheme(page)) === 'light',
      );
      t.ok(
        'adev: the button is not pressed in light',
        (await button(page).getAttribute('aria-pressed')) === 'false',
      );
      await button(page).click();
      t.ok('adev: the button switches the slides to dark', (await scheme(page)) === 'dark');
      await page
        .waitForFunction(
          () =>
            document.querySelector('.adev-scheme-button')?.getAttribute('aria-pressed') === 'true',
          null,
          { timeout: 3000 },
        )
        .catch(() => {});
      t.ok(
        'adev: the button is pressed in dark',
        (await button(page).getAttribute('aria-pressed')) === 'true',
      );
      const darkLook = await look(page);
      t.ok(
        'adev: page, code panel and keyword change colour',
        lightLook.split(' | ').every((c, i) => c !== darkLook.split(' | ')[i]),
        `${lightLook} -> ${darkLook}`,
      );
      t.ok(
        'adev: html.dark is untouched by the button',
        (await page.evaluate(() => document.documentElement.classList.contains('dark'))) ===
          htmlDark,
      );
      await page.waitForTimeout(600);
      t.ok(
        'adev: the dock keeps its colours',
        (await dock(page)) === dockBefore,
        `${dockBefore} -> ${await dock(page)}`,
      );
      t.ok(
        'adev: the slide did not move on when the button was clicked',
        /\/3$/.test(new URL(page.url()).pathname),
      );
      await page.reload();
      await page.waitForFunction(() =>
        /clicks \d+\/\d+/.test(document.querySelector('#hud')?.innerText ?? ''),
      );
      t.ok(
        'adev: the choice persists after a reload',
        (await scheme(page)) === 'dark' && (await look(page)) === darkLook,
      );
      await button(page).focus();
      await page.keyboard.press('Enter');
      t.ok('adev: the button works from the keyboard', (await scheme(page)) === 'light');
      // slide.ng 2.1's `navPosition: top-*` puts the box of the bar at the top, where it would cover the button.
      const reachable = (on = page) =>
        on.evaluate(() => {
          const r = document.querySelector('.adev-scheme-button').getBoundingClientRect();
          const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
          return { top: r.top, free: Boolean(hit?.closest('.adev-scheme-button')) };
        });
      const atBottom = await reachable();
      t.ok(
        'adev: the button is free at the top with the bar at the bottom',
        atBottom.free && atBottom.top < 100,
      );
      await page.evaluate(() => {
        const box = document.querySelector('.nav-bar-box');
        box.classList.remove('bottom-0');
        box.classList.add('top-0');
      });
      const atTop = await reachable();
      t.ok(
        'adev: with the bar at the top the button moves to the bottom and stays free',
        atTop.free && atTop.top > 600,
        JSON.stringify(atTop),
      );
      await page.close();

      // slide.ng 2.2: a viewer can put the bar at the top from the settings menu, over the headmatter.
      const placed = await ctx.open('/3', sized, routeFonts);
      await placed.locator('#nav-settings').click();
      await placed.locator('#nav-position [data-nav-position=top-right]').click();
      await placed.waitForFunction(() =>
        document.querySelector('.nav-bar-box')?.classList.contains('top-0'),
      );
      await placed.keyboard.press('Escape');
      await placed.waitForFunction(() => !document.querySelector('#settings-menu'));
      const chosenTop = await reachable(placed);
      t.ok(
        'adev: with the bar put at the top in the settings menu the button moves and stays free',
        chosenTop.free && chosenTop.top > 600,
        JSON.stringify(chosenTop),
      );
      await placed.close();

      const night = await ctx.open('/3', sized, async (pg) => {
        await routeFonts(pg);
        await pg.emulateMedia({ colorScheme: 'dark' });
      });
      t.ok(
        'adev: the first value follows a dark system preference',
        (await scheme(night)) === 'dark',
      );
      await night.close();

      const stored = await ctx.open('/3', sized, async (pg) => {
        await routeFonts(pg);
        await pg.emulateMedia({ colorScheme: 'dark' });
        await pg.addInitScript(() => localStorage.setItem('adev-scheme', 'light'));
      });
      t.ok(
        'adev: a stored choice wins over the system preference',
        (await scheme(stored)) === 'light',
      );
      await stored.close();

      const alerts = await ctx.open('/12', sized, routeFonts);
      const before = await alerts
        .locator('adev-alert')
        .first()
        .evaluate((e) => getComputedStyle(e).backgroundColor);
      await button(alerts).click();
      const after = await alerts
        .locator('adev-alert')
        .first()
        .evaluate((e) => getComputedStyle(e).backgroundColor);
      t.ok(
        'adev: the alert changes colour with the button',
        before !== after,
        `${before} -> ${after}`,
      );
      await alerts.close();
    }

    // One slide as PNG, with the real command line, from the build above.
    const out = join(scratch, name);
    mkdirSync(out, { recursive: true });
    execFileSync(
      process.execPath,
      [
        bin,
        'export',
        deck,
        '--dist',
        dist,
        '--format',
        'png',
        '--range',
        String(spec.png.slide),
        '--scale',
        '1',
        '--output',
        'shots',
      ],
      { cwd: out, env, stdio: 'pipe' },
    );
    const files = readdirSync(join(out, 'shots'));
    t.ok(
      `${name}: png export of slide ${spec.png.slide} writes one file`,
      files.length === 1,
      files.join(),
    );
    const px = await pixel(browser, join(out, 'shots', files[0]));
    t.ok(`${name}: the png shows the theme (corner colour)`, spec.png.check(px), px.join());
    server.close();
  }
} finally {
  await browser.close();
}
process.exit(t.done());
