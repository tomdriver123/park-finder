# Handoff 4: slice 3 (Leaflet map), running in parallel with slice 2

Written 2026-10-08 02:15 EDT at the end of session 3. This handoff is for the slice 3 session only,
which runs in the git worktree `../park-finder-slice-3` on branch `slice-3`. Slice 2 runs at the
same time in the main working tree from handoffs/handoff-3.md. Do not read handoff-3 for
instructions; section 6 below says everything the slice 3 session needs to know about it. The
slice 3 session writes handoffs/handoff-6.md at its end (fixed number, see section 6).

Read in this order before doing anything: this file, CLAUDE.md, PLAN.md, docs/local-parks-candidate.pdf, public/assets/parks.sample.json. Everything decided is in PLAN.md "Decisions" and "Plan review (session 3)"; do not re-derive or re-ask it. This file only adds what PLAN.md does not say.

## 1. Where you are

Confirm with `git rev-parse --show-toplevel` and `git branch --show-current` that you are in `park-finder-slice-3` on `slice-3`. If you are in `park-finder` on `main`, stop: that is the slice 2 session's tree, and you must not build there. Tom creates the worktree with:

```
cd /Users/tom/park-finder
git worktree add -b slice-3 ../park-finder-slice-3 main
cd ../park-finder-slice-3
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 24.21.0 >/dev/null; npm ci
```

Every shell command still starts with the nvm prefix from PLAN.md step 2. `npx ng`, never bare `ng`.

## 2. Repo state at handoff

main is at a docs commit on top of `327b025` (slice 1) that contains the plan review, the time log split, handoff-3, and this file. `slice-3` starts from that commit. Session 3 built slice 1: `src/app/data/` has the Park type, normalize, ParksService, and their specs; `app.config.ts` has `provideHttpClient()`; `src/styles.css` has the tokens, focus ring, reduced-motion rule, and base block. Tests: 3 files, 22 passing. Everything else is still the scaffold, and slice 2 is replacing the scaffold shell, routes, and panel in the other tree at the same time as you work.

## 3. Your job: slice 3, in two phases

You are the [fable] overseer. Follow PLAN.md "Session protocol" and "Model routing"; the slice is PLAN.md "Slice 3: Leaflet map" plus the "Styling" and "Architecture" decisions and "Plan review (session 3)" items 2 and 7. One Opus subagent for the whole slice, no model switch, but the work splits into two phases because the page the map lives in does not exist until slice 2 lands.

Phase A, on `slice-3`, before slice 2 is on main:

1. Launch one subagent with `model: "opus"` passed explicitly. Give it CLAUDE.md, PLAN.md, the slice name, and the protocol steps (tests first, failing run captured, implement, passing run, Prettier, build). Restrict it to `src/app/map/park-map.ts`, `park-map.html`, `park-map.css`, `park-map.spec.ts`. It must not touch parks-page, app.*, routes, config, styles.css, or anything in data/ or panel/. Tell it to stop and report instead of guessing; it cannot ask Tom. Tell it not to read or act on slices 2 and 4.
2. Put the plan-review items in the prompt as an explicit checklist: `bindTooltip` gets a `<span>` with `textContent = name`, never a string; a spec with a park named `<b>Bold</b> Park` asserts the tooltip's `textContent` is the literal string and it contains no `<b>`; `map.attributionControl.setPosition('topright')` after the map is created.
3. ParkMap is testable on its own: the spec sets `parks` and `selectedId` with `fixture.componentRef.setInput` using `normalizeParks(sample)` (import the sample the way normalize.spec.ts does, path adjusted from src/app/map) plus hand-written edge rows. It never injects ParksService.
4. When the subagent returns, run `git diff` and `npx ng test --watch=false` yourself and show Tom the real output. `npx ng build` must pass even though nothing renders the map yet. Tom reviews. Do not commit yet unless Tom says so; the commit for the slice is one commit after phase B.

Phase B, after Tom says slice 2 is pushed to main:

