# Session 7 plan: Tom's review fixes, then the wrap-up

Written 2026-10-08 after handoff-7. This is the last plan. It covers Tom's feedback on the mobile
and desktop app, the leftover Pass A review items from handoff-7 section 5, and the wrap-up steps
from PLAN.md. When Tom approves, step 0 copies the slice specs and decisions into the repo's
PLAN.md so the decision record stays in one place.

## Context

All four slices are on main (70 tests green, build clean). Tom used the app on a phone and a
desktop and found: the green and brown palette is invisible (every token is applied, but the hex
values are so dark they read as black on white); the "Back to parks" link scrolls away inside the
mobile sheet instead of sitting beside "Show more"; selecting a park on mobile expands the sheet
over the map instead of zooming the map; the details view wastes the sheet's space; only the first
photo is shown; returning to the list on mobile leaves the map zoomed far out; the expanded sheet
hides almost all of the map; pins are all one color so the list and the map cannot be matched by
eye; amenities have no icons.

Root cause of the zoom-out bug (confirmed in `node_modules/leaflet/src/map/Map.js`): on Back the
sheet shrinks from 85dvh to 40dvh over 200ms, the ResizeObserver feeds a new `centerOffset` every
frame, and the camera effect calls `fitBounds` each time. The first call has a zoom change above
Leaflet's 4-level threshold and lands instantly, the next frame starts a 250ms zoom animation, and
`_tryAnimatedZoom` returns `true` (call dropped) for every later call while `_animatingZoom` is
set. The last call, with the final sheet height, is the one that is dropped, so the map stays at
an intermediate zoom. Desktop has offset 0 and one call, so it never shows. Fix: `fitBounds` runs
with `animate: false` (list ↔ park moves never animated anyway because of the threshold); park →
park `setView` pans keep animating.

Decisions Tom made for this plan (do not re-ask): palette becomes visible as fills (green header
bar, brown bar and section headings, pale green list tint); the page owns one bar with Back on
the left and Show more on the right, the panel loses its own Back link; a recenter button sits in
the left slot of that bar on every width whenever the list is showing; the expanded sheet is
70dvh.

Tom also asked (after the first draft) that Back is a `<` icon, the sheet toggle is a `^` icon
that rotates to point down when expanded, and none of the bar controls show text.

Assumptions (stated, not asked): the compact two-column details layout applies at every width,
because the desktop column is 320–400px, the same width as a phone; the peek height stays 40dvh;
the recenter button is a crosshair icon in the same style; every icon control keeps an
`aria-label` and `title` so screen readers and hover still get the words; pin colors are assigned
by position in the list, so the list, the map, and the details agree.

## Session protocol (same as PLAN.md)

Tags: [fable] this session, [opus] / [sonnet] / [haiku] a subagent with that model passed
explicitly. Every shell command starts with
`export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 24.21.0 >/dev/null;` and uses `npx ng`.
Each slice: subagent writes the specs first with expected values from this file, captures the
failing run, implements, runs `npx prettier --write .`, `npx ng build`,
`npx ng test --watch=false`, reports the diff and both runs. [fable] runs `git diff` and the tests
itself, shows Tom the real output, waits for "commit", one conventional commit per slice with the
Co-Authored-By trailer, pushes with the gh credential helper. No new dependencies. Nothing outside
the slice. Delete `.playwright-mcp/` before every commit (and add it to `.gitignore` in slice 5).

## Step 0 [fable]: record the decisions in the repo

Edit `PLAN.md`: add "Slices 5–7" sections (copies of the slice specs below), update the Display
table (images, amenities, Back link rows), the Slice 4 sheet rule (selection no longer expands;
expanded is 70dvh), the Slice 3 camera rule (`fitBounds` never animates; top padding 40), remove
"Photo gallery" from Deferred, add the Model routing lines for this session, and the session 7
time log row at the end. Commit as `docs: add session 7 plan to PLAN.md`.

## Slice 5: page bar, sheet behavior, camera, Pass A items [opus]

