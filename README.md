# Park Finder

A small "Find a Park" app for the Granicus take-home (brief: `docs/local-parks-candidate.pdf`). It
shows a list of parks, a details view, and a map with markers. Picking a park from the list, from
a map pin, or from the URL opens the same details.

Municipality: New York City, taken from the coordinates and addresses in
`public/assets/parks.sample.json`. The UI does not name a city. The park names in the sample are
invented (plus Prospect Park), so real borough labels on the map tiles sit under fictional parks.
Cedar Hill Nature Preserve sits on the generic NYC point. I did not change the sample file.

Stack: Angular 22.2 (standalone components, zoneless, signals), Leaflet 1.9.4 with OpenStreetMap
tiles, Vitest 5 on jsdom through `ng test`, Prettier, plain CSS with custom properties.

## Run it

Node 24.21.0 is pinned in `.nvmrc`. The Angular 22 CLI refuses Node below 24.15.

```bash
nvm use
npm install
npm start
```

Then open http://localhost:4200. No API keys are needed.

```bash
npm test                    # Vitest through ng test (watch mode)
npx ng test --watch=false   # single run
npm run build               # output in dist/park-finder/browser
```

The map uses OpenStreetMap tiles under the OpenStreetMap tile usage policy. A public deployment
should use its own tile provider or get a usage agreement.

## Using the app

- The list of parks is the left column on desktop and a bottom sheet on a phone. On a phone the
  `^` button in the sheet bar switches between a 40dvh peek and a 70dvh expanded sheet.
- Open a park by clicking it, with the keyboard (Tab, Enter), or by URL: `/parks/<id>`.
- Pins on the map open the same details (click, Enter, or Space). Hover and focus show the park
  name.
- The `<` Back icon returns to the list, and focus returns to that park's link.
- The crosshair Recenter button refits the map to all parks.
- The panel title sits centered in the brown bar.
- Details show location (address, else coordinates, else "Location not available"), hours, size,
  rating (hidden when null), description ("No description available." when missing), amenities
  with emoji (`src/app/panel/amenity-emoji.ts`), and the photos (a placeholder when there are none
  or loading fails).

## What works

In my own words, from using it on a phone and a desktop: the map zooming, the mobile view, the
navigation is seamless, and the responsive design in general.

Also:

- The core loop from the list, the map, and the URL.
- Missing data handled by the rules in `CLAUDE.md`, never invented.
- A keyboard path to every park with a visible focus ring. Focus moves to the details heading on
  open and back to the list item on close.
- Landmarks `nav`, `main`, and `aside`, and one `h1`.

## What was left out

- Search.
- Filters. I wanted to filter by rating and by amenities, and to show the amenities on the map.
- Current location.
- Retry on load failure.
- Backend, accounts, and hosting.
- The brief's two-hour cap. I went over it (see Time spent).

## Important decisions

The full record is in `docs/plans/PLAN.md` (decisions, architecture, slices) and
`docs/plans/plan-feedback.md` (the last round of fixes). In short:

- Normalize once, never invent values. `src/app/data/normalize.ts` is a pure function called only
  by `ParksService` (`src/app/data/parks-service.ts`, `HttpClient`, signals `parks`, `loading`,
  `error`). Fallback strings live in the templates, not in the data.
- One `UrlMatcher` route for `parks` and `parks/:id`. With two routes Angular would recreate the
  page, and the map, on every open and close. With one, only the `id` input changes.
- The app is zoneless, so every Leaflet callback writes a signal.
- `ParkPanel` and `ParkMap` take inputs from the page and never inject the service. One
  integration spec covers the page.
- Palette: the seven dark hexes I picked read as black when used as text. They are used as fills
  (green header, brown bar) with white text. Tertiary blue stays the one accent for links, the
  selected pin stroke, and the focus ring. In the brown bar the focus ring is white for contrast.
- Pin colors are assigned by list position (`src/app/map/pin-colors.ts`), so the list and the map
  match.
- On a phone, selecting a park keeps the sheet at peek. Only the toggle expands it. Selection used
  to expand it, which hid the map zoom.
- `fitBounds` runs with `animate: false`. Leaflet silently drops camera calls that arrive during a
  running zoom animation. The `ResizeObserver` fed one call per frame of the sheet transition and
  the last one was dropped, leaving the map zoomed out. A pending-request replay on `zoomend`
  covers requests that land mid-animation.
- The map attribution is at the top right so the sheet never covers it.
- Markers show both the native `title` and the Leaflet tooltip.
- The bar controls are white outlined icons with `aria-label` and `title`.
- Angular 22 rewrites custom properties in component styles with a namespace placeholder that
  resolves to an empty string unless opted in, so the tokens work as written.

## Known issues

- `images.example.com` never resolves, so every photo frame shows the placeholder and the console
  logs one failed request per image.
- After browser Back triggered by the mouse, the restored list link has focus but no ring.
  Chromium hides `:focus-visible` after pointer input. Keyboard paths always show the ring.
- The Leaflet container is a Tab stop before the pins.
- The playground emoji needs Emoji 14 and shows a box on older systems.
- No retry on load failure.
- A wheel zoom and a Recenter click within about 30ms of each other leave the map zoomed in:
  Leaflet debounces wheel zoom for about 40ms and applies it after the refit. Found by a scripted
  check; a person cannot do both that fast. Gaps of 30ms or more recenter correctly.