5. `git fetch origin && git rebase origin/main`. Conflicts are unlikely because phase A touched only `src/app/map/`. If the rebase conflicts anyway, stop and show Tom.
6. Continue the same subagent (SendMessage with its id) or, if it is gone, launch one new Opus subagent for the wiring: in `src/app/parks-page.ts` and `.html`, add `<aside aria-label="Map"><app-park-map [parks]="parks()" [selectedId]="id()" (select)="onSelect($event)" /></aside>` after `<main>`, with `onSelect(id)` calling `router.navigate(['/parks', id])`, and the slice 3 interim layout (panel then map, map `height: 60vh`). Add `parks-page.spec.ts` cases: the aside renders 12 `.park-pin` after flush; emitting `select` from the map navigates to that park and the details heading shows. Keep slice 2's existing page spec cases passing untouched.
7. Browser check with the Playwright MCP, serving with `npx ng serve --port 4300` (slice 2 uses 4200): markers render, hover and focus show tooltips, Tab reaches the markers after the panel, Enter on a marker opens the details, list selection zooms to 15, back fits bounds, reduced-motion emulation (`browser_emulate_media`) shows no pan animation, attribution visible at the top right. Report what was actually seen.
8. Run `git diff` and `npx ng test --watch=false` yourself and show Tom. Wait for "commit". One commit with the message from PLAN.md Slice 3. Then `git checkout main && git merge --ff-only slice-3` in the main working tree (or push `slice-3` and fast-forward main from there), push with the credential command, and tell Tom. If main moved again in between, rebase once more first.
9. Fill the session 5 row of the PLAN.md time log, then write handoffs/handoff-6.md. Tom removes the worktree afterwards with `git worktree remove ../park-finder-slice-3` and `git branch -d slice-3`.

## 4. Gotchas for slice 3 that PLAN.md does not state

- The app is zoneless. Every Leaflet callback (`click`, `keypress`, tooltip events) must write to a signal or emit an output; nothing else triggers a view update. The subagent must know this up front.
- jsdom has no `matchMedia` or `ResizeObserver`; PLAN.md already says to guard both with `typeof` checks. Leaflet runs in jsdom with a zero-size container; `fitBounds` and `setView` do not throw there, but the camera behavior is checked only in the browser.
- Leaflet's CSS is already in angular.json `styles` from the scaffold (that is why the styles bundle is 11 kB). Do not add it again.
- `import { map, tileLayer, marker, divIcon, latLngBounds } from 'leaflet'` works with the scaffold's `@types/leaflet`. `marker.getElement()` is undefined until `addTo`; set `aria-label` after.
- Marker keyboard: Leaflet gives the marker element `tabindex="0"` and `role="button"` when `keyboard: true`, and fires `click` on Enter via its `keypress` handler (keyCode 13). The spec dispatches a `keypress` with `keyCode: 13` to check `select` emits.
- `ViewEncapsulation.None` on ParkMap only, every rule in `park-map.css` prefixed `.park-map`, `host: { class: 'park-map' }`. The pin SVG uses `fill="currentColor"`, colors set in CSS via `color`.
- The subagent prompt pattern from session 3 worked well: exact files allowed, exact test cases with expected values, the shell prefix, a "do not touch" list, "no git except diff/status", and the failing run verbatim.
- Prettier ignores CLAUDE.md, the sample JSON, and docs/ on purpose. CLAUDE.md is hand-edited only.

## 5. Transcripts for the submission

This session runs in `/Users/tom/park-finder-slice-3`, so Claude stores its transcript under `~/.claude/projects/-Users-tom-park-finder-slice-3/`, not the usual `~/.claude/projects/-Users-tom-park-finder/`. Write the .jsonl name into handoff-6 so wrap-up exports it with the others (PLAN.md "Wrap-up" step 5). The worktree also has its own project memory folder; nothing important should be saved there.

## 6. Parallel work: what slice 3 must know about slice 2

- Slice 2 owns `src/app/parks-page.*`, `src/app/panel/*`, `src/app/app.*`, `app.routes.ts`, `app.config.ts`, and `index.html`, and commits to main first. Until that commit exists on `origin/main`, slice 3 touches only `src/app/map/`.
- Slice 2 builds parks-page with `<main>` and the panel only, no `<aside>`, no map import, no `select` handler. Phase B adds those; that is the whole integration.
- Ports: slice 2 serves on 4200, slice 3 on 4300. Each session has its own Playwright MCP browser.
- Time log: slice 2 fills the session 4 row; you fill session 5 after the rebase, so there is no conflict.
- Handoff numbers are fixed to avoid a race: the slice 2 session writes `handoffs/handoff-5.md`; this session writes `handoffs/handoff-6.md`. The slice 4 session reads both.
- The CLAUDE.md rule "Work on main" is deliberately bent for this slice: `slice-3` is a short-lived branch that fast-forwards into main, so the history still reads as one commit per slice on main. Tom agreed to the parallel run in session 3.