Files: `src/app/parks-page.{ts,html,css,spec.ts}`, `src/app/panel/park-panel.{html,css,ts,spec.ts}`
(Back link removal and the two focus-effect items only), `src/app/map/park-map.{ts,html,css,spec.ts}`,
`.gitignore`.

Behavior:

- `parks-page.html`: `<main #sheet [class.is-expanded]="expanded()">` → `<div class="panel-bar">`
  (rendered at every width) → `<div id="sheet" class="sheet-content">` → `<app-park-panel …>`.
  All three bar controls are icon-only, 44×44 minimum, tertiary fill, no visible text; each
  carries an `aria-label` and a matching `title`, and its inline SVG is `aria-hidden="true"` with
  `stroke="currentColor"`. The bar's left slot: when `id() !== undefined`,
  `<a class="back" routerLink="/parks" aria-label="Back to parks" title="Back to parks">` with a
  chevron-left SVG (`<`), moved here from the panel, including the not-found case; otherwise
  `<button type="button" class="recenter" aria-label="Recenter map" title="Recenter map" (click)="recenter()">`
  with a crosshair SVG (circle plus four ticks). The bar's right slot, only `@if (isMobile())`:
  the sheet toggle `<button type="button" class="sheet-toggle" [attr.aria-expanded]="expanded()" aria-controls="sheet" [attr.aria-label]="expanded() ? 'Show less' : 'Show more'" [title]="…same…">`
  with one chevron-up SVG (`^`) that gets `transform: rotate(180deg)` via `main.is-expanded .sheet-toggle svg`
  so it points down when expanded; `transition: transform 200ms ease` (the global reduced-motion
  rule makes it instant). CSS for the bar:
  `display: flex; justify-content: space-between; align-items: center; gap; padding`. Shift+Tab
  from the details heading reaches the bar because it precedes the sheet content in DOM order:
  on desktop that is Back directly, on mobile the toggle first and Back second (DOM order stays
  logical, the keyboard walk in Pass C says so).
- `ParkPanel` loses both `<a class="back">` elements and the `.back` rules; everything else in the
  panel is untouched in this slice.
- Sheet state: `expanded = linkedSignal({ source: this.id, computation: () => false })`: every
  navigation (open, switch, back) returns the sheet to peek; only the toggle expands it;
  `onMapFocusIn` still collapses it. `recenter()` increments a `fitRequest = signal(0)` and, when
  `isMobile()`, sets `expanded` to false so the map is visible.
- `parks-page.css`: `main.is-expanded { height: 70dvh }` (was 85). Remove the desktop
  `main { overflow-y: auto }` rule (Pass A 9); `.sheet-content` is the one scroll container at
  every width. Keep the 768 keep-in-sync comments.
- `ParkMap`: new `fitRequest = input(0)`, read inside the camera effect so a change re-runs
  `moveCamera` (no selection → fit). `fitBounds` options become
  `{ paddingTopLeft: [24, 40], paddingBottomRight: [24, 24 + offset], animate: false }` (Pass A 8
  and the zoom-out fix, with a comment naming the Leaflet behavior). `setView` for a selected park
  keeps `{ animate }` from the reduced-motion check.
- Requests during a running zoom animation: Leaflet checks `_animatingZoom` before it looks at
  `animate: false`, so a camera call that lands while a wheel zoom or an animated park `setView`
  is still running (250ms) is silently dropped. `ParkMap` keeps a private `zooming` flag set by
  `leafletMap.on('zoomstart')` and cleared by `on('zoomend')` (both fire synchronously for a
  non-animated reset, so the flag is only true mid-animation). `moveCamera` stores its arguments
  in a `pending` field and, when `zooming` is true, returns at once; the `zoomend` handler runs
  the latest `pending` request and clears it. The latest requested view therefore always lands
  after the animation finishes.
- Marker key handling (Pass A 4): the `keypress` handler emits on `keyCode === 13` or
  `key === ' '` / `keyCode === 32`, calling `originalEvent.preventDefault()` for Space so the map
  does not scroll.
- `park-map.html`: `<div #container role="region" aria-label="Map of parks"></div>` (Pass A 3).
- `park-map.css`: delete the `.park-map .park-pin:focus-visible` rule (Pass A 5, the global one
  applies).
