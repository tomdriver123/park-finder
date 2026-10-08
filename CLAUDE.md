# Park Finder

Take home for Granicus. Two hour cap. Small, polished, accessible.

## Source documents
The brief is docs/local-parks-candidate.pdf. The data is public/assets/parks.sample.json. Read both at the start of every session, along with PLAN.md. This file is the distilled contract. Where this file and the brief seem to disagree, ask Tom instead of choosing. Optional items in the brief stay out of scope unless PLAN.md lists them.

## Scope
Core loop only. A list of parks, a details view, a map with markers. Selecting a park from the list, the map, or the URL opens the same details. No backend, no accounts, no geolocation. Search and filters only if the core loop is done and verified.

## Data
public/assets/parks.sample.json is the source, fetched at /assets/parks.sample.json. Fields can be missing, null, or empty arrays. Normalize once, in the pure function in src/app/data/normalize.ts, called only by ParksService. Never invent values. Missing description shows "No description available." Missing address shows coordinates. Empty images shows a placeholder. Null rating hides the rating row.

## Accessibility
Every park must be reachable and openable with the keyboard alone, with a visible focus ring. Focus moves into the details view on open and back to the list item on close. The list and details are the primary path. Map markers are a second path, never the only one.

## Code conventions
Angular 22, modern patterns only. Standalone components, no NgModules. State in signal, computed, and effect. input() and output() functions, not decorators. inject(), not constructor injection. Built in control flow (@if, @for with track), never *ngIf or *ngFor. ChangeDetectionStrategy.OnPush on every component. The app is zoneless, so every Leaflet callback must write to a signal or the view will not update.

Data loads through one ParksService using HttpClient, exposing parks, loading, and error as signals. ParksService is the only caller of normalize.ts. Components never read raw JSON.

Folders are src/app/data, src/app/map, src/app/panel, plus app.ts, app.routes.ts, and the routed parks-page.ts at the root. Flat. No barrel files, no shared folder.

Plain CSS with custom properties, system font stack. The palette is seven tokens in styles.css (primary, secondary, each with dark and light, plus tertiary); tertiary is the one accent, used for buttons, links, selected states, and the focus ring. No global classes. No Angular Material, no Tailwind, no UI kit. Component styles stay scoped, with one exception: ParkMap uses ViewEncapsulation.None with every rule prefixed .park-map, because Leaflet creates marker DOM outside Angular's view. The global stylesheet holds tokens, the focus ring, reduced motion rules, and one html/body base block only.

Native elements first. a for navigation, button for actions, never a click handler on a div. One h1, headings in order, nav, main, and aside landmarks. ARIA only where a native element cannot do the job. Leaflet markers get title, alt, and an aria-label (alt is ignored on a divIcon).

Tests run on Vitest with TestBed. Test behavior through the public interface. Expected values come from the rules in this file, not from the code under test. Do not mock internal collaborators. Fixtures are the real sample file plus hand written edge rows.

Prettier with the scaffold's .prettierrc (printWidth 100, singleQuote), run before each commit. Conventional commit messages. Keep the Co-Authored-By trailer. No any. No new dependencies without asking.

## Working agreement
Work on main. When a slice is done, show me the diff and the test output and wait. I review, then I say commit. One commit per slice. If a requirement is unclear, ask before building. Do not add features I did not ask for.
