# Handoff 3: slice 2 (ParkPanel, routes, focus), running in parallel with slice 3

Written 2026-10-08 02:15 EDT at the end of session 3. This handoff is for the slice 2 session only.
Slice 3 runs at the same time in another session from handoffs/handoff-4.md. Do not read handoff-4
for instructions; section 7 below says everything the slice 2 session needs to know about it. The
slice 2 session writes handoffs/handoff-5.md at its end (fixed number, see section 7).

Read in this order before doing anything: this file, CLAUDE.md, PLAN.md, docs/local-parks-candidate.pdf, public/assets/parks.sample.json. Everything decided is in PLAN.md "Decisions" and "Plan review (session 3)"; do not re-derive or re-ask it. This file only adds what PLAN.md does not say.

## 1. What session 3 did

- Built slice 1 (data and tokens) through one Sonnet subagent per PLAN.md "Model routing", reviewed the diff and re-ran tests, Prettier, and build in the overseeing session, got Tom's "commit".
- Made and pushed three commits in order: `8a7cf0d chore: add grill and handoff skills and first handoff` (session 1), `1d429f4 docs: add build plan with model routing and align CLAUDE.md` (session 2), `327b025 feat(data): add Park type, normalize, and ParksService with style tokens` (slice 1). Push used the credential command from PLAN.md step 6 and worked first time.
- Triaged a Codex review of PLAN.md that Tom pasted in. Decisions are in PLAN.md "Plan review (session 3)" and written into the slice sections: ParkImage state as a `linkedSignal` on `src`, `afterRenderEffect` for focus, error before "not found", `withComponentInputBinding()` in the page spec, tooltips as elements not strings, attribution top right, `focusin` on the map collapses the mobile sheet, scroll claim corrected, municipality is New York City in the README only.
- Split the PLAN.md time log into focused minutes and wall-clock, because Tom stepped away from the computer during sessions. Wall-clock is filled for sessions 1 to 3; the focused column is Tom's to fill.
- Decided with Tom to run slices 2 and 3 in parallel sessions; wrote this file and handoff-4 for that.

## 2. Repo state at handoff

Run `git log --oneline` and `git status --short` first. main should be at a docs commit on top of `327b025` that contains the plan review, the time log split, this file, and handoff-4 (message `docs: apply plan review, split time log, add handoffs 3 and 4`). If that commit is missing, stop and tell Tom; the slice 3 worktree is cut from it.

Test state at the end of session 3: `npx ng test --watch=false` passes 3 files, 22 tests (2 scaffold in app.spec.ts, 16 in normalize.spec.ts, 4 in parks-service.spec.ts). `npx prettier --check .` and `npx ng build` are clean.

What exists in src/app/data: `park.ts` (the Park interface), `normalize.ts` (`normalizePark`, `normalizeParks`), `parks-service.ts` (ParksService with read-only `parks`, `loading`, `error` signals, request started in the constructor), and their specs. `app.config.ts` has `provideHttpClient()` appended after `provideRouter(routes)`; `provideBrowserGlobalErrorListeners()` is still there. `src/styles.css` holds the tokens, focus ring, reduced-motion rule, and base block from PLAN.md "Styling". app.html, app.spec.ts, app.ts, app.routes.ts, index.html are still the scaffold.

## 3. Your job: slice 2

You are the [fable] overseer. Follow PLAN.md "Session protocol" and "Model routing"; the slice is PLAN.md "Slice 2: ParkPanel, routes, focus" plus the "Display" and "Architecture" decisions and the "Plan review (session 3)" items 3 to 6. In short:

1. Launch one subagent with `model: "opus"` passed explicitly. Give it CLAUDE.md, PLAN.md, the slice name, and the protocol steps (tests first, failing run captured, implement, passing run, Prettier, build). Tell it to stop and report instead of guessing; it cannot ask Tom. Tell it not to read or act on slices 3 and 4, and that slice 3 is being built elsewhere at the same time (section 7).
2. The slice's "Done when" includes a keyboard walk in the browser with the Playwright MCP. Do that walk yourself after the subagent returns, with `npx ng serve` on the default port 4200 (slice 3 uses 4300). Report what was actually seen.
3. When the subagent returns, run `git diff` and `npx ng test --watch=false` yourself and show Tom the real output. Never relay the subagent's summary as the review.
4. Wait for "commit". Commit message is in PLAN.md Slice 2. Push with the credential command. Tell Tom when it is pushed, because the slice 3 session is waiting for this commit to land on main before it can finish (section 7).
5. Fill the slice 2 row (session 4) of the PLAN.md time log, then write handoffs/handoff-5.md.