- `park-panel.ts` focus effect: delete the unreachable `untracked(this.loading)` guard and its
  `untracked` import (Pass A 1); keep the `id !== this.lastFocusedId` guard with a comment that it
  stops a re-run with the same id (for example a `viewChild` signal change) from re-stealing
  focus (Pass A 2).
- Pass A 6 (native `title` plus Leaflet tooltip) and 7 (`void this.router.navigate`) stay as they
  are; 6 gets a README sentence. Pass A 10 is resolved by `animate: false`.
- `.gitignore`: add `.playwright-mcp/`.

Tests first:

- `parks-page.spec.ts`: on desktop the bar shows a button with `aria-label="Recenter map"` and no
  toggle; opening a park replaces it with the Back link (`a[href="/parks"]`,
  `aria-label="Back to parks"`, empty trimmed text, one `svg[aria-hidden="true"]`) inside
  `main .panel-bar`, and the link precedes the `h2` in DOM order; the not-found URL also shows
  the Back link. Mobile block: toggle starts `aria-expanded="false"` with `aria-label="Show more"`
  and empty trimmed text; navigating to a park keeps `"false"`; toggle click → `"true"` and
  `aria-label="Show less"` and `main.is-expanded`, then navigating back → `"false"`; `focusin` on
  the Leaflet container → `"false"`; clicking Recenter after a toggle expand → `"false"`; the bar
  holds Recenter in list mode and Back in details mode; `main` precedes `aside`. The existing
  "navigating to a park expands" and "Show more"/"Show less" text assertions are replaced, not
  kept.
- `park-panel.spec.ts`: the not-found case no longer looks for a Back link inside the panel (it
  asserts the heading and focus only); the "does not steal focus" case focuses the `h3` or another
  element inside the article instead of the removed Back link; every other case unchanged.
- `park-map.spec.ts`: `keypress` with `key: ' '`, `keyCode: 32` emits the id; the container has
  `role="region"`; a `fitRequest` change with no selection leaves every pin's `is-selected` off;
  firing `zoomstart` on the Leaflet map, then changing `selectedId`, then firing `zoomend` ends
  with `is-selected` on the new pin and the map's `getZoom()` at 15 (jsdom has no size, so
  `fitBounds` results are checked in the browser only).

Done when: tests green, build clean, Prettier clean, diff shown, Tom says commit.
Commit: `feat(page): own the panel bar, keep the sheet on selection, fix list refit`.

## Slice 6: details layout, amenity emoji, photo stack [sonnet]

Files: `src/app/panel/park-panel.{html,css,ts,spec.ts}`, new `src/app/panel/amenity-emoji.ts`
and `amenity-emoji.spec.ts`.

Behavior (same template at every width):

- `amenity-emoji.ts`: `export function amenityEmoji(label: string): string` looks up
  `label.trim().toLowerCase()` in a `Record<string, string>` and returns `'🌳'` for an unknown
  label. The table covers every amenity in the sample, keyed by the normalized label (hyphens are
  already spaces): playground 🛝, dog run 🐕, trails 🥾, restrooms 🚻, parking 🅿️, lake 🏞️,
  picnic areas 🧺, waterfront 🌊, bike path 🚲, wildlife viewing 🦆, splash pad 💦,
  basketball 🏀, water fountain 🚰, sports fields ⚽, gardens 🌷, cafe ☕, gift shop 🛍️,
  accessible paths ♿, fishing 🎣, kayak launch 🛶, event lawn 🎪, wifi 📶, food vendors 🌮,
  boardwalk 🚶, skate park 🛹, lighting 💡. (🛝 needs Emoji 14; older systems show a box. If Tom
  sees that in Pass C, swap to 🎠.)
