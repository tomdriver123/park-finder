# PLAN.md

Build order for the Park Finder take-home. Four slices, one session each, one commit each, then
three review-fix slices in session 7 (Slices 5–7 below) and the wrap-up.
CLAUDE.md is the contract; this file lists what is in scope, in what order, and the decisions
CLAUDE.md leaves open. Optional brief items (search, filters, location) are not listed, so they are
out of scope. Deferred items at the end are known gaps, not scope.

## Session protocol

Steps are tagged with who runs them: [fable] this overseeing session, [opus] or [sonnet] a
subagent with that model passed explicitly. See Model routing below.

1. [fable] Read, in order: the handoff Tom names (normally the newest `handoffs/handoff-N.md`),
   CLAUDE.md, `docs/local-parks-candidate.pdf`, `public/assets/parks.sample.json`, this file.
   Sessions 4 and 5 run in parallel (decided in session 3): slice 2 on main from handoff-3, slice
   3 in the worktree `../park-finder-slice-3` on branch `slice-3` from handoff-4. Slice 2 commits
   first; slice 3 rebases, wires the map into parks-page, and fast-forwards main. Handoff numbers
   for those sessions are fixed in the handoffs (5 for slice 2, 6 for slice 3).
2. [all] Every shell command starts with
   `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 24.21.0 >/dev/null;`
   Use `npx ng`, never bare `ng`.
3. [fable] Launch the slice's subagent with CLAUDE.md, this file, and the slice prompt, model
   passed explicitly per the slice tag.
4. [subagent] Tests first. Write the slice's specs with expected values taken from CLAUDE.md and
   the Decisions below, run `npx ng test --watch=false` and capture the failing run, implement,
   capture the passing run. Then `npx prettier --write .`, `npx ng build`,
   `npx ng test --watch=false`, all clean. Report the diff and both test outputs.
5. [fable] Run `git diff` and `npx ng test --watch=false` yourself and show Tom the real output,
   never the subagent's summary. Wait for Tom to say "commit".
6. [fable] One conventional commit per slice, Co-Authored-By trailer kept. Push with
   `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push`.
7. [fable] Log the session's minutes in the Time log below. End with `/handoff`.
8. [all] Unclear requirement: ask before building. Nothing outside the slice. No new dependencies.

## Decisions (settled in sessions 1 and 2; apply without asking)

Fable oversees because review and accountability stay in one place. The slices are delegated
because the rules are already settled in CLAUDE.md and this file. The split is a time decision
made at 01:40 EDT on 2026-10-08.

### Data (normalize.ts)

| Field / case                                                                  | Rule                                                                                                                                |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Top-level not an array                                                        | `normalizeParks` throws; the service reports "Could not load parks."                                                                |
| Fetch failure or invalid JSON                                                 | `error` = "Could not load parks.", `parks` = [], `loading` = false                                                                  |
| Empty array                                                                   | `parks` = [], panel shows "No parks to show."                                                                                       |
| `id` missing, null, non-string, or blank                                      | Row dropped (`normalizePark` returns null)                                                                                          |
| Duplicate `id`                                                                | First row kept                                                                                                                      |
| `name` missing or blank                                                       | `name` = the id text                                                                                                                |
| Any string field                                                              | Trimmed; blank becomes null                                                                                                         |
| Wrong type (rating `"4.7"`, amenities `"trails"`)                             | Treated as missing (null or []); never coerced                                                                                      |
| `location` missing, or lat/lng not finite or out of range (lat ±90, lng ±180) | `coordinates` = null; park stays in list and details; no marker                                                                     |
| `location.address`                                                            | Trimmed string or null; shown verbatim, never append a city                                                                         |
| `amenities`                                                                   | Readable labels: drop non-strings and blanks, trim, hyphens to spaces, capitalize the first letter (`dog-run` → `Dog run`); else [] |
| `hours`                                                                       | Verbatim string or null                                                                                                             |
| `images`                                                                      | Non-blank strings only; else []                                                                                                     |
| `acreage`, `rating`                                                           | Finite number or null (0 is a value, not missing)                                                                                   |

Fallback strings live in templates, never in the data, so "never invent values" holds at the data
layer.

### Display (ParkPanel)

