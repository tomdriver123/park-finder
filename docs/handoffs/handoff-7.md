# Handoff 7: all four slices on main; next is the wrap-up

Written 2026-10-08 02:50 EDT at the end of session 6 (slice 4, on main). The wrap-up session
reads this file first.

Read in this order before doing anything: this file, CLAUDE.md, PLAN.md, docs/local-parks-candidate.pdf,
public/assets/parks.sample.json. Everything decided is in PLAN.md "Decisions" and "Plan review
(session 3)"; do not re-derive or re-ask it. Handoffs 5 and 6 hold the review items carried into
section 5 below; read them only if a detail there is unclear.

## 1. What session 6 did

- Built slice 4 through one Sonnet subagent (model passed explicitly), per PLAN.md "Model
  routing". Specs first, failing run captured (3 of 12 page cases failing on a missing toggle),
  implemented, then Prettier, build, tests. 6 tool uses, about 75 seconds.
- Reviewed the diff myself, re-ran `npx ng test --watch=false` (7 files, 70 tests),
  `npx prettier --check .`, `npx ng build` (432 kB initial, no warnings).
- Browser checks with the Playwright MCP at 1280×800 and 375×667 (section 4).
- Tom said commit. `ebaca8c feat(layout): add desktop columns and mobile bottom sheet` is on main
  and pushed. This file and the session 6 time log row are the docs commit on top of it.

## 2. Repo state at handoff

Run `git log --oneline` and `git status --short` first. main is at the docs commit containing this
file, directly on top of `ebaca8c`. Working tree clean. No worktrees, no side branches.

Tests: 7 spec files, 70 tests, all green: app (1), normalize (16), parks-service (4), park-panel
(27), park-image (3), parks-page (12), park-map (7). Build clean. Prettier clean.

What slice 4 added:

- `src/app/parks-page.ts`: `expanded = linkedSignal({ source: id, computation: id => id !== undefined })`;
  `isMobile` signal from a guarded `matchMedia('(max-width: 767.98px)')` with a `change` listener
  removed in `DestroyRef.onDestroy`; `sheetHeight` signal from a guarded `ResizeObserver` on the
  `<main #sheet>` element, set up in `afterNextRender`, disconnected on destroy;
  `centerOffset = computed(() => isMobile() ? sheetHeight() : 0)`; `toggleSheet()`;
  `onMapFocusIn()` collapses the sheet when mobile. `MOBILE_QUERY` constant carries the
  keep-in-sync comment.
- `src/app/parks-page.html`: `<main #sheet [class.is-expanded]="expanded()">` → `@if (isMobile())`
  sheet bar with one `<button type="button" class="sheet-toggle" [attr.aria-expanded] aria-controls="sheet">`
  ("Show more" / "Show less") → `<div id="sheet" class="sheet-content">` holding `app-park-panel`.
  `<aside aria-label="Map" (focusin)="onMapFocusIn()">` with `[centerOffset]="centerOffset()"` on
  the map. DOM order header, main, aside at every width.
- `src/app/parks-page.css`: base rules for all widths (`.sheet-content` scrolls with 16px padding
  so outlines are not clipped; aside `position: relative; isolation: isolate; height: 100%`);
  `@media (max-width: 767.98px)`: main fixed at the bottom, `height: 40dvh`, `.is-expanded`
  `85dvh`, `transition: height 200ms ease`, `z-index: 1`; `@media (min-width: 768px)`: host grid
  `minmax(320px, 400px) 1fr`, main scrolls, aside `min-height: 0`. Both media blocks carry the
  keep-in-sync comment.
- `src/app/app.css`: `:host { display: grid; grid-template-rows: auto minmax(0, 1fr); height: 100dvh }`
  and `router-outlet { display: none }` with a comment, so the routed page is the second row.