- Details template order: `<h2 tabindex="-1" #detailsHeading>` → `<div class="summary">` holding
  the existing `<dl>` on the left and, on the right, `<div class="preview">` with
  `<app-park-image class="thumb" aria-hidden="true" [src]="park.images[0]" alt="" />` only when
  `park.images.length > 0` (a decorative duplicate of the gallery below; `aria-hidden` on the
  component host also hides the "No image available" placeholder text when the image fails) and,
  when `park.amenities.length > 0`, `<p class="emoji-row" aria-hidden="true">` with one
  `amenityEmoji(a)` per amenity (the full list below is the accessible version) →
  `<h3>Description</h3><p>` → `@if amenities { <h3>Amenities</h3><ul class="amenities">` with
  `<li><span class="emoji" aria-hidden="true">{{ emoji }}</span><span class="label">{{ amenity }}</span></li>` }
  → `<h3>{{ park.images.length > 1 ? 'Photos' : 'Photo' }}</h3>` → when `images` is empty one
  `<app-park-image [src]="null" [alt]="park.name + ' photo'">`, otherwise one `app-park-image`
  per image (`@for … track $index`), alt `{name} photo` for a single image and
  `{name} photo {n}` (1-based) when there are several. The "and N more" caption and `.caption`
  rule are removed.
- CSS: `.summary { display: grid; grid-template-columns: 1fr auto; gap: var(--space-3); align-items: start }`,
  `.thumb { width: 112px }`, `.emoji-row { margin: var(--space-2) 0 0; max-width: 112px; font-size: 1.25rem; line-height: 1.6; word-break: break-all }`,
  `.amenities { list-style: none; padding: 0; display: grid; gap: var(--space-1) }`,
  `.amenities li { display: flex; gap: var(--space-2) }`, gallery frames stacked with
  `gap: var(--space-2)`. The `article` gets `container-type: inline-size` and
  `@container (max-width: 339.98px) { .summary { grid-template-columns: 1fr } }` so the summary
  stacks when the panel itself is narrow (a 320px desktop column or a small phone), not just at
  a viewport width; `dd { overflow-wrap: anywhere }` so a long address wraps instead of pushing
  the thumb out. Pass C checks the stack at 320px wide and with text zoomed to 200%.
- `ParkPanel` exposes `protected readonly amenityEmoji = amenityEmoji`.

Tests first:

- `amenity-emoji.spec.ts`: every distinct amenity label from `normalizeParks(sample)` maps to
  something other than `'🌳'`; `'Dog run'`, `'dog run'`, `' DOG RUN '` all give `'🐕'`;
  `'Zip line'` gives `'🌳'`.
- `park-panel.spec.ts` (replace the photo and amenity cases): Highland amenities → `.label`
  texts `['Dog run', 'Restrooms', 'Parking', 'Water fountain']` and `.emoji` texts
  `['🐕', '🚻', '🅿️', '🚰']`; the emoji row and the `app-park-image.thumb` host both have
  `aria-hidden="true"` and the thumb `img` has an empty alt; Prospect
  Park renders a thumb plus two gallery frames (three `.skeleton`), heading "Photos", gallery alts
  `Prospect Park photo 1` and `Prospect Park photo 2`, no `.caption` anywhere; `error` on the
  first gallery `img` → one placeholder, the other frame still loading; Riverside Commons → one
  gallery frame, heading "Photo", alt `Riverside Commons photo`; Cedar Hill → no thumb, the
  emoji row present (it has amenities), one placeholder, no skeleton; NOWHERE → no thumb and no
  emoji row, one placeholder. Focus cases unchanged.

Done when: tests green, build clean, Prettier clean, diff shown, Tom says commit.
Commit: `feat(panel): compact summary, amenity emoji, and photo stack`.

## Slice 7: palette as fills, per-park pin colors [sonnet]

Files: `src/styles.css`, `src/app/app.css`, `src/app/parks-page.css`, `src/app/panel/park-panel.{html,css,ts,spec.ts}`,
`src/app/map/park-map.{ts,css,spec.ts}`, new `src/app/map/pin-colors.ts` and `pin-colors.spec.ts`.

Behavior:

- Tokens: the seven hex values stay exactly as Tom picked them. Add
  `--color-primary-tint: color-mix(in srgb, var(--color-primary) 8%, white)` next to the existing
  `--color-surface-tint`.