| Case                                    | Rule                                                                                                                                                                                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| description null                        | "No description available."                                                                                                                                                                                                                                   |
| address null, coordinates present       | `40.6789, -73.9442` (numbers verbatim, comma and space)                                                                                                                                                                                                       |
| address and coordinates both null       | "Location not available"                                                                                                                                                                                                                                      |
| hours null / acreage null / rating null | Row hidden                                                                                                                                                                                                                                                    |
| acreage                                 | `212 acres`                                                                                                                                                                                                                                                   |
| rating                                  | Bare number (`4.7`); no scale, the data states none                                                                                                                                                                                                           |
| amenities []                            | Section hidden, and no emoji row in the summary                                                                                                                                                                                                               |
| amenities (session 7)                   | Summary holds an `aria-hidden` emoji row (one emoji per amenity from `amenity-emoji.ts`, unknown label → 🌳); the Amenities list shows `aria-hidden` emoji plus the text label per item                                                                       |
| images (session 7)                      | Summary holds a decorative `aria-hidden` thumbnail of the first image beside the `<dl>`; a "Photo" (one) / "Photos" (several) section stacks one frame per image, alt `{name} photo` for one, `{name} photo {n}` (1-based) for several; no caption            |
| image fails to load                     | Placeholder in the frame with visible text "No image available"                                                                                                                                                                                               |
| images []                               | One placeholder, no skeleton, no caption, no thumbnail                                                                                                                                                                                                        |
| unknown id in the URL                   | "Park not found" heading; only once loading is over and `error` is null (a load failure shows the error, never "not found"). The Back link is in the page bar (next row), not in the panel                                                                    |
| Back link (session 7)                   | Owned by ParksPage: icon-only `<a routerLink="/parks">` with a `<` chevron, `aria-label` and `title` "Back to parks", shown whenever `id()` is set (including not found). Projected into the panel bar's start slot (Slice 8). ParkPanel renders no Back link |
| list item text                          | Park name only                                                                                                                                                                                                                                                |
| h1 / document title                     | "Park Finder". The municipality is New York City (the sample's coordinates and addresses); the README says so. The UI names no city because the park names are invented and real borough labels would sit under fictional parks                               |

### Styling

Tokens live in `src/styles.css` on `:root`. No global classes. Components use `var()` in their own
scoped stylesheets. Tertiary is the one accent color.

```css
--color-primary: #1e3d05; /* headings, brand chrome, default pin */
--color-primary-dark: #082301; /* body text */
--color-primary-light: #4e5809; /* subtle chrome, list dividers */
--color-secondary: #41220c; /* labels (dt), secondary headings */
--color-secondary-dark: #2d0d01;
--color-secondary-light: #5b3011; /* muted text, captions */
--color-tertiary: #2c4cd1; /* the accent: buttons, links, selected pin, focus ring */
--color-surface: #ffffff;
--color-surface-tint: color-mix(in srgb, var(--color-tertiary) 8%, white); /* selected row */
--color-border: color-mix(in srgb, var(--color-primary) 20%, white);
--focus-ring: 3px solid var(--color-tertiary);
--font: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--space-1: 4px;
--space-2: 8px;
--space-3: 16px;
--space-4: 24px;
--radius: 8px;
```

All seven colors pass 4.5:1 on white (lowest: tertiary at 6.9:1); white on tertiary is 6.9:1.
styles.css also holds `:focus-visible { outline: var(--focus-ring); outline-offset: 2px }`, the
reduced-motion rule (`animation` and `transition` durations to 0.01ms under
`prefers-reduced-motion: reduce`), and one base block
(`html, body { margin: 0; font: 16px/1.5 var(--font); color: var(--color-primary-dark); background: var(--color-surface) }`).

ParkMap is the one component with `encapsulation: ViewEncapsulation.None`, because Leaflet creates
marker DOM outside Angular's view. Every rule in `park-map.css` is prefixed with `.park-map` (set
with `host: { class: 'park-map' }`).

Prettier uses the scaffold's `.prettierrc` (printWidth 100, singleQuote, angular HTML parser).

### Architecture