## 4. Gotchas for slice 2 that PLAN.md does not state

- The subagent prompt pattern from session 3 worked well: list the exact files allowed, the exact test cases with expected values, the shell prefix, a "do not touch" list, "no git except diff/status", and ask for the failing run verbatim. Put the plan-review items for slice 2 in the prompt as an explicit checklist: `ParkImage.src` is `string | null` with `state` as a `linkedSignal`, focus uses `afterRenderEffect` and acts once per id, the "Parks" heading has `tabindex="-1"`, the page spec needs `withComponentInputBinding()`, `park-image.spec.ts` is a new spec file, error with an id shows the error and not "Park not found".
- Slice 2 replaces app.html, app.css, and app.spec.ts (the scaffold "Hello, park-finder" test goes away). It also edits app.config.ts to add `withComponentInputBinding()` to `provideRouter`; keep `provideHttpClient()` and `provideBrowserGlobalErrorListeners()`.
- ParkPanel and ParksPage tests build parks with `normalizeParks(sample)` from the real sample file, imported the way normalize.spec.ts does (`import sample from '../../../public/assets/parks.sample.json'` from src/app/data; adjust the relative path from src/app/panel or src/app). No tsconfig change is needed.
- ParksPage is the only component that injects ParksService. Its spec needs `provideHttpClient()`, `provideHttpClientTesting()`, `provideRouter(routes, withComponentInputBinding())`, and `RouterTestingHarness`; flush the sample through `HttpTestingController` after navigation.
- jsdom has no `matchMedia` or `ResizeObserver`. Slice 2 should not need either; if the subagent reaches for them, that is slice 3 or 4 scope and a sign to stop.
- The `UrlMatcher` route in PLAN.md "Architecture" is a deliberate decision with the reason written there; do not let the subagent replace it with two routes.
- In the browser walk, also open a park near the bottom of the list and go back: the link for that park must be focused and visible (PLAN.md Architecture rationale, scroll note). Also check browser Back and Forward between two parks.
- Prettier ignores CLAUDE.md, the sample JSON, and docs/ on purpose. CLAUDE.md is hand-edited only.

## 5. Transcripts for the submission

Every session adds a .jsonl under ~/.claude/projects/-Users-tom-park-finder/. Session 1 is 89b775c1-f4be-4150-8226-c47dfdd97844.jsonl. The slice 3 session runs in a worktree at a different path, so its transcript lands under a different folder (handoff-4 section 5 names it). Export all of them, unredacted, at wrap-up (PLAN.md "Wrap-up" step 5).

## 6. Time

Wall-clock so far: session 1 ~45, session 2 ~60, session 3 ~30, about 135 minutes. Focused minutes are lower because Tom was away from the computer at times; he supplies those numbers and the README reports them with a sentence explaining the difference (PLAN.md Wrap-up step 4). The brief's two-hour cap is Tom's call to interpret.

## 7. Parallel work: what slice 2 must know about slice 3

- Slice 3 is built in a separate git worktree at `../park-finder-slice-3` on branch `slice-3`, cut from the docs commit in section 2. Its session only creates `src/app/map/park-map.ts`, `.html`, `.css`, `.spec.ts` until slice 2 is on main. It does not touch parks-page, app.*, routes, or config while slice 2 is in progress.
- Slice 2 owns `src/app/parks-page.*` and everything in `src/app/panel/` and `src/app/app.*`. Build parks-page exactly as PLAN.md Slice 2 says (`<main>` with the panel, plain single column). Do not add the `<aside>`, the map import, or a `select` handler; slice 3 adds those after rebasing onto your commit.
- Slice 2 commits to main first. After your commit is pushed, the slice 3 session rebases `slice-3` onto main, wires the map into parks-page, and fast-forwards main. So: tell Tom the moment your commit is pushed.
- Ports: slice 2 serves on 4200, slice 3 on 4300. Each session has its own Playwright MCP browser.
- Time log: you fill only the session 4 row. Slice 3 fills session 5 after its rebase, so there is no conflict.
- Handoff numbers are fixed to avoid a race: this session writes `handoffs/handoff-5.md`; the slice 3 session writes `handoffs/handoff-6.md`. The slice 4 session reads both.