- Fills: `app.css` header `background: var(--color-primary)`, `h1 { color: var(--color-surface) }`,
  border-bottom `var(--color-primary-dark)`. `parks-page.css` `.panel-bar { background: var(--color-secondary) }`
  (buttons and the Back link stay tertiary on it; the recenter icon button is
  `color: var(--color-surface); background: transparent; border: 1px solid var(--color-surface)`),
  the mobile sheet border-top `var(--color-primary-light)`. The tertiary focus ring is only
  about 2.1:1 against the brown bar, under the 3:1 a custom focus indicator needs, so
  `parks-page.css` adds `.panel-bar :focus-visible { outline-color: var(--color-surface) }`
  (white on `#41220c` is 13:1); the global ring stays tertiary everywhere else. Pass C checks the
  computed outline color on each bar control. `park-panel.css` list dividers
  `var(--color-primary-light)` at 40% via `color-mix`, link hover and focus background
  `var(--color-primary-tint)`, `h3` and `dt` already `var(--color-secondary)`, amenities `li`
  background `var(--color-primary-tint)` with `border-radius: var(--radius)` and small padding.
  All text keeps 4.5:1 (white on `#1e3d05` is 12:1, white on `#41220c` 13:1, tertiary on
  `#41220c` is not text).
- `pin-colors.ts`: `export const PIN_PATH = 'M14 0C6.3 0 …z'` (the path now inlined in
  `park-map.ts`), `export const PIN_COLORS = ['#c1121f', '#e36414', '#b8860b', '#2a9d3f', '#0f766e', '#0284c7', '#6d28d9', '#c026d3', '#be185d', '#8d5524', '#475569', '#6b8e23'] as const`,
  `export function pinColor(index: number): string` returning `PIN_COLORS[index % PIN_COLORS.length]`.
  Index is the park's position in the `parks` input (all parks, not only those with coordinates),
  so list and map agree. Tune the hues if Tom asks in Pass C, nowhere else.
- `ParkMap.buildMarkers`: iterate with the index; the `divIcon` html uses `PIN_PATH`; on `'add'`
  set `element.style.color = pinColor(index)` beside the `aria-label`. CSS: `.park-pin` keeps
  `color: var(--color-primary)` as the fallback; `.is-selected svg` keeps `scale(1.3)` and gains
  `path { stroke: var(--color-tertiary); stroke-width: 2px; paint-order: stroke }` so the selected
  pin is marked in the accent without losing its own color.
- `ParkPanel` list item: `<a #parkLink …><svg class="pin" aria-hidden="true" viewBox="0 0 28 40" width="14" height="20" [style.color]="pinColor($index)"><path fill="currentColor" [attr.d]="PIN_PATH" /></svg>{{ park.name }}</a>`,
  with `@for (park of parks(); track park.id)` using `$index`; `.park-list a { display: flex; align-items: center; gap: var(--space-2) }`.
  Link text tests still read `park.name` because the svg has no text.

Tests first:

- `pin-colors.spec.ts`: 12 distinct colors; `pinColor(0)` is the first, `pinColor(12)` wraps to
  the first.
- `park-panel.spec.ts`: each of the 12 links holds one `svg.pin` whose inline color equals
  `pinColor(i)`; link text unchanged.
- `park-map.spec.ts`: the pin for the first sample park has inline `color` `pinColor(0)` and the
  twelfth `pinColor(11)`; selection still moves `is-selected` only.

Done when: tests green, build clean, Prettier clean, diff shown, Tom says commit. Tom said one
extra feedback round on colors may follow; that round is a [sonnet] follow-up inside this slice.
Commit: `feat(style): apply the palette as fills and color each pin`.

## Wrap-up (PLAN.md steps 2–6)

1. Pass B: Tom runs the external Codex review; [fable] triages, writes accepted items into
   PLAN.md, and sends fixes to a subagent per the slice tag.
