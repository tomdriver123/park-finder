# Handoff 5: slice 2 done and pushed; next is slice 4 after slice 3 lands

Written 2026-10-08 02:30 EDT at the end of session 4 (slice 2, on main). The number is fixed by
handoff-3 section 7: the slice 3 session writes `handoffs/handoff-6.md`. The slice 4 session reads
both, this one first.

Read in this order before doing anything: this file, handoff-6.md, CLAUDE.md, PLAN.md,
docs/local-parks-candidate.pdf, public/assets/parks.sample.json. Everything decided is in PLAN.md
"Decisions" and "Plan review (session 3)"; do not re-derive or re-ask it.

## 1. What session 4 did

- Built slice 2 through one Opus subagent (model passed explicitly), per PLAN.md "Model routing".
  The subagent wrote the specs first, captured the compile-time failing run, implemented, then
  Prettier, build, and tests. 15 tool uses, about 4 minutes.
- Reviewed the diff and every new file myself, re-ran `npx ng test --watch=false` (6 files, 56
  tests), `npx prettier --check .`, and `npx ng build` (271.65 kB initial, no warnings).
- Did the keyboard walk in the browser with the Playwright MCP (section 4 has what was seen).
- Got Tom's "commit". Commit `8958bb7 feat(panel): add ParkPanel list and details with routes and focus`
  is on main and pushed to origin. The slice 3 session was told it can rebase.
- Filled the session 4 row of the PLAN.md time log (wall-clock only; focused minutes are Tom's).

## 2. Repo state at handoff

Run `git log --oneline` and `git status --short` first. main is at `8958bb7` plus, uncommitted in
this working tree, the PLAN.md time log row and this file. If Tom has not yet said "commit" for
that docs change, it is pending; see section 6.

Test state: 6 spec files, 56 tests, all green. Files: app.spec.ts (1), normalize.spec.ts (16),
parks-service.spec.ts (4), park-panel.spec.ts (27), park-image.spec.ts (3), parks-page.spec.ts (5).

What slice 2 added, all under src/app:

- `app.ts/.html/.css/.spec.ts`: root shell, `<header><h1>Park Finder</h1></header><router-outlet />`,
  OnPush, header styled with tokens. The scaffold placeholder and its test are gone.
- `app.routes.ts`: `''` → `/parks`; one `UrlMatcher` (`parksMatcher`, exported) matching `parks`
  and `parks/:id` → ParksPage, deeper paths return null; `**` → `/parks`.
- `app.config.ts`: `provideRouter(routes, withComponentInputBinding())`; `provideHttpClient()`
  and `provideBrowserGlobalErrorListeners()` kept.
- `parks-page.ts/.html/.css/.spec.ts`: `id = input<string>()`, injects ParksService (the only
  component that does), exposes `parks`, `loading`, `error`. Template is exactly
  `<main><app-park-panel … /></main>`. CSS: `:host { display: block }`, `main` max-width 48rem,
  centered, padded. No aside, no map, no `select` handler (slice 3 adds those).
- `panel/park-panel.ts/.html/.css/.spec.ts`: inputs `parks`, `loading`, `error` (required),
  `selectedId` (optional, undefined = list). `selected` computed. Focus via `afterRenderEffect`
  reading `selectedId`, `viewChild('listHeading')`, `viewChild('detailsHeading')`,
  `viewChildren('parkLink')`; two plain fields `lastFocusedId` and `lastOpenedId`. List links carry
  `data-park-id`. The "Parks" h2 has `id="parks-heading" tabindex="-1"`. Details and not-found h2
  share the `#detailsHeading` ref. CSS: list with dividers (`--color-border`), tertiary link color,
  `.back` tertiary button, `dl` as a two-column grid, `.caption` muted.
- `panel/park-image.ts/.html/.css/.spec.ts`: `src: string | null` and `alt` required,
  `state = linkedSignal(...)`, `.frame` with `aspect-ratio: 4 / 3`, `.skeleton` shimmer
  (`aria-hidden`), `img.hidden` while loading, `.placeholder` "No image available".
- `src/index.html` title "Park Finder".

## 3. Your job (slice 4 session)

Slice 4 starts only after slice 3 is on main (handoff-6 says when). Then follow PLAN.md "Session
protocol" and "Slice 4" with a Sonnet subagent. Slice 4 touches `parks-page.*` (layout, sheet
state, offset), `park-panel.css`, and `app.css`. Give the subagent the current contents of those
files; the panel CSS from slice 2 is meant to survive, slice 4 adds layout around it.