| File                             | Role                                                                                                                                                                                                                                               |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/app.ts` (+html/css)     | Root shell: `<header><h1>Park Finder</h1></header><router-outlet />`. Replaces the scaffold placeholder in slice 2.                                                                                                                                |
| `src/app/app.routes.ts`          | `''` → `/parks`; one `UrlMatcher` route matching `parks` and `parks/:id` → `ParksPage`; `**` → `/parks`.                                                                                                                                           |
| `src/app/app.config.ts`          | `provideHttpClient()`, `provideRouter(routes, withComponentInputBinding())`.                                                                                                                                                                       |
| `src/app/parks-page.ts`          | Routed page. `id = input<string>()`. Injects ParksService. Owns `<main>` (panel) and `<aside>` (map), handles the map's `select` with `router.navigate`, owns sheet state and (session 7) the panel bar: Back link, Recenter button, sheet toggle. |
| `src/app/data/park.ts`           | `Park` type.                                                                                                                                                                                                                                       |
| `src/app/data/normalize.ts`      | `normalizePark(raw: unknown): Park \| null`, `normalizeParks(raw: unknown): Park[]`. Pure. Only ParksService imports it.                                                                                                                           |
| `src/app/data/parks-service.ts`  | `ParksService` (`providedIn: 'root'`), `HttpClient.get('/assets/parks.sample.json')` started in the constructor; signals `parks`, `loading`, `error`.                                                                                              |
| `src/app/panel/park-panel.ts`    | `ParkPanel`: inputs `parks`, `loading`, `error`, `selectedId`; renders list or details; focus management.                                                                                                                                          |
| `src/app/panel/park-image.ts`    | `ParkImage`: inputs `src: string \| null`, `alt`; `state` is a `linkedSignal` on `src`: loading / loaded / error, reset whenever `src` changes.                                                                                                    |
| `src/app/map/park-map.ts`        | `ParkMap`: inputs `parks`, `selectedId`, `centerOffset`, `fitRequest` (session 7); output `select`.                                                                                                                                                |
| `src/app/map/pin-colors.ts`      | (session 7) `PIN_PATH`, `PIN_COLORS`, `pinColor(index)`; pin color by position in the `parks` list, shared by the map and the list.                                                                                                                |
| `src/app/panel/amenity-emoji.ts` | (session 7) `amenityEmoji(label)`: the single label → emoji mapping, 🌳 for an unknown label.                                                                                                                                                      |

Why one matcher route instead of two routes to the same component: Angular reuses a routed
component only when the route config object is the same, so `parks` and `parks/:id` as two entries
would destroy and recreate the page on every open and close, tearing down the map and the panel
state (the remembered id that focus returns to); a single `UrlMatcher` keeps one config, so the
page persists and only the `id` input changes. This does not preserve list scroll position by
itself: the `@if` that swaps list and details destroys the `<ul>`. The list is brought back to the
right place by focusing the restored link, since `focus()` scrolls the element into view; no
scroll position is saved by hand.

Every component: standalone, `ChangeDetectionStrategy.OnPush`, `inject()`, `input()` / `output()`,
built-in control flow, template and styles in sibling `.html` / `.css` files like the scaffold.
ParkPanel and ParkMap take data as inputs from the page and never inject ParksService, so their
tests set inputs and `parks-page.spec.ts` is the one integration test.

```ts
export interface Park {
  id: string;
  name: string;
  description: string | null;
  coordinates: { lat: number; lng: number } | null;
  address: string | null;
  amenities: string[];
  hours: string | null;
  images: string[];
  acreage: number | null;
  rating: number | null;
}
```

## Slice 1: data and tokens [sonnet]

Files: `src/app/data/park.ts`, `normalize.ts`, `normalize.spec.ts`, `parks-service.ts`,
`parks-service.spec.ts`; `src/app/app.config.ts` (add `provideHttpClient()`); `src/styles.css`.

Tests first (`normalize.spec.ts` imports `public/assets/parks.sample.json` directly; this
type-checks with the current tsconfig):

- Highland Dog Park → `address` null, `coordinates` `{ lat: 40.6789, lng: -73.9442 }`.
- Old Mill Botanical Garden → `description` null; every other field present.
- Cedar Hill Nature Preserve → `rating` null, `images` [].
- Whole sample → 12 parks in file order, all with coordinates; Prospect Park amenities →
  `['Playground', 'Dog run', 'Trails', 'Restrooms', 'Parking', 'Lake', 'Picnic areas']`.
- Hand-written edge rows: no id → null; blank name → name is the id; location missing →
  coordinates null, park kept; lat 95 → coordinates null; rating `"4.7"` → null; rating 0 → 0;
  images `[null, '', ' a.jpg ']` → `['a.jpg']`; amenities null → []; description `'   '` → null;
  duplicate id → one park; non-array input → throws.
- `parks-service.spec.ts` with `provideHttpClient()` and `provideHttpClientTesting()`: `loading`
  true before flush; flushing the sample → 12 parks, loading false, error null; HTTP 500 → parks
  [], error "Could not load parks."; non-array body → same error.

Then implement normalize.ts, the service, and styles.css (tokens, focus ring, reduced motion, base
block). Show the failing run, then the passing run. `npx ng build` must still pass (the scaffold
template is untouched until slice 2).

Done when: tests green, build clean, Prettier clean, diff shown, Tom says commit.
Commit: `feat(data): add Park type, normalize, and ParksService with style tokens`.

## Slice 2: ParkPanel, routes, focus [opus]

Files: `src/app/panel/park-panel.*`, `park-image.*`, `src/app/parks-page.*`, `src/app/app.*`
(replace scaffold template, css, spec), `app.routes.ts`, `app.config.ts`
(`withComponentInputBinding()`), `src/index.html` (title "Park Finder").

Behavior:

- List mode (`selectedId` undefined): `<nav aria-labelledby="parks-heading">` with
  `<h2 id="parks-heading">Parks</h2>`, then `role="status"` "Loading parks…" / `role="alert"`
  error / "No parks to show." / `<ul>` of `<li><a [routerLink]="['/parks', park.id]">{{ park.name }}</a></li>`
  with `@for … track park.id`.
- Details mode: `<article>` with `<a routerLink="/parks">Back to parks</a>` (tertiary button
  style; a link because it navigates), `<h2 tabindex="-1">{{ name }}</h2>`, a `<dl>` (Location,
  Hours, Size, Rating per the display rules), `<h3>Description</h3><p>`, `<h3>Amenities</h3><ul>`
  when non-empty, `<h3>Photo</h3>` with one `<app-park-image [src]="park.images[0] ?? null">`
  (the component shows the placeholder when `src` is null) and, when `images.length > 1`, a
  `<p>` caption "and N more photo(s)" in muted text.
- Not found: `<h2 tabindex="-1">Park not found</h2>` plus the back link. Loading with an id shows
  the loading status, not "not found". An `error` with an id shows the `role="alert"` error, not
  "not found" (error takes precedence; see the Display table).
- Focus: an `afterRenderEffect` (not a plain `effect`, so the DOM is ready) focuses the details
  `h2` whenever the details view opens (including deep links and switching parks); the panel
  remembers the last opened id and, once the list has rendered after returning, focuses that link
  (fallback: the "Parks" heading, which gets `tabindex="-1"`). The effect tracks only `selectedId`
  and the `viewChild` / `viewChildren` signals and keeps the last id it acted on in a plain field,
  so image loads, sheet resizes, or any other signal never re-steal focus. No `setTimeout`.
- `ParkImage`: `src = input.required<string | null>()`,
  `state = linkedSignal<'loading' | 'loaded' | 'error'>(() => (this.src() === null ? 'error' : 'loading'))`,
  so every new `src` starts over at loading and a null `src` is the placeholder at once (the
  details `<article>` is reused when switching parks from the map, so a plain `signal` would carry
  a stale loaded/error state into the next park). Skeleton block (`aria-hidden="true"`, shimmer
  animation, static under reduced motion via the global rule) while loading; `<img (load) (error)>`
  writes the signal; placeholder with visible text "No image available" on error. The frame keeps
  a fixed aspect ratio so layout does not jump.
- ParksPage: `<main><app-park-panel [parks]="parks()" [loading]="loading()" [error]="error()" [selectedId]="id()" /></main>`.
  Plain single column for now.
- App: one `h1` "Park Finder"; heading order h1 → h2 → h3.

Tests first (`park-panel.spec.ts` sets inputs with `fixture.componentRef.setInput`, parks from
`normalizeParks(sample)`): 12 links with the right hrefs; Highland shows `40.6789, -73.9442` and
no address; Old Mill shows "No description available."; Cedar Hill has no Rating row, one
placeholder, no skeleton, no caption; Prospect Park has one frame in loading state and the caption
"and 1 more photo", `error` on the img → placeholder, `load` → image visible; Riverside Commons
(one image) has no caption; Highland amenities render as `Dog run`, `Restrooms`, `Parking`,
`Water fountain`; open → `document.activeElement` is the h2; back → activeElement is the link for
that id; unknown id → "Park not found"; error with an id → the error, not "Park not found";
loading, error, and empty messages. `park-image.spec.ts`: `error` on the img then a new `src` →
back to loading; `src` null → placeholder with no skeleton, then a string `src` → loading.
`parks-page.spec.ts` with `provideRouter(routes, withComponentInputBinding())` (the feature is
required or `id` never reaches the input), `RouterTestingHarness`, `HttpTestingController`: `/`
redirects to `/parks` and lists 12 links; `/parks/highland-dog-park` shows the details after
flush; list → park A → park B → list via the harness shows each heading in turn and ends with the
list focused on park B's link; HTTP 500 while on a details URL shows the error, not "Park not
found". Browser Back and Forward are part of the browser walk below. `app.spec.ts`: exactly one h1
with "Park Finder".

Done when: tests green, build clean, keyboard walk in the browser verified with the Playwright MCP
(Tab to the first link, Enter, focus on the heading, Shift+Tab to Back, Enter, focus back on the
link), diff shown, Tom says commit.
Commit: `feat(panel): add ParkPanel list and details with routes and focus`.

## Slice 3: Leaflet map [opus]

Files: `src/app/map/park-map.*`, `parks-page.*` (add `<aside aria-label="Map">`).

Behavior:

- `import { map, tileLayer, marker, divIcon, latLngBounds } from 'leaflet'`. Map created in
  `afterNextRender`; OSM tiles `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, `maxZoom: 19`,
  attribution `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`.
  The map container gets `aria-label="Map of parks"`. No key needed; note the OSM tile usage
  policy in the README. The attribution control is moved to the top right
  (`map.attributionControl.setPosition('topright')`) so the mobile bottom sheet of slice 4 never
  covers it; OSM requires the attribution to stay visible.
