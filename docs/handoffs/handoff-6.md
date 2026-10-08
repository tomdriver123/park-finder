# Handoff 6: slice 3 done and on main; next is slice 4

Written 2026-10-08 02:35 EDT at the end of session 5 (slice 3, in the worktree
`../park-finder-slice-3` on branch `slice-3`, fast-forwarded into main). The number is fixed by
handoff-4 section 6. The slice 4 session reads handoff-5 first, then this file.

Read in this order before doing anything: handoff-5.md, this file, CLAUDE.md, PLAN.md,
docs/local-parks-candidate.pdf, public/assets/parks.sample.json. Everything decided is in PLAN.md
"Decisions" and "Plan review (session 3)"; do not re-derive or re-ask it.

## 1. What session 5 did

- The session was launched from `/Users/tom/park-finder` (main tree), not from the worktree.
  Handoff-4 said to stop in that case; instead every command and file write used the absolute
  worktree path, and nothing in the main tree was touched. Consequence for section 7: the
  transcript lives under the main tree's project folder.
- Phase A: one Opus subagent (model passed explicitly) built `src/app/map/park-map.ts`, `.html`,
  `.css`, `.spec.ts` in the worktree before slice 2 existed. Specs first, failing run captured,
  then implementation. 7 map tests. The subagent found one wrong assumption in PLAN.md and
  handoff-4 (section 5, item 1) and reported it instead of guessing.
- Reviewed the diff myself, re-ran tests, build, and Prettier, reported to Tom, waited.
- Phase B, after slice 2 was pushed: `git rebase origin/main` (clean fast-forward), then the same
  subagent (resumed by id) wired the map into `parks-page.*` and added two page spec cases.
- Browser check with the Playwright MCP on port 4300 (section 4).
- Tom's decisions at commit time: add `allowedCommonJsDependencies: ["leaflet"]` to angular.json
  (done, the build warning is gone); leave the three open review items for the wrap-up (section 6).
