// What every theme package must have, checked without a browser or slide.ng:
// the package fields that npm and slide.ng's name lookup need, theme.json, a README, and a showcase slide per layout.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, it } from 'node:test';

const root = resolve(import.meta.dirname, '..');
const names = readdirSync(join(root, 'packages')).map((d) => d.replace(/^theme-/, ''));
const json = (file) => JSON.parse(readFileSync(file, 'utf8'));

it('holds the five official themes', () => {
  assert.deepEqual(names.sort(), ['adev', 'apple-basic', 'bricks', 'seriph', 'shibainu']);
});

it('versions the five packages together', () => {
  const versions = names.map(
    (n) => json(join(root, 'packages', `theme-${n}`, 'package.json')).version,
  );
  assert.equal(new Set(versions).size, 1, versions.join(', '));
});

for (const name of names) {
  describe(`@slide-ng/theme-${name}`, () => {
    const dir = join(root, 'packages', `theme-${name}`);
    const pkg = json(join(dir, 'package.json'));
    const layouts = readdirSync(join(dir, 'layouts'))
      .filter((f) => f.endsWith('.ts'))
      .map((f) => f.replace(/\.ts$/, ''));
    const deck = readFileSync(join(root, 'examples', `${name}.md`), 'utf8');

    it('has the package fields slide.ng and npm need', () => {
      assert.equal(pkg.name, `@slide-ng/theme-${name}`);
      assert.equal(pkg.license, 'MIT');
      assert.equal(pkg.peerDependencies['@slide-ng/core'], '^1.0.0 || ^2.0.0 || ^3.0.0');
      assert.deepEqual(pkg.keywords, ['slide-ng-theme', 'slide-ng']);
      assert.ok(pkg.files.includes('layouts') && pkg.files.includes('theme.json'));
      assert.ok(pkg.files.every((f) => !f.includes('..')));
    });
    it('ships its own LICENSE and NOTICE, listed in files', () => {
      for (const file of ['LICENSE', 'NOTICE']) {
        assert.ok(existsSync(join(dir, file)), file);
        assert.ok(pkg.files.includes(file), `files has ${file}`);
      }
      assert.match(readFileSync(join(dir, 'NOTICE'), 'utf8'), /Permission is hereby granted/);
    });
    it('ships theme.json, styles and a README', () => {
      for (const file of ['theme.json', 'styles/index.css', 'README.md'])
        assert.ok(existsSync(join(dir, file)), file);
    });
    it('has a valid theme.json whose layouts all exist', () => {
      const manifest = json(join(dir, 'theme.json'));
      assert.equal(manifest.name, name);
      for (const layout of Object.keys(manifest.layouts ?? {}))
        assert.ok(layouts.includes(layout), `layout ${layout}`);
    });
    it('has at least one layout and a component folder only with files in it', () => {
      assert.ok(layouts.length > 0);
      if (existsSync(join(dir, 'components')))
        assert.ok(readdirSync(join(dir, 'components')).length > 0);
    });
    it('is shown by examples/<name>.md with one slide per layout', () => {
      assert.match(deck, new RegExp(`^theme: ${name}$`, 'm'));
      // A slide without `layout:` uses `default`, so that one need not be written.
      for (const layout of layouts.filter((l) => l !== 'default'))
        assert.match(deck, new RegExp(`^layout: ${layout}$`, 'm'), `layout ${layout}`);
    });
    it('copies no CC BY-NC-SA asset: only code, templates, styles and json are packed', () => {
      const files = readdirSync(dir, { recursive: true }).filter((f) => /\.[a-z0-9]+$/.test(f));
      for (const f of files) assert.match(f, /\.(ts|html|css|json|md)$/, f);
    });
  });
}