2. Pass C [sonnet]: Playwright MCP against the port 4200 dev server
   (`lsof -nP -iTCP:4200 -sTCP:LISTEN`; start `npm start` if gone), 375×667 and 1280×800:
   header green with white title, bar brown with the `<` Back icon left and the `^` toggle icon
   right, each 44px or taller with its `title` on hover; selecting a park on mobile keeps the
   sheet at peek and the map at zoom 15 on the pin; toggle → `main` height 70dvh with pins
   visible above it and the chevron pointing down (computed transform is a 180° rotation); Back → record every pin's `getBoundingClientRect()` on first
   load and again after Back, all equal within 1px; zoom the map by wheel, click Recenter → the
   same rectangles; every pin's computed color matches the list's svg color for the same park;
   emoji row and labelled amenities; Prospect Park shows two gallery frames and no caption;
   in-flight zoom: with `browser_run_code_unsafe` dispatch a wheel zoom on the map and click
   Recenter in the same tick, wait 400ms, pin rectangles equal the first-load ones; likewise
   select a park then click Back in the same tick, same result; keyboard walk on desktop (Tab →
   Recenter → first link → Enter → heading → Shift+Tab → Back → Enter → link focused) and on
   mobile (… heading → Shift+Tab → toggle → Shift+Tab → Back → Enter → link focused), each bar
   control showing a white ring on the brown bar; summary stacks at 320px wide and at 200% text
   zoom with a long address; Space on a focused pin opens its details; no element under 16px;
   reduced-motion emulation shows no pan animation. Report screenshots and findings; [fable]
   reviews.
3. README.md draft [sonnet] with the PLAN.md step 4 list plus: the palette decision (dark hexes
   used as fills), per-park pin colors by list position, `amenity-emoji.ts` as the single mapping,
   the recenter button, sheet behavior (selection keeps peek, 70dvh expanded), the Leaflet
   drop-while-animating note behind `animate: false`, both tooltips on hover, example.com images.
   Tom edits.
4. [fable] Export every `.jsonl` in `~/.claude/projects/-Users-tom-park-finder/` unredacted into
   `ai-logs/claude/` (not committed; nine files plus this session's), and confirm the subagent
   transcripts for every delegated slice are inside those files (search each for the slice's
   subagent prompt). Tom exports every Codex conversation (the session 3 plan review, this plan's
   review, and Pass B) unredacted into `ai-logs/codex/`; the brief requires logs from every tool
   used, and the README's "how it was checked" names both folders.
5. [fable] Zip: `git archive` of main plus `ai-logs/`.
6. [fable] Session 7 time log row, then `/handoff`.

## Model routing (this session)

Same method as PLAN.md "Model routing": Fable oversees and never writes slice code; the model is
passed explicitly on every subagent call; one subagent per slice, no model switch inside a slice;
Fable runs `git diff` and the tests itself and shows Tom the real output; Tom says commit.

| Step                          | Model    | Why                                                        |
| ----------------------------- | -------- | ---------------------------------------------------------- |
| Step 0 PLAN.md, triage, logs  | [fable]  | Decision record and accountability stay in one place      |
| Slice 5 page, sheet, camera   | [opus]   | Leaflet camera timing, focus, and zoneless signal wiring   |
| Slice 6 panel layout, emoji   | [sonnet] | Template and CSS work with exact expected values           |
| Slice 7 fills and pin colors  | [sonnet] | Styling plus a small pure helper; color round may follow   |
| Pass C browser verification   | [sonnet] | Scripted Playwright checks against listed expectations     |
| README draft                  | [sonnet] | Content list is fixed; Tom edits the final                 |
| Searches / grunt work         | [haiku]  | None planned; the codebase is 7 components and fully read  |

Distribution: Fable oversight and docs, 1 Opus slice, 2 Sonnet slices plus Pass C and README,
0 Haiku. Escalation: a bug not obvious after one look comes back to [fable], logged in PLAN.md.

## Verification summary

- Per slice: `npx ng test --watch=false` (expect 7 → 9 spec files, all green), `npx ng build`
  (no warnings), `npx prettier --check .`, `git diff` reviewed by [fable] and Tom.
- End to end: Pass C list above, at both viewports, plus a manual look by Tom on his phone for
  the color round.