- One marker per park with coordinates, built once when `parks()` arrives, kept in a
  `Map<string, Marker>`. Options: `icon` (shared `divIcon`, `className: 'park-pin'`, inline SVG
  pin with `fill="currentColor"`, `iconSize [28, 40]`, `iconAnchor [14, 40]`,
  `tooltipAnchor [0, -36]`), `title: name`, `alt: name`, `keyboard: true`.
  `bindTooltip(label, { direction: 'top' })` where `label` is a `<span>` element with
  `textContent = name` (Leaflet 1.9 treats a string tooltip as HTML, so a name is never passed as
  a string); it opens on hover and on focus. After `addTo`, set
  `aria-label = name` on `getElement()`. `on('click', …)` emits `select` with the id (Enter fires
  click in Leaflet); the page navigates, the route updates the inputs, signals re-render.
- Selection `effect` on `selectedId()` and `centerOffset()`: toggle class `is-selected` and
  `aria-current="true"` on the old and new marker elements, `setZIndexOffset(1000)` on the
  selected one. Never `setIcon`, never remove or re-add. Selected pin: `color: var(--color-tertiary)`
  and `svg { transform: scale(1.3); transform-origin: 50% 100% }` (scale the inner svg, not the
  marker element, because Leaflet positions the marker with an inline `transform`). Default pin
  `color: var(--color-primary)`.