- `src/app/panel/park-panel.css`: `.caption` font-size 0.9rem → 1rem (16px floor).
- `src/app/parks-page.spec.ts`: harness is created lazily inside `go()` so a nested describe can
  stub `matchMedia` first; the stub returns `matches: true` only for the mobile query (the map
  asks about reduced motion and must get false). Five new cases: desktop renders no toggle;
  mobile toggle starts `aria-expanded="false"`, click → `"true"` and "Show less" and
  `main.is-expanded`; navigating to a park → `"true"`, back → `"false"`; `focusin` on the Leaflet
  container → `"false"`; `main` precedes `aside`. The sheet-height-to-offset path has no unit test
  (jsdom has no `ResizeObserver`) and was checked in the browser.

## 3. Your job (wrap-up session)

Follow PLAN.md "Wrap-up" steps 1 to 6 in order. In short:

1. Pass A is Tom's own read; the review items are in section 5 of this file. Carry accepted ones
   into PLAN.md as follow-up items; fixes, if any, go to a subagent per the slice tag.
2. Pass B: Tom runs the external Codex review; you triage.
3. Pass C: Sonnet subagent, Playwright MCP, the checks in PLAN.md step 3. The port 4200 dev server
   from session 1 may still be running (section 6).
4. README.md draft by a Sonnet subagent with the content list in PLAN.md step 4; Tom edits. The
   extra README sentences gathered so far are in section 5 under "README notes".
5. Export every `.jsonl` in `~/.claude/projects/-Users-tom-park-finder/` unredacted into
   `ai-logs/` next to the source in the zip (not committed). Section 7 lists them.
6. Zip: `git archive` of main plus `ai-logs/`.

Fill the session 7 row of the PLAN.md time log at the end.

## 4. Browser checks, as seen (Chromium via Playwright MCP, dev server on 4200)

- 1280×800 `/parks`: main 0,69 400×731 and aside 400,69 880×731 (two columns under a 69px
  header); no toggle button; 12 pins; attribution top right; page scroll height equals viewport;
  no element with computed font-size under 16px.
- 375×667 `/parks`: aside 0,69 375×598 (map under the header); main fixed at 0,399 375×268
  (40dvh peek); "Show more" button 44px tall, `aria-expanded="false"`; all 12 pin bottoms at
  y ≤ 365, above the sheet top at 399; no element under 16px.
- Tab → button (3px tertiary ring, `:focus-visible` true). Tab → "Prospect Park" link, ring
  visible, link rect inside the `.sheet-content` rect with 5px to spare on every side.
- Enter → `/parks/prospect-park`: `aria-expanded="true"`, "Show less", main 0,99 375×568 (85dvh),
  h2 focused, tile zoom 15, attribution bottom 91 above the sheet top 99.
- "Show less" → peek; after the transition the selected pin anchor is at y 235 and the visible map
  centre (69 to 399) is y 234, so the `centerOffset / 2` shift is exact. Hover tooltip "Prospect
  Park" at 16px, opacity 0.9, above the sheet.
- Sheet expanded, focus on "Back to parks", Tab → Leaflet container ("Map of parks"), sheet
  collapsed at once (`focusin`), ring visible. Tab → Prospect Park pin, ring
  `solid 3px rgb(44, 76, 209)`, tooltip open, pin above the peek sheet.
- Only console error: `images.example.com` DNS failure from the photo frame.

## 5. Review items for the wrap-up (Pass A)

Tom decided to leave all of these in place and review them in Pass A. From handoff-5 section 6
(slice 2) and handoff-6 section 6 (slice 3), plus two from session 6:

Slice 2, `src/app/panel/park-panel.ts` focus effect:

1. Unreachable guard `untracked(this.loading)` in the return-to-list branch. Delete, or keep as
   defence for a future retry with a comment.
2. Once-per-id guard `id !== this.lastFocusedId` has no scenario today. Keep with a "backup"
   comment, or drop.

Slice 3, map:

3. `aria-label="Map of parks"` on a role-less `<div>` (axe flags it). Leave, add `role="region"`,
   or drop and rely on the aside's label.
4. Space does not activate a marker; Leaflet forwards only `keypress` Enter. About four lines plus
   a spec case to add.