- Commit `0a64fee feat(map): add Leaflet map with keyboard-accessible markers` on `slice-3`,
  rebased onto `06f768c` (slice 2's second docs commit), then this docs commit, then main
  fast-forwarded and pushed. Tom removes the worktree with
  `git worktree remove ../park-finder-slice-3` and `git branch -d slice-3`.

## 2. Repo state at handoff

Run `git log --oneline` and `git status --short` first. main should be at the docs commit that
contains this file, directly on top of `0a64fee`.

Tests: 7 spec files, 65 tests, all green: app (1), normalize (16), parks-service (4), park-panel
(27), park-image (3), parks-page (7), park-map (7). `npx ng build` is clean with no warnings
(429 kB initial, Leaflet is the extra 158 kB). Prettier clean.

What slice 3 added:

- `src/app/map/park-map.ts`: `ParkMap`, selector `app-park-map`, OnPush,
  `ViewEncapsulation.None`, `host: { class: 'park-map' }`. Inputs `parks` (required),
  `selectedId` (`string | undefined`), `centerOffset` (number, default 0, unused by the page until
  slice 4). Output `select` (park id). Map created in `afterNextRender`, stored in a signal.
  Markers are built by an `effect` that reads `parks()` and the map signal and writes a
  `markers` signal (`Map<string, Marker>`); old markers are removed in the effect's `onCleanup`.
  A second effect reads `markers()`, `selectedId()`, `centerOffset()` and runs the camera routine
  (zoom 15 on the selected pin with the offset shift, else `fitBounds` with padding) and the
  selection toggle (`is-selected`, `aria-current="true"`, z-index offset). `ResizeObserver` on the
  host calls `invalidateSize()` (guarded); `matchMedia` reduced-motion read at each camera move
  (guarded); `DestroyRef.onDestroy` disconnects and removes the map. Attribution control moved
  to the top right.
- `src/app/map/park-map.html`: one `<div #container aria-label="Map of parks">`.
- `src/app/map/park-map.css`: every rule prefixed `.park-map`. Host `display: block; height: 100%`
  and the Leaflet container `width: 100%; height: 100%`, so the parent decides the height.
  `.leaflet-container { font-size: 1rem; font-family: var(--font) }`. Pin `color` primary,
  selected pin tertiary with the inner `svg` scaled 1.3 from its bottom center. A scoped
  `:focus-visible` rule duplicates the global one (section 6, item 3).
- `src/app/parks-page.*`: `<aside aria-label="Map">` after `<main>` with
  `<app-park-map [parks]="parks()" [selectedId]="id()" (select)="onSelect($event)" />`;
  `onSelect` calls `router.navigate(['/parks', id])`. Interim CSS: the aside is `max-width: 48rem;
height: 60vh; margin: 0 auto`, stacked under the panel. Slice 4 replaces this block.
- `parks-page.spec.ts`: two new cases, "renders a pin for each park in the map aside" (12 pins,
  aside labelled Map, `main` immediately before `aside`) and "opens the details when a map pin is
  selected" (DOM click on the Highland pin, one `whenStable`, URL and heading and `is-selected`).
- `angular.json`: `allowedCommonJsDependencies: ["leaflet"]`.

## 3. Your job (slice 4 session)

Follow PLAN.md "Session protocol" and "Slice 4" with a Sonnet subagent, model passed explicitly.
Slice 4 touches `parks-page.*` (layout, sheet state, offset), `park-panel.css`, and `app.css`.
Give the subagent the current contents of those files plus `park-map.css`, so it knows the map
fills whatever height the aside has. Things slice 4 must know about the map:

- Pass `[centerOffset]="centerOffset()"` to `app-park-map`; the input exists and is wired into
  the camera routine (offset / 2 pixel shift on zoom 15, `paddingBottomRight` on fit bounds).
  Nothing else in the map changes for slice 4.
- The aside must have a definite height at every width (the map is 100% of it). The host already
  observes its own size, so a CSS grid or dvh height change re-fits the tiles without extra code.
- Leaflet gives the map container `tabindex="0"` for arrow-key panning, so Tab from the panel
  lands on the container first, then on each marker. The `focusin` handler on the aside from
  PLAN.md Slice 4 will fire for the container as well as the markers; that is fine.
- The attribution is already top right. The slice 4 browser check at 375×667 confirms it stays
  visible with the sheet expanded.
- Delete `.playwright-mcp/` from the main tree before committing (handoff-5 section 5); the
  Playwright MCP writes there even when the dev server runs from another folder.

## 4. Browser check, as seen (Chromium via Playwright MCP, dev server on 4300, 1280×800)

- `/parks`: 12 `.park-pin` elements, each `role="button"`, `tabindex="0"`, `title` and
  `aria-label` equal to the name. Tiles load from tile.openstreetmap.org. Attribution control is
  in `.leaflet-top.leaflet-right`, 16px, inside the map's top edge. Fit bounds lands at zoom 10
  (read from the tile URLs). Full-page screenshot showed the list, then the map underneath.
- Hover on the Highland pin: `.leaflet-tooltip` "Highland Dog Park", opacity 0.9, 16px.
- Focus the last list link, Tab: the Leaflet container (`aria-label="Map of parks"`) with the
  3px tertiary ring. Tab again: the Prospect Park pin, ring visible, its tooltip open.
- Enter on that pin: URL `/parks/prospect-park`, `document.activeElement` is the details h2,
  zoom 15, the pin has `is-selected`, `aria-current="true"`, computed color rgb(44, 76, 209),
  inline z-index 1240, svg transform matrix(1.3, 0, 0, 1.3, 0, 0). 12 pins, same nodes.
- "Back to parks": URL `/parks`, zoom 10, no selected pin, focus on the Prospect Park link.
- Click "East Ridge Trailhead" in the list: zoom 15, that pin selected, h2 focused.
- Animation: list to park and park to list never animate in either mode, because Leaflet skips
  animated zoom when the zoom changes by more than `zoomAnimationThreshold` (4) and these jump
  5 levels. Park to park at zoom 15 is a pan: without the preference, `leaflet-pan-anim` appeared
  on `.leaflet-map-pane` and the pane transform moved over time; with `reducedMotion: 'reduce'`
  emulated, no animation class appeared and the pane transform reset in one step. Zoom, URL,
  heading, and selection were right in both modes.
- Console errors: only `images.example.com` DNS failures from the photo frame.

## 5. Gotchas learned in session 5

1. **Enter on a marker does not fire `click` in Leaflet 1.9.4.** PLAN.md and handoff-4 said it
   does. The Enter-to-click handler (`_onKeyPress`) is attached only by `bindPopup`
   (`node_modules/leaflet/dist/leaflet-src.js` around line 10489). The component listens to the
   marker's `keypress` and emits `select` when `originalEvent.keyCode === 13`. Space does nothing
   (section 6, item 2).
2. **`getElement()` is undefined right after `addTo` when the map has no view yet.** Leaflet
   defers adding layers until the first `setView` / `fitBounds`. The `aria-label` is set in the
   marker's `add` event instead.
3. **Effect loop.** An effect that reads the signal it writes (the markers signal) re-runs
   forever and hangs the test run. The marker-building effect reads `parks()` and the map signal
   only, and removes the previous markers in `onCleanup`.
4. **Leaflet's animation classes live in two places.** `leaflet-zoom-anim` goes on the container,
   `leaflet-pan-anim` on `.leaflet-map-pane`. Observe both when checking reduced motion.
5. **`setView(center, zoom, { animate })` copies `animate` into `options.pan` and
   `options.zoom`.** With `animate: true` a pan animates even when the target is off screen; with
   `animate: false` it is instant. This is what makes the reduced-motion switch work.
6. **The Leaflet container is a Tab stop** (`tabindex="0"`, keyboard panning). One extra stop
   before the markers; the ring shows on it.
7. **Playwright MCP output folder.** It writes `.playwright-mcp/` into the workspace root of the
   session (the main tree), not the dev server's folder. Delete before committing.
8. **The CommonJS warning** for `leaflet` appears only once something imports the component into
   the app. `allowedCommonJsDependencies` in angular.json silences it; Tom approved.
9. Subagent pattern that worked again: exact file list, exact test cases with expected values,
   the shell prefix with the absolute worktree path, a do-not-touch list, no git except
   diff/status, "stop and report instead of guessing", and the failing run verbatim. Resuming
   the same subagent by id for phase B kept its context and took 4 tool uses.

## 6. Review items for the wrap-up (Tom asked to keep these)

Tom's decision at the end of session 5: leave all of these as they are, review in Pass A of the
wrap-up if there is time, and carry accepted ones into PLAN.md as follow-up items. The slice 4
session should not touch them.

1. **`aria-label` on a role-less `<div>`** (`park-map.html`). PLAN.md specifies
   `aria-label="Map of parks"` on the map container. ARIA prohibits naming an element with no
   role, and axe reports it. The `<aside aria-label="Map">` already names the landmark. Options:
   leave it; add `role="region"` (a second, nested landmark); or drop the label and rely on the
   aside. Leaflet itself adds no role to the container.
2. **Space does not activate a marker.** Markers have `role="button"`, and the button convention
   is Enter and Space. Leaflet only forwards `keypress`; a `keydown` check for `' '` in
   `buildMarkers` would add it, about four lines plus a spec case.
3. **Redundant scoped focus rule.** `.park-map .park-pin:focus-visible` in `park-map.css`
   repeats the global `:focus-visible` rule from styles.css. Leaflet's CSS does not override
   outlines on markers (it only sets `outline-offset: 1px` on the container), so the global rule
   already applies. Deleting the scoped rule is safe and keeps the scoped stylesheet to Leaflet
   overrides only.
4. **Two hover tooltips.** Markers carry a native `title` (CLAUDE.md requires it) and a Leaflet
   tooltip, so a long hover shows the browser's tooltip under Leaflet's. Seen in the browser as
   harmless; worth a sentence in the README or dropping `title` in favor of `aria-label` alone.
5. **Interim aside has no side padding.** `main` is padded, the aside is not, so under 48rem the
   map runs edge to edge. Slice 4 replaces the layout, so nothing to do unless slice 4 slips.
6. **`void this.router.navigate(...)`** in `parks-page.ts`. The `void` marks the ignored promise.
   Fine, but if Tom prefers the bare call it is a one-word change.

## 7. Transcripts for the submission

Session 5's transcript is
`~/.claude/projects/-Users-tom-park-finder/1f20808e-3d74-4234-8d35-5b3a5cdb687b.jsonl`. It is in
the main tree's project folder, not `-Users-tom-park-finder-slice-3`, because the session was
launched from the main tree (section 1). Nothing was written under the slice-3 project folder.
Export all `.jsonl` files in `~/.claude/projects/-Users-tom-park-finder/` at wrap-up (PLAN.md
"Wrap-up" step 5); that folder now holds every session.

## 8. Time

Session 5 wall-clock about 20 minutes (02:15–02:35), logged in the PLAN.md time log. Running
total about 170 minutes wall-clock. Focused minutes are Tom's to fill.
