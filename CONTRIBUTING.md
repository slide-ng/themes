# Contributing to slide.ng themes

Thanks for helping. The rules of a theme are in slide.ng's `docs/THEMES.md` and `docs/WRITING-A-THEME.md`.

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Report security problems privately, as [SECURITY.md](SECURITY.md) describes. By contributing you agree that your work is licensed under the [MIT license](LICENSE) of this project.

## Set up

You need Node.js 22.23.3 or newer (`.nvmrc` names the version CI uses). The browser test also needs a checkout of slide.ng with its dependencies installed, and a Chromium (`CHROME_PATH`).

```sh
git clone https://github.com/slide-ng/themes.git
cd themes
npm install          # links the packages into node_modules/@slide-ng
SLIDE_NG_DIR=../slide.ng npm test
```

`npm install` also sets `core.hooksPath` to `.githooks` and `commit.template` to `.gitmessage`, unless you already set them. The hooks are small:

- `pre-commit` formats the staged files with Prettier. It skips a file that also has unstaged changes.
- `commit-msg` warns when the message does not follow the commit message rules below. It never blocks the commit.

## Commands

| command                        | what it does                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `npm test`                     | package checks, the commit message check, then a browser test of every theme |
| `npm run format`               | Prettier, writes changes (`npm run format:check` only checks)                |
| `node tests/themes.mjs bricks` | the browser test of one theme                                                |

`npm test` runs `tests/packages.test.mjs` (the fields every package needs, one showcase slide per layout), `tests/commit-message.test.mjs`, and `tests/themes.mjs`. The last one builds each deck in `examples/` with slide.ng's command line and opens every slide in Chromium, so it needs `SLIDE_NG_DIR` and a browser. Before a pull request, run the format check and `npm test`.

## Code style

Small files, plain comments, few dependencies. Prettier decides the formatting (`.prettierrc`, `.editorconfig`); the showcase decks in `examples/` are left alone because their `---` slide separators are test input.

## Commit messages

`type(scope): summary`, imperative, lower case, no period, 72 characters at most, no trailer lines. An optional body, after a blank line, says why.

- Types: `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`.
- Scopes: `seriph`, `shibainu`, `bricks`, `apple-basic`, `adev`, `packages`, `examples`, `tests`, `docs`, `deps`, `ci`. Leave the scope out when a change spans several parts.

Pull requests are squash merged, so the pull request title must follow the same form. You can check a message yourself:

```sh
node scripts/commit-message.mjs --title "fix(bricks): keep the polygon colors"
node scripts/commit-message.mjs --range origin/main..HEAD
```

## Add a theme

1. Make `packages/theme-<name>/` with `theme.json`, `layouts/`, `styles/index.css` and, if needed, `components/`.
2. Copy the `package.json` of an existing package: name `@slide-ng/theme-<name>`, `slide-ng` as a peer dependency,
   `files`, and the keywords `slide-ng-theme` and `slide-ng`.
3. Write a `README.md` for the package: what it looks like, what is ported, what is different, and the credit to the original author.
4. Add `examples/<name>.md`, a deck with `theme: <name>` and one slide for every layout (`layout: <layout>`).
5. Add the theme to the table in the root README and to `tests/themes.mjs` (the layout tags, a computed style or two, the fonts). Add its name to the list in `tests/packages.test.mjs`.
6. Run `npm run format` and `npm test`.

To add a layout to an existing theme, write `layouts/<layout>.ts` (copy a small one), add a slide for it to the theme's deck in `examples/`, and extend the checks in `tests/themes.mjs`.

### What slide.ng 2.0 adds for a theme

The packages work with `@slide-ng/core` 1.x and 2.x. Use these only in a way that 1.x ignores, or keep a 1.x fallback.

- `themeConfig`: settings a deck can change, as in Slidev. Give the defaults in `theme.json` (`"headmatter": { "themeConfig": { "primary": "#5d8392" } }`).
  Each text or number key becomes the CSS variable `--slidev-theme-<key>` on `<body>`, and the deck's `themeConfig` replaces it.
  A number has no unit, so give a length as text (`"6px"`). `seriph` does this; its `:root` value is the fallback for 1.x.
- `--slidev-theme-primary` colours more of slide.ng in 2.0: the progress bar (`progressBar`), the presenter's click preview (the next click),
  the sync menu, the border of an `/entry` link under the mouse, the current card of the quick overview and the controls.
  Pick a primary that reads on the theme's slides and on the dark or light bar.
  The click preview also takes `--slide-ng-ghost-next`, `--slide-ng-ghost-badge-background` and `--slide-ng-ghost-badge-foreground`.
- `locales/<lang>.json`: translations of slide.ng's own interface, flat `"key": "text"` pairs from slide.ng's `docs/UI-STRINGS.md`. The deck's
  `lang` picks the file; a theme's keys come after the built-in ones and before the addons' and the deck's.
- Custom transitions: a `transition:` name that slide.ng does not have runs the classes `<name>-enter-from`, `<name>-enter-active`,
  `<name>-enter-to` and the same with `leave`, so a theme can ship a transition in `styles/` and set it in the headmatter of `theme.json`.
- Right to left: `lang: ar`, `he`, `fa` or `ur` sets `dir="rtl"`. Write `margin-inline-start`, `padding-inline-end`, `inset-inline-start`,
  `border-inline-start` and `text-align: start` instead of left and right, so lists, rails and columns mirror.
- Attributify: plain attributes in the theme's layouts and components become utilities (`<div m="4">`), except the inputs of the theme's
  own components and the attributes inside an `<svg>`. Avoid an attribute with a utility's name (`border`, `text`, `flex`) that is not meant as one.

### What slide.ng 2.1 adds for a theme

- `navPosition` can put the navigation bar at the top (`top-left`, `top-center`, `top-right`), and its menus then open below it. The box of the
  bar takes the mouse in its corner even while the bar is hidden, so do not put a button of the theme in a top corner, or move it when the bar
  is at the top, as `adev` does with its scheme button.
- `languages` adds a language button to the bar. A theme's `locales/<lang>.json` can translate its `nav.language` and `language.menu`.

### What slide.ng 2.2 adds for a theme

- The settings menu has Nav Bar Position: a viewer can put the bar in any of the six places while the deck is open, over the headmatter. A theme
  that moves something out of the bar's way must follow the bar itself (`.nav-bar-box.top-0`, as `adev` does with `body:has(...)`), not the
  deck's `navPosition`. A theme's `locales/<lang>.json` can translate the new `settings.navPosition`, `settings.navPositionDefault` and
  `settings.nav<Place>` strings.
- A deck can keep its options in `slide-ng.config.yaml` next to `slides.md`. Its `themeConfig` and `fonts` are merged with the headmatter's
  one level deep, so a theme sees the same values as before and needs no change.

## Rules

- Original code under MIT can be ported, with credit in the package README and in `NOTICE`.
- Do not copy images, fonts or other assets that are not MIT or compatible (for example CC BY-NC-SA). Draw it in CSS or leave it out.
- Keep files small and comments short and plain.
- One change per pull request, with a test where it makes sense. Fill in the pull request template.
- Open an issue first for a new theme or a large change, so we can agree on the approach.

## Recognising contributions

Everyone who helps is listed in the Contributors section of the README, whatever the kind of help: code, docs, design, review or triage. To add someone, comment `@all-contributors please add @user for code` on an issue or pull request (use another type such as `doc`, `review` or `bug` when it fits). The bot opens a pull request that updates `.all-contributorsrc` and the README.
