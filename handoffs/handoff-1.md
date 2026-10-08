# Handoff 1: setup session

Written 2026-10-08 00:30 EDT at the end of session 1. The next handoff is handoffs/handoff-2.md.

Read in this order before doing anything: this file, CLAUDE.md (the contract; it wins over this file), docs/local-parks-candidate.pdf (the brief, 3 pages), public/assets/parks.sample.json (the data, 12 parks). PLAN.md does not exist yet. CLAUDE.md expects it, and producing it is the next piece of work.

## 1. The project in four lines

- Granicus "Find a Park" take-home. Hard cap of 2 hours total including tests and README; stop at 2 h and list what is unfinished. Core loop only: a list of parks, a details view, a map with markers. Selecting from the list, the map, or the URL opens the same details.
- Submission is a zip: source, README (run steps, what works, what was left out, decisions, known issues, how it was checked, time spent, next steps before public use), and the full unredacted AI logs from every tool used.
- Stack is fixed by CLAUDE.md: Angular 22 standalone, zoneless, signals, inject(), built-in control flow, OnPush, plain CSS with custom properties, Leaflet, Vitest with TestBed, Prettier, conventional commits with the Co-Authored-By trailer.
- Working agreement: work on main, one commit per slice, show the diff and test output and wait for Tom to say "commit", ask before building anything unclear, no features Tom did not ask for, no new dependencies without asking.

## 2. Repo state at handoff

- Remote: https://github.com/tomdriver123/park-finder (private). Branch main tracks origin/main.
- Only commit: ad8dcb5, 2026-10-07 23:55 EDT, "chore: scaffold Angular 22 app with Leaflet and Vitest", 32 files, pushed.
- Uncommitted, awaiting Tom's "commit":
  - .claude/skills/grill/SKILL.md, rewritten to Tom's dictated text (numbered rounds).
  - .claude/skills/handoff/SKILL.md, new.
  - angular.json: a `cli.analytics` line with a pseudonymous UUID appeared at 00:24 on 2026-10-08. The agent did not make it; the Angular CLI writes it when its usage-analytics prompt is accepted, probably from an ng command in Tom's terminal. Tom decides: commit it, or revert with `git checkout angular.json` and set `"analytics": false` so the prompt does not return.
  - handoffs/handoff-1.md, this file.
- Verified at commit time: `npx ng build` passes (styles bundle 11 kB includes the Leaflet CSS; assets/parks.sample.json is copied into dist), `npx ng test --watch=false` passes 2 of 2 scaffold tests, `npx prettier --check .` is clean. The skill files were Prettier-checked after their edits.
- No app code exists. src/app holds only the scaffold: app.ts (App, a title signal), app.html (the 20 kB Angular placeholder), app.css (empty), app.spec.ts (2 tests, one expects an h1 containing "Hello, park-finder"), app.config.ts (provideBrowserGlobalErrorListeners, provideRouter), app.routes.ts (empty routes array), plus empty data/, map/, panel/ folders holding .gitkeep. src/styles.css is a single comment. The placeholder template and its test get replaced in the first UI slice.

## 3. Verified facts, do not re-derive

| Item       | Fact                                                                                                                                                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular    | core 22.2.1, cli 22.2.2, build 22.2.2; standalone; zoneless (no zone.js dependency, no zone provider); routing on; CSS; no SSR; strict; 2025 file naming (app.ts, not app.component.ts)                                                                        |
| Tests      | angular.json test target is @angular/build:unit-test with the default runner, Vitest 5.0.3 on jsdom 30.1.2; tsconfig.spec.json has types vitest/globals; run `npx ng test --watch=false`                                                                       |
| Leaflet    | leaflet 1.9.4 in dependencies, @types/leaflet 1.9.22 in devDependencies; CSS is loaded through the angular.json `styles` array ahead of src/styles.css, not an @import, so styles.css stays tokens, focus ring, and reduced motion only                        |
| Prettier   | 3.9.9, came with the scaffold; .prettierrc sets printWidth 100, singleQuote, and the angular parser for html; .prettierignore excludes CLAUDE.md, public/assets/parks.sample.json, and docs/ so both source documents stay byte-identical to what was supplied |
| TypeScript | 6.0.3; strict flags on (noImplicitOverride, noPropertyAccessFromIndexSignature, noImplicitReturns, noFallthroughCasesInSwitch)                                                                                                                                 |
| Budgets    | production build: initial 500 kB warn / 1 MB error; anyComponentStyle 4 kB warn / 8 kB error                                                                                                                                                                   |
| Data URL   | public/ is served at the root, so the file is fetched at /assets/parks.sample.json, matching CLAUDE.md                                                                                                                                                         |
| Node       | .nvmrc pins 24.21.0; the Angular 22.2 CLI refuses anything below 24.15.0                                                                                                                                                                                       |