5. Redundant `.park-map .park-pin:focus-visible` rule duplicates the global one. Safe to delete.
6. Two hover tooltips (native `title` plus Leaflet tooltip). README sentence or drop `title`.
7. `void this.router.navigate(...)` in parks-page.ts; one-word change if Tom prefers the bare call.
8. Pin heads at the fit-bounds edge: padding is 24px but the icon is 40px tall, so a pin whose
   point sits at the top padding has its head clipped by a few pixels under the header (seen at
   375×667: one pin top at y 65 against the aside top of 69). Raise the top padding to 40 or
   leave it.

Slice 4, session 6:

9. Desktop has `overflow-y: auto` on both `main` and `.sheet-content`; the outer never scrolls.
   Harmless; drop the `main` rule if Tom wants one scroll container.
10. The `ResizeObserver` fires on every frame of the 200ms sheet transition, so the map camera
    re-runs several times per toggle. Seen smooth in Chromium with an exact end position; under
    reduced motion the transition is 0.01ms so it is one step. No change needed unless Tom sees
    jank on a phone.

README notes gathered so far (for step 4): after browser Back triggered by mouse history the
restored list link has focus but no ring, because Chromium hides `:focus-visible` after pointer
input, keyboard paths always show it; list↔park camera moves never animate because Leaflet skips
zoom animation when the zoom changes by more than 4 levels, park↔park pans animate unless reduced
motion is set; markers show both a native and a Leaflet tooltip on long hover; the Leaflet
container is a Tab stop before the markers; `example.com` images never load so every frame shows
the placeholder.

## 6. Gotchas learned in session 6

- The dev server from session 1 (PID 39439, port 4200, live reload of this tree) was still
  running and was used for the browser checks. `lsof -nP -iTCP:4200 -sTCP:LISTEN` shows it.
- Playwright MCP writes `.playwright-mcp/` into the repo root; deleted before committing again.
  Not in .gitignore (adding it is a change outside any slice; Tom's call at wrap-up).
- The `matchMedia` stub in a spec must answer per query: the map reads
  `(prefers-reduced-motion: reduce)` and a blanket `matches: true` would turn animation off in the
  map tests too. jsdom has no `matchMedia` at all, so the desktop case needs no stub and the
  `afterEach` deletes the property.
- `RouterTestingHarness.create()` renders the page at once, so any stub the page reads in its
  constructor must be installed before the harness exists. Creating the harness lazily in the
  `go()` helper was the smallest change that kept the seven existing cases untouched.
- Hiding `router-outlet` with `display: none` is what lets the app host be a two-row grid without
  the empty outlet element taking a row. Dynamically created routed components do not carry the
  parent's emulated-encapsulation attribute, so a scoped `router-outlet + *` selector would not
  have matched.
- The subagent prompt pattern from handoffs 3, 5, and 6 worked again: exact file list, exact
  cases with expected values, structural decisions made up front (where the button lives, how the
  app host gets its height, stub shape), shell prefix, do-not-touch list, no git except
  diff/status, "stop and report instead of guessing".

## 7. Transcripts for the submission

All in `~/.claude/projects/-Users-tom-park-finder/` (the slice 3 session also landed here, see
handoff-6 section 7). Eight files at the time of writing:
`1f20808e-3d74-4234-8d35-5b3a5cdb687b` (session 5), `4f7a552d-e59e-4779-a033-0af69682b5cf`,
`7729400e-ad3a-4c9e-83f5-18eb365b3269`, `89b775c1-f4be-4150-8226-c47dfdd97844` (session 1),
`caaeb63d-cae4-47c9-b9b8-dcebcbe17c01` (session 4), `d03bd911-c4b4-415a-83ea-5d39bb08fbe1`,
`d4c5853d-cd99-44cb-af1a-7edbc998e8b5`, `dcbecbd2-33e8-4628-929a-f5b1006ed01c` (session 6, this
one). Export every `.jsonl` in the folder unredacted at wrap-up step 5; the wrap-up session's own
file will be a ninth.

## 8. Time

Session 6 wall-clock about 15 minutes (02:36–02:50), logged in the PLAN.md time log. Running
total about 185 minutes wall-clock. Focused minutes are Tom's to fill before the README.