- Camera: selected park with coordinates → `setView(shifted, 15, { animate })` where
  `shifted = unproject(project(latlng, 15).add([0, centerOffset / 2]), 15)`. No selection →
  `fitBounds(all, { paddingTopLeft: [24, 40], paddingBottomRight: [24, 24 + centerOffset], animate: false })`
  (session 7: `fitBounds` never animates, see Slice 5 for the Leaflet drop-while-animating
  reason; top padding 40 so a pin head is never clipped under the header, Pass A item 8).
  The same routine runs when markers are first built (deep link → zoom 15, otherwise fit), and
  again when `fitRequest` changes (session 7, the Recenter button). Skip when there are no
  markers.
- `centerOffset = input(0)`: one number, pixels at the bottom of the map covered by UI (the
  mobile sheet).
- `animate = !(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)`,
  read at each camera move.
- `ResizeObserver` on the host (guarded with `typeof ResizeObserver !== 'undefined'`) →
  `invalidateSize()`; also once after creation. `DestroyRef.onDestroy` → `map.remove()` and
  disconnect.
- `park-map.css` (`ViewEncapsulation.None`, every rule prefixed `.park-map`): pin colors and
  selected scale, `.park-map .leaflet-container { font-size: 1rem }` so attribution and tooltips
  are 16px, map height.
- Page layout for this slice: panel then map, map `height: 60vh`; the real layout is slice 4.
- Nothing depends on the map: list, details, and URL work with the map component removed.

Tests first (`park-map.spec.ts`; Leaflet runs in jsdom with a zero-size container): 12
`.park-pin` elements for the sample, each with `role="button"`, `tabindex="0"`, `title` and
`aria-label` equal to the name; an edge park named `<b>Bold</b> Park` shows a tooltip whose
`textContent` is that literal string and contains no `<b>` element; an edge park without
coordinates gets no pin; `selectedId` moves
`is-selected` between pins and the 12 pin nodes are the same objects before and after (never
re-added); click on a pin emits `select` with the id; `keypress` keyCode 13 emits; dispatching
`focus` on a pin shows a `.leaflet-tooltip` with the name. Camera behavior (zoom 15, fit bounds,
offset, animate false) is checked in the browser and recorded in the README.

Done when: tests green, build clean, browser check (markers, hover and focus tooltips, Tab through
markers, Enter opens details, list selection zooms, back fits bounds, reduced-motion emulation
shows no pan animation), diff shown, Tom says commit.
Commit: `feat(map): add Leaflet map with keyboard-accessible markers`.

## Slice 4: responsive layout and bottom sheet [sonnet]

Files: `parks-page.*` (layout, sheet state, offset), `park-panel.css`, `app.css`.

Behavior:

- DOM order is header, `<main>` (panel), `<aside>` (map) at every width, so keyboard users reach
  the list first.
- 768px and up: grid, panel column `minmax(320px, 400px)` scrolling, map fills the rest, full
  viewport height. `centerOffset` 0.