## 4. Browser walk, as seen (Chromium via Playwright MCP, dev server on 4200)

- Fresh load of `/` redirects to `/parks`. Landmarks: banner, main, nav labelled by "Parks"; one
  h1; headings h1 → h2 → h3. 12 links with `/parks/<id>` hrefs in file order.
- Tab focuses "Prospect Park" with `outline: solid 3px rgb(44, 76, 209)` and `:focus-visible`
  true. Enter opens `/parks/prospect-park`; `document.activeElement` is the h2 (tabindex -1), ring
  visible. Shift+Tab reaches "Back to parks" (ring visible). Enter returns to `/parks` with focus on
  the "Prospect Park" link, ring visible.
- At 375×667: deep link to `/parks/hillcrest-skate-park` focuses its h2. Shift+Tab, Enter: the
  Hillcrest link is focused, the page scrolled (scrollY 171) so the link sits at 594–650 of a
  667 viewport. So `focus()` does scroll the restored link into view, as PLAN.md Architecture says.
- Browser Back and Forward across list → Prospect → list → Riverside (in-app clicks): Back lands on
  the list with focus on the Riverside link; Back again shows Prospect with its h2 focused; Forward
  shows the list with focus on the Prospect link; Forward shows Riverside with its h2 focused.
- `/parks/nope` shows "Park not found" (h2 focused) with the "Back to parks" link.
- Every console error was `images.example.com` failing DNS; the placeholder showed each time.

## 5. Gotchas learned in session 4

- A leftover `ng serve (park-finder)` from an earlier session (PID 39439, started ~00:30) was
  already on port 4200, serving this working tree with live reload. I used it rather than start a
  second one. It may still be running; `lsof -nP -iTCP:4200 -sTCP:LISTEN` shows it. Slice 3 uses 4300.
- The Playwright MCP writes snapshots and console logs into `.playwright-mcp/` at the repo root,
  which is not in .gitignore. I deleted the folder before committing. Either keep deleting it or
  ask Tom whether to add it to .gitignore (a change outside any slice's file list).
- After browser Back triggered by a mouse history, the restored list link has focus but no ring:
  Chromium hides `:focus-visible` after pointer input. Keyboard paths always show the ring. Not a
  bug; worth a sentence in the README's "how it was checked".
- Two review nits left as is, neither blocking: in `park-panel.ts` the `untracked(this.loading)`
  guard on the return-to-list branch is effectively unreachable (the details heading only renders
  after loading ends); and the "acted once per id" guard (`id !== this.lastFocusedId`) is not
  exercised by any test on its own, because the effect only tracks `selectedId` and the view
  queries so nothing else re-runs it. The subagent checked both by temporarily removing them.
- The subagent prompt pattern from handoff-3 section 4 worked again: exact file list, exact test
  cases with expected values, shell prefix, do-not-touch list, no git except diff/status, failing
  run verbatim, and an explicit checklist of the plan-review items.
- jsdom attaches TestBed fixtures to `document.body`, so focus assertions on
  `document.activeElement` work without appending anything.
- Slice 4's spec additions go into `parks-page.spec.ts`, which uses `RouterTestingHarness` with
  `provideRouter(routes, withComponentInputBinding())`, `provideHttpClient()`,
  `provideHttpClientTesting()`, and flushes the sample through `HttpTestingController` after
  navigation (`httpTesting.verify()` in `afterEach`). The `matchMedia` stub for the mobile cases
  must be installed before the harness is created.

## 6. Pending at handoff

- A docs commit for the PLAN.md session 4 row and this file. Message suggestion:
  `docs: log session 4 and add handoff 5`. Needs Tom's "commit". Push with the credential command
  in PLAN.md step 6. If slice 3 has already rebased and merged, rebase this docs change on top; the
  time log rows are different lines, so no conflict is expected.

## 7. Transcripts for the submission

Session 4's transcript is `~/.claude/projects/-Users-tom-park-finder/caaeb63d-cae4-47c9-b9b8-dcebcbe17c01.jsonl`.
Session 1 is `89b775c1-f4be-4150-8226-c47dfdd97844.jsonl`. The slice 3 session's transcript lands
under a different folder because its worktree is at a different path (handoff-4 and handoff-6 name
it). Export all of them, unredacted, at wrap-up (PLAN.md "Wrap-up" step 5).

## 8. Time

Wall-clock so far: sessions 1 to 3 about 135 minutes, session 4 about 15 (02:15–02:30), about
150 minutes total. Focused minutes are Tom's to fill; the README reports both columns with the
sentence from PLAN.md "Wrap-up" step 4.