## 4. Environment gotchas

- The tool shell's first `node` is Homebrew 24.14.1 and nvm is not auto-sourced there; nvm's default alias is 18. Prefix every shell command with `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 24.21.0 >/dev/null;`. In Tom's own terminal, `nvm use` inside the repo reads .nvmrc.
- A global `ng` v18.2 is on PATH. Never run bare `ng`; use `npx ng ...` or `npm run ...`.
- Git identity exists only in this repo's config (Tom Driver, thomas.andrew.driver@gmail.com); nothing global. Tom may want a different name.
- No GitHub credential helper is configured globally, only osxkeychain. Push with `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push`. gh is logged in as tomdriver123.
- This session's transcript, required in the submission, is ~/.claude/projects/-Users-tom-park-finder/89b775c1-f4be-4150-8226-c47dfdd97844.jsonl (started 23:45 on 2026-10-07). Each later session adds another .jsonl to that folder. Export all of them, unredacted, before zipping.
- Skills added mid-session may be missing from the loaded skill list until a restart; both skill files can be read and followed directly.

## 5. Decisions made so far

| Decision                                                                                                                                                                              | By    | Status                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------- |
| Angular 22 + Leaflet + Vitest, zoneless, routing, CSS, no SSR                                                                                                                         | Tom   | fixed                        |
| Leaflet CSS via the angular.json styles array                                                                                                                                         | agent | Tom informed, no objection   |
| Keep the scaffold's .prettierrc although CLAUDE.md says "Prettier defaults"                                                                                                           | agent | flagged, Tom has not decided |
| .prettierignore for CLAUDE.md, the sample JSON, and docs/                                                                                                                             | agent | Tom informed                 |
| .nvmrc = 24.21.0, Node installed through nvm, default alias untouched                                                                                                                 | agent | Tom informed                 |
| Repo-local git author "Tom Driver"                                                                                                                                                    | agent | Tom informed, may rename     |
| First commit includes .claude/skills, the generated README, and .vscode/                                                                                                              | agent | Tom informed                 |
| grill skill: every settled question in one numbered round, a recommended answer each, "yes" accepts it, facts looked up by the agent, decisions by Tom, nothing built until confirmed | Tom   | done, uncommitted            |
| handoff files: handoffs/handoff-N.md, never overwrite an earlier one                                                                                                                  | Tom   | done, uncommitted            |

## 6. Data holes, analysed, decisions pending

Delivered to Tom on 2026-10-07. "Sample" means present in the file; "brief" means allowed by the brief's missing-or-null clause but absent from the sample. Rows marked DECIDE are the first grill round. The rest apply as proposed unless Tom objects.