- Under 768px: map fills the viewport under the header. `<main>` is a fixed bottom sheet with
  `height: 40dvh` (peek: sheet bar, "Parks" heading, first items) or `70dvh` (expanded; was 85dvh
  until session 7), scrolling inside, height transition (disabled by the reduced-motion rule).
  The sheet bar (session 7: the page's `.panel-bar`, rendered at every width, see Slice 5) holds
  the icon-only `<button type="button" aria-expanded aria-controls="sheet">` toggle with
  `aria-label` "Show more" / "Show less". No drag gestures.
- Sheet state (session 7 rule): `linkedSignal({ source: id, computation: () => false })`: every
  navigation (open, switch, back) returns the sheet to peek so the map zoom is visible; only the
  toggle expands it; Recenter collapses it. A `(focusin)` handler on the `<aside>` sets the sheet
  back to peek when `isMobile()`, so a marker reached by Tab is never focused behind the expanded
  sheet (the focus ring must stay visible). Expanded is 70dvh so pins stay visible above the
  sheet while details are read. (Until session 7 selection expanded the sheet to 85dvh; Tom
  found that hid the map zoom on a phone.)
- `centerOffset = computed(() => (isMobile() ? sheetHeight() : 0))`; `sheetHeight` from a
  guarded `ResizeObserver` on the sheet; `isMobile` from a guarded
  `matchMedia('(max-width: 767.98px)')` with a `change` listener (default false). Keep 768 in sync
  between CSS and TS with a comment.
- Text 16px or larger everywhere (Leaflet override from slice 3), contrast 4.5:1 or better
  (tokens verified), every control labelled, focus ring visible inside the sheet (padding inside
  the scroll container so `overflow` never clips outlines).

Tests first (`parks-page.spec.ts` additions, `matchMedia` stubbed to report mobile): the toggle
button starts `aria-expanded="false"`, click → `"true"`; navigating to a park → `"true"`; back →
`"false"`; expanded then `focusin` dispatched inside the `aside` → `"false"`; `main` precedes
`aside` in the DOM. Browser checks with the Playwright MCP at 375×667 and 1280×800: no element
with computed font-size below 16px (`browser_evaluate`), focus ring visible on a link inside the
sheet, pin and tooltip visible above the peek sheet after selection, attribution visible at
375×667 with the sheet expanded, Tab from the sheet onto a marker collapses the sheet and shows
the ring.

Done when: tests green, build clean, browser checks done, diff shown, Tom says commit.
Commit: `feat(layout): add desktop columns and mobile bottom sheet`.

## Model routing

Set at 01:40 EDT on 2026-10-08. Reason: pace.

- This session, on Fable, oversees everything. It owns this file, reviews every diff and test
  output, triages the Codex findings, and never writes slice code itself.
- Implementation runs in subagents: Opus for the slices with the most moving parts (slice 2,
  panel with focus management and the image frame; slice 3, Leaflet in a zoneless app), Sonnet
  for the rest (slice 1, data layer and tests; slice 4, layout and polish).
- Pass the model explicitly in every subagent call. Never rely on a default.
- Each subagent gets CLAUDE.md, this file, and the slice prompt, builds the slice, runs the tests
  and Prettier, and reports back the diff and test output.
- After each subagent returns, Fable runs `git diff` and `npx ng test --watch=false` itself and
  shows Tom the real output. The subagent's summary is never relayed as the review. Fable waits
  for Tom's go before committing.
- One subagent per slice, no model switch inside a slice.
- Every diff review, commit decision, and scope cut is [fable].
- Debugging where the cause is not obvious after one look comes back to [fable] to decide, and
  the escalation is written in this file when it happens.
- Review passes after slice 4: Pass A is Tom's own read (no tag). Pass B is an external Codex
  review; triage of its findings is [fable]. Pass C is browser verification [sonnet].
- README: draft [sonnet], final edit is Tom's.

### Model routing (session 7)

Same method. Fable oversees and never writes slice code; the model is passed explicitly on every
subagent call; one subagent per slice, no model switch inside a slice; Fable runs `git diff` and
the tests itself and shows Tom the real output; Tom says commit.

| Step                         | Model    | Why                                                       |
| ---------------------------- | -------- | --------------------------------------------------------- |
| Step 0 PLAN.md, triage, logs | [fable]  | Decision record and accountability stay in one place      |
| Slice 5 page, sheet, camera  | [opus]   | Leaflet camera timing, focus, and zoneless signal wiring  |
| Slice 6 panel layout, emoji  | [sonnet] | Template and CSS work with exact expected values          |
| Slice 7 fills and pin colors | [sonnet] | Styling plus a small pure helper; color round may follow  |
| Pass C browser verification  | [sonnet] | Scripted Playwright checks against listed expectations    |
| README draft                 | [sonnet] | Content list is fixed; Tom edits the final                |
| Searches / grunt work        | [haiku]  | None planned; the codebase is 7 components and fully read |

Distribution: Fable oversight and docs, 1 Opus slice, 2 Sonnet slices plus Pass C and README,
0 Haiku. Escalation: a bug not obvious after one look comes back to [fable], logged here.

## Session 7: Tom's review fixes (Slices 5–7)

Tom used the app on a phone and a desktop after slice 4 and found: the green and brown palette is
invisible (every token is applied, but the hex values are so dark they read as black on white);
the "Back to parks" link scrolls away inside the mobile sheet instead of sitting beside "Show
more"; selecting a park on mobile expands the sheet over the map instead of zooming the map; the
details view wastes the sheet's space; only the first photo is shown; returning to the list on
mobile leaves the map zoomed far out; the expanded sheet hides almost all of the map; pins are all
one color so the list and the map cannot be matched by eye; amenities have no icons.

Root cause of the zoom-out bug (confirmed in `node_modules/leaflet/src/map/Map.js`): on Back the
sheet shrinks from 85dvh to 40dvh over 200ms, the ResizeObserver feeds a new `centerOffset` every
frame, and the camera effect calls `fitBounds` each time. The first call has a zoom change above
Leaflet's 4-level threshold and lands instantly, the next frame starts a 250ms zoom animation, and
`_tryAnimatedZoom` returns `true` (call dropped) for every later call while `_animatingZoom` is
set. The last call, with the final sheet height, is the one that is dropped, so the map stays at
an intermediate zoom. Desktop has offset 0 and one call, so it never shows. Fix: `fitBounds` runs
with `animate: false` (list ↔ park moves never animated anyway because of the threshold); park →
park `setView` pans keep animating.

Decisions Tom made (do not re-ask): palette becomes visible as fills (green header bar, brown bar
and section headings, pale green list tint); the page owns one bar with Back on the left and Show
more on the right, the panel loses its own Back link; a recenter button sits in the left slot of
that bar on every width whenever the list is showing; the expanded sheet is 70dvh; Back is a `<`
icon, the sheet toggle is a `^` icon that rotates to point down when expanded, and none of the
bar controls show text.

Assumptions (stated, not asked): the compact two-column details layout applies at every width,
because the desktop column is 320–400px, the same width as a phone; the peek height stays 40dvh;
the recenter button is a crosshair icon in the same style; every icon control keeps an
`aria-label` and `title` so screen readers and hover still get the words; pin colors are assigned
by position in the list, so the list, the map, and the details agree.

Protocol additions for session 7: delete `.playwright-mcp/` before every commit (and add it to
`.gitignore` in Slice 5).

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

## Slice 8: bar title, outlined controls, centered header [sonnet]

Tom's final change after Slices 5–7 (session 7, 04:05 EDT). Files: `src/app/app.css`,
`src/app/parks-page.{html,css,spec.ts}`, `src/app/panel/park-panel.{html,css,ts,spec.ts}`.

Decisions:

- The three bar controls (Back, Recenter, sheet toggle) share one style: white icon, transparent
  background, 1px white border, 44×44 `border-box`, hover `color-mix(white 15%, transparent)`.
  No tertiary fill in the bar any more. The bar has `--space-2` padding on every side.
- The panel heading ("Parks", the park name, or "Park not found") sits in the middle of the brown
  bar in white, centered between the start and end slots. "Park Finder" is centered in the green
  header.
- Structure (decided by [fable] so the focus logic and its specs stay in one place): ParkPanel
  renders the bar (`.panel-bar` grid `44px 1fr 44px`, `.slot` start, `<h2 id="panel-heading" tabindex="-1" #heading>{{ title() }}</h2>`,
  `.slot` end) and a scrolling `.panel-body`; ParksPage projects its controls into the slots with
  `data-slot="start"` / `data-slot="end"` through `<ng-content select>`. The page still owns the
  controls, their handlers, and the sheet state. `.sheet-content` is a flex column with no
  padding; `.panel-body` is the one scroll container with `--space-3` padding inside it.
- `title` is a `computed`: list → "Parks"; details → the park name; unknown id → "Park not found"
  once loading is over and there is no error; while loading or on error with an id → "Parks". The
  not-found body shows "No park matches this link." under the heading. `nav` is labelled by the
  heading (`aria-labelledby="panel-heading"`).
- Focus: one `heading` ref replaces `listHeading` / `detailsHeading`. Details mode focuses the
  heading once per id and only once loading is over (so the heading already reads the park name
  when it is announced); return to list focuses the park link, falling back to the heading.
- Keyboard order in details mode is Back, heading, toggle (mobile), then the body, so Shift+Tab
  from the heading reaches Back on every width.

Verified by [fable] in headless Chrome at 1280×800 and 375×667: title centered on the bar, white
controls 44px, h1 centered, bar bottom padding 8px, the keyboard walk (Tab → Recenter → first
link → Enter → heading with white ring → Shift+Tab → Back → Enter → link focused), deep link
focuses the heading with the park name, no text under 16px.

Commit: `style(panel): title in the bar, outlined controls, centered header`.

## Wrap-up (after slice 4)

1. Pass A: Tom's own read of the code (no tag).
2. Pass B: external Codex review. [fable] triages the findings and writes the accepted ones into
   this file as follow-up items; fixes, if any, go to a subagent per the slice tag.
3. Pass C: [sonnet] browser verification with the Playwright MCP (keyboard walk, markers,
   375×667 and 1280×800, reduced motion), reported as screenshots and findings; [fable] reviews.
4. README.md draft [sonnet], final edit by Tom: run steps (`nvm use`, `npm ci`, `npm start`,
   `npm test`), what works, what was left out (see Deferred), decisions (link this file), data note
   (the sample uses New York City coordinates with sample park names, so real borough labels appear
   under invented parks; Cedar Hill sits on the generic NYC point; no changes were made to the
   sample), known issues (example.com images never load so every frame shows the placeholder; OSM
   tile policy for public use; no backend), how it was checked (tests, keyboard walk, Playwright
   checks, reduced motion, mobile viewport), time spent (both columns of the Time log: focused
   minutes and wall-clock, with a sentence that Tom stepped away from the computer during
   sessions so wall-clock overstates the work), the municipality decision (New York City from the
   data, not named in the UI), next steps before public use.
5. [fable] Export every `.jsonl` in `~/.claude/projects/-Users-tom-park-finder/` unredacted into
   an `ai-logs/` folder next to the source in the zip (not committed).
6. [fable] Zip: `git archive` of main plus `ai-logs/`.

Session 7 amendments: the README also records the palette decision (dark hexes used as fills),
per-park pin colors by list position, `amenity-emoji.ts` as the single mapping, the recenter
button, sheet behavior (selection keeps peek, 70dvh expanded), the Leaflet drop-while-animating
note behind `animate: false`, and both tooltips on hover. Pass C adds the checks for the bar
icons, the sheet staying at peek on selection, equal pin rectangles after Back and after
Recenter (including in-flight zoom), list and map pin colors matching, the emoji row, the photo
stack, the white focus ring on the brown bar, the summary stacking at 320px and 200% text zoom,
and Space on a pin. Logs go to `ai-logs/claude/` (every `.jsonl`, with the subagent transcripts
for each delegated slice confirmed inside) and `ai-logs/codex/` (Tom exports every Codex
conversation: the session 3 plan review, the session 7 plan review, and Pass B); the brief
requires logs from every tool used.

## Deferred (not scope; list in the README)

- Search, filters, and current location (optional in the brief).
- Retry on load failure.

## Plan review (session 3)

Tom had Codex review this plan after slice 1. Decisions on its seven points, all written into the
sections above:

1. Municipality: New York City, from the data, stated in the README and not in the UI (Display
   table). Time cap: Tom's call; the Time log now separates focused minutes from wall-clock.
2. Bottom sheet: attribution moved to the top right (slice 3) and `focusin` on the map collapses
   the sheet (slice 4). Expanded height stays 85dvh (changed to 70dvh in session 7, Slice 5).
3. ParkImage: `state` is a `linkedSignal` on `src`, null `src` is the placeholder, two tests added.
4. Focus: `afterRenderEffect`, "Parks" heading gets `tabindex="-1"`, the effect acts once per id.
5. Scroll: the matcher-route rationale no longer claims scroll preservation; `focus()` on the
   restored link scrolls it into view, and the browser walk checks a park near the bottom.
6. Integration test: `withComponentInputBinding()` in the spec, A → B → list and error-on-details
   cases added, error takes precedence over "not found".
7. Tooltips: an element with `textContent`, never a string; a markup-name test added.

## Time log

The brief asks for approximate time spent. Focused minutes are what the README reports as time
spent; wall-clock is session start to end. They differ because Tom stepped away from the computer
during sessions, and the README says so.

| Session | Work                   | Focused minutes | Wall-clock        |
| ------- | ---------------------- | --------------- | ----------------- |
| 1       | Setup, scaffold, grill |                 | ~45 (23:45–00:30) |
| 2       | This plan              |                 | ~60 (00:35–01:45) |
| 3       | Slice 1, plan review   |                 | ~30 (01:45–02:15) |
| 4       | Slice 2                |                 | ~15 (02:15–02:30) |
| 5       | Slice 3                |                 | ~20 (02:15–02:35) |
| 6       | Slice 4                |                 | ~15 (02:36–02:50) |
| 7       | Slices 5–7, wrap-up    |                 | (03:36–)          |