## How it was checked

- Unit tests: 9 spec files, 94 tests, all green. Expected values come from the rules in
  `CLAUDE.md` and `docs/plans/PLAN.md`, not from the code under test. Fixtures are the real
  sample file plus hand-written edge rows.
- Prettier and a clean production build (initial bundle about 439 kB) before every commit.
- Playwright MCP browser checks at 375x667 and 1280x800 after slices 2, 3, and 4: keyboard walk,
  focus rings, no text under 16px, reduced motion, attribution visible, sheet behavior.
- For the session 7 slices the Playwright MCP profile was locked, so the checks ran through
  headless Chrome driven by the cached `playwright-core` package: keyboard walk, bar controls at
  44px, centered title, deep link focus.
- A final browser pass in the wrap-up session (headless Chrome through `playwright-core`, 1280x800,
  375x667, and 320x667): header and bar colors, bar controls at 44px, the desktop keyboard walk
  with the white ring on the heading, details content for Prospect Park, Highland Dog Park, Old
  Mill, Cedar Hill, and an unknown id, all 12 list and map pin colors equal, zoom 15 on
  selection, pin positions identical after Back and after Recenter (0.00px), Space on a pin, the
  sheet staying at peek on selection and reaching 70dvh with the chevron rotated, reduced motion
  with no pan, the summary stacking at 320px, no text under 16px, no console errors beyond the
  image hosts. One synthetic case failed and is listed under Known issues.
- My own code review of every diff (Pass A: ten items listed in `docs/handoffs/handoff-7.md`
  section 5; eight were fixed in Slice 5, item 6 is the two-tooltips note above, item 7 was left
  as written).
- Codex reviews of the plan files: session 3 on the PLAN.md slices 2 to 4, and `plan-feedback.md`
  before session 7. The accepted points are written into PLAN.md under "Plan review (session 3)".
  The Codex code review planned as Pass B was not run.
- The project grill skill (`.claude/skills/grill/SKILL.md`) interviewed me on every open decision
  before any code was written, so the plan files are thorough and the code was built to them.

## How AI was used

Claude Code throughout. Fable (the overseeing model) reads every diff and test run itself, never
writes slice code, and commits only when I say so. Each slice was built by one Opus or Sonnet
subagent with the model passed explicitly (routing table in PLAN.md, "Model routing"). Handoff
files carry state between sessions. Codex (OpenAI) reviewed the plan files.

Logs: `docs/transcripts/` holds every Claude Code session as `transcript-N.md`, with the raw
files under `docs/transcripts/raw/`, and the Codex session as `codex-1.md`. See
`docs/transcripts/README.md`. The transcripts are numbered by start time, so they do not match
the session numbers in the table below: transcripts 4 and 5 are two one-minute aborted starts,
transcript 6 is session 4, and so on through transcript 11 for session 9. The wrap-up session's
own transcript is re-exported after it ends (`python3 docs/transcripts/export-transcripts.py`).

Paths:

- `CLAUDE.md`
- `docs/plans/PLAN.md`
- `docs/plans/plan-feedback.md`
- `docs/handoffs/` (`handoff-1.md` to `handoff-8.md`)
- `docs/transcripts/`
- `.claude/skills/grill/SKILL.md`
- `.claude/skills/handoff/SKILL.md`
- `docs/local-parks-candidate.pdf`

## Time spent

I went over the brief's two-hour cap. The extra time went to planning documents, review passes,
and the session 7 polish after I used the app on my phone.

Wall-clock from session timestamps (2026-10-07 and 10-08, EDT):

| Session | Work                                | Wall-clock                  |
| ------- | ----------------------------------- | --------------------------- |
| 1       | Setup, scaffold, grill              | ~45 min (23:45-00:28)       |
| 2       | PLAN.md                             | ~60 min (00:31-01:46)       |
| 3       | Slice 1, Codex plan review          | ~20 min (01:49-02:10)       |
| 4       | Slice 2 (parallel with session 5)   | ~20 min (02:12-02:32)       |
| 5       | Slice 3 (parallel with session 4)   | ~25 min (02:12-02:37)       |
| 6       | Slice 4                             | ~11 min (02:38-02:49)       |
| 7       | Session 7 plan (`plan-feedback.md`) | ~15 min (03:18-03:33)       |
| 8       | Slices 5 to 8                       | ~40 min (03:34-04:13)       |
| 9       | Wrap-up: docs, transcripts, README  | ~60 min (03:45-about 04:45) |

Summed session time is about 4.5 hours; the elapsed window is 23:45 to about 04:45. I stepped away
from the computer during some sessions (session 2 in particular), so wall-clock overstates focused
work.

Focused time: TODO Tom

## Next steps before public use

- Static hosting with a real data endpoint and cache headers.
- Real image URLs behind a CDN, with sizes and alt text.
- A tile provider agreement or self-hosted tiles.
- Retry and offline messaging.
- Error monitoring.
- An end-to-end suite in CI.
- An axe audit and a screen-reader pass.
- Search and filters once the dataset warrants them.