| #   | Hole                                                                       | Where                                                    | CLAUDE.md                                 | Verdict                                                                                                                                    |
| --- | -------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | description null                                                           | sample: old-mill-botanical-garden                        | "No description available."               | covered                                                                                                                                    |
| 2   | location.address absent                                                    | sample: highland-dog-park                                | show coordinates                          | covered; format unstated, propose "40.6789, -73.9442"                                                                                      |
| 3   | images []                                                                  | sample: cedar-hill-nature-preserve, east-ridge-trailhead | placeholder                               | covered                                                                                                                                    |
| 4   | rating null                                                                | sample: cedar-hill-nature-preserve                       | hide the rating row                       | covered; use a null check so a rating of 0 still shows                                                                                     |
| 5   | every image URL is on images.example.com and never loads                   | sample: all 10 parks with images                         | only empty arrays covered                 | DECIDE; propose real src, swap to the placeholder on the img error event                                                                   |
| 6   | street-only addresses, no city or zip ("Shore Pkwy", "44th St & 7th Ave")  | sample: 8 of 11 addresses                                | never invent values                       | covered; show verbatim, never append a city                                                                                                |
| 7   | hours is free text: "6:00 AM - 1:00 AM", "Dawn to dusk", "24 hours"        | sample: all                                              | no hours rule                             | DECIDE; propose verbatim, never parse, hide the row when missing                                                                           |
| 8   | name missing, null, or ""                                                  | brief                                                    | no rule; inventing forbidden              | DECIDE; propose falling back to the id text; affects list label, heading, marker alt                                                       |
| 9   | id missing, null, or duplicate                                             | brief                                                    | no rule                                   | DECIDE; id drives the route, @for track, and focus return; propose normalize drops the row and the service counts drops                    |
| 10  | location missing, or lat/lng null, non-numeric, out of range               | brief                                                    | no rule; rule 2 assumes coordinates exist | DECIDE; propose keeping the park in list and details with "Location not available", no marker, bounds from the rest; Leaflet throws on NaN |
| 11  | amenities missing, null, [], or null/"" entries                            | brief                                                    | no rule                                   | DECIDE; propose hiding the section when empty; also decide raw slugs vs humanized ("dog-run" vs "Dog run")                                 |
| 12  | images null, or with null/"" entries                                       | brief                                                    | "missing, null, or empty arrays" + rule 3 | covered if normalize coalesces to [] and filters bad entries                                                                               |
| 13  | acreage missing or null                                                    | brief                                                    | no rule; the brief does not list acreage  | propose hiding the row, unit "acres" when shown                                                                                            |
| 14  | wrong types (rating "4.7" as a string, amenities as a string)              | brief                                                    | never invent values                       | propose treating the field as missing, never coercing                                                                                      |
| 15  | empty or whitespace strings for description, address, hours                | brief                                                    | empty strings not listed                  | propose trim, treat "" as missing                                                                                                          |
| 16  | fetch fails, malformed JSON, top level not an array                        | brief                                                    | loading and error signals                 | covered; an empty array has no rule, propose "No parks to show"                                                                            |
| 17  | unknown id in the URL                                                      | CLAUDE.md URL path                                       | no rule                                   | propose "Park not found" with a link back to the list                                                                                      |
| 18  | no alt text or captions for any image                                      | sample: all                                              | alt and title for markers only            | DECIDE; propose alt "Photo 1 of 2, Prospect Park", or decorative alt ""                                                                    |
| 19  | rating scale not stated; sample max is 4.9                                 | sample                                                   | nothing on display format                 | propose the bare number, no "/ 5"                                                                                                          |
| 20  | cedar-hill-nature-preserve sits at 40.7128, -74.006, the generic NYC point | sample                                                   | not actionable                            | README data-quality note only                                                                                                              |

## 7. Open questions for Tom

1. Data holes 5, 7, 8, 9, 10, 11, and 18.
2. Keep or drop .prettierrc.
3. Git author name.
4. The angular.json analytics line: commit or revert.
5. Commit the two skill files and this handoff, and with what message. Proposed: `chore: add grill and handoff skills and first handoff`.
6. Municipality framing for the title and README. The brief says to choose a real or fictional one; the data mixes a real place (Prospect Park) with fictional ones at New York City coordinates.
7. Time accounting. Session 1 ran from 23:45 on 2026-10-07 to about 00:30 on 2026-10-08: planning and setup, no app code. Tom's own prep before that (CLAUDE.md was written about 22:53) is not counted here. Tom decides what counts toward the 2 h.

## 8. Next steps, in order

1. Tom reviews the uncommitted files. On "commit": run Prettier, commit, push.
2. Run /grill on the build plan, starting with the DECIDE rows and the open questions above. Write PLAN.md from the answers. CLAUDE.md requires it, and optional brief items are in scope only if PLAN.md lists them.
3. Proposed slices, pending grill:
   - Slice 1, data: src/app/data with a Park type, normalize.ts (pure, the only place raw JSON is shaped), parks.service.ts (HttpClient; signals parks, loading, error; sole caller of normalize). Tests use the real sample plus hand-written edge rows, with expected values taken from CLAUDE.md's rules.
   - Slice 2, panel: list and details in src/app/panel, routes / and /parks/:id in app.routes.ts, keyboard path with a visible focus ring, focus into details on open and back to the list item on close, landmarks nav/main/aside, one h1.
   - Slice 3, map: Leaflet in src/app/map, markers with alt and title, every Leaflet callback writes a signal (zoneless), fitBounds from the data, marker click opens the same details route.
   - Then the README (the brief's required sections), export the AI logs, zip. Stop at 2 h and record what is unfinished.
4. After each slice: show the diff and the test output, then wait for "commit".

## 9. Commands

```sh
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 24.21.0 >/dev/null
npx ng serve                 # dev server at http://localhost:4200
npx ng build                 # production build to dist/park-finder/browser
npx ng test --watch=false    # Vitest, single run
npx prettier --write .       # before every commit
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push
```
