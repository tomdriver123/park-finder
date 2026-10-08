# Transcript 1: Claude Code session 89b775c1-f4be-4150-8226-c47dfdd97844

- start: 2026-10-08 03:45:47 UTC / 2026-10-07 23:45:47 New York
- end: 2026-10-08 04:28:25 UTC / 2026-10-08 00:28:25 New York
- user records: 33
- assistant records: 68
- tool calls: 28
- tool results: 28
- subagent transcripts: 0
- raw copy: `raw/transcript-1/89b775c1-f4be-4150-8226-c47dfdd97844.jsonl`

Every record of the session file follows in its original order. Bookkeeping records (attachments, titles, queue and file-history entries) are listed by type; their full payloads are in the raw copy.

## Session

- 2026-10-08T03:45:47.420Z · `queue-operation` record

- 2026-10-08T03:45:47.423Z · `queue-operation` record

- 2026-10-08T01:28:42.338Z · `attachment` record

### 2026-10-08T03:45:47.521Z · user

<ide_opened_file>The user opened the file /Users/tom/park-finder/CLAUDE.md in the IDE. This may or may not be related to the current task.</ide_opened_file>

We are building a takehome project. The instructions are at docs/local-parks-candidate.pdf. Need to create a plan to set up the project.

Scaffold Angular 22 in this folder with routing, CSS styles, and Vitest, no SSR. Install leaflet and @types/leaflet. Add Leaflet's CSS to the global styles. Create the folders src/app/data, src/app/map, src/app/panel, and public/assets/ with parks.sample.json moved into it. The brief stays in docs/. Add a .gitignore, init git, make and push the first commit. I've already created a private GitHub repo named park-finder. Read docs/local-parks-candidate.pdf and public/assets/parks.sample.json and list every data hole you find and how the CLAUDE.md rules handle each one. Do not write app code yet.

I should have a skill called grill at .claude/skills/grill/SKILL.md that we will use. Make sure you have access to it.

- 2026-10-08T03:45:47.520Z · `attachment` record

- 2026-10-08T03:45:47.520Z · `attachment` record

- 2026-10-08T03:45:47.520Z · `attachment` record

- 2026-10-08T03:45:47.520Z · `attachment` record

- 2026-10-08T03:45:47.520Z · `attachment` record

- 2026-10-08T03:45:47.520Z · `attachment` record

- 2026-10-08T03:45:47.520Z · `attachment` record

- 2026-10-08T03:45:47.520Z · `attachment` record

- 2026-10-08T03:45:47.520Z · `attachment` record

-  · `file-history-snapshot` record

-  · `atis-latch` record

- 2026-10-08T03:45:47.566Z · `attachment` record

- 2026-10-08T03:45:47.567Z · `attachment` record

- 2026-10-08T03:45:47.568Z · `attachment` record

- 2026-10-08T03:45:47.569Z · `attachment` record

- 2026-10-08T03:45:47.575Z · `attachment` record

-  · `last-prompt` record

-  · `atis-latch` record

-  · `ai-title` record

### 2026-10-08T03:45:56.782Z · assistant

**Thinking**



### 2026-10-08T03:45:57.532Z · assistant

I'll start by surveying the folder: the CLAUDE.md rules, the brief, the sample data, and whether the grill skill file exists.

### 2026-10-08T03:45:59.104Z · assistant

**Tool call: Bash**

```json
{
  "command": "ls -la && echo \"--- find ---\" && find . -maxdepth 4 -not -path '*/node_modules*' -not -path './.git/*' | sort && echo \"--- CLAUDE.md ---\" && cat CLAUDE.md",
  "description": "List folder contents and show CLAUDE.md"
}
```

### 2026-10-08T03:46:01.065Z · user

**Tool result**

```
total 24
drwxr-xr-x    6 tom  staff   192 Oct  7 22:53 .
drwxr-xr-x+ 142 tom  staff  4544 Oct  7 23:26 ..
-rw-r--r--@   1 tom  staff  6148 Oct  7 23:30 .DS_Store
-rw-r--r--    1 tom  staff  3256 Oct  7 22:53 CLAUDE.md
drwxr-xr-x    3 tom  staff    96 Oct  7 22:45 docs
drwxr-xr-x    4 tom  staff   128 Oct  7 23:30 public
--- find ---
.
./.DS_Store
./CLAUDE.md
./docs
./docs/local-parks-candidate.pdf
./public
./public/.DS_Store
./public/assets
./public/assets/.DS_Store
./public/assets/parks.sample.json
--- CLAUDE.md ---
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

Folders are src/app/data, src/app/map, src/app/panel, plus app.routes.ts. Flat. No barrel files, no shared folder.

Plain CSS with custom properties, one accent color, system font stack. No Angular Material, no Tailwind, no UI kit. Component styles stay scoped. The global stylesheet holds tokens, the focus ring, and reduced motion rules only.

Native elements first. a for navigation, button for actions, never a click handler on a div. One h1, headings in order, nav, main, and aside landmarks. ARIA only where a native element cannot do the job. Leaflet markers get alt and title.

Tests run on Vitest with TestBed. Test behavior through the public interface. Expected values come from the rules in this file, not from the code under test. Do not mock internal collaborators. Fixtures are the real sample file plus hand written edge rows.

Prettier defaults, run before each commit. Conventional commit messages. Keep the Co-Authored-By trailer. No any. No new dependencies without asking.

## Working agreement
Work on main. When a slice is done, show me the diff and the test output and wait. I review, then I say commit. One commit per slice. If a requirement is unclear, ask before building. Do not add features I did not ask for.
```

- 2026-10-08T03:46:01.067Z · `attachment` record

- 2026-10-08T03:46:01.071Z · `attachment` record

- 2026-10-08T03:46:01.075Z · `attachment` record

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

- 2026-10-08T03:46:04.879Z · `attachment` record

### 2026-10-08T03:46:04.879Z · assistant

**Thinking**



### 2026-10-08T03:46:07.119Z · assistant

**Tool call: Bash**

```json
{
  "command": "echo \"--- project .claude ---\" && ls -la .claude 2>&1; ls -la .claude/skills/grill 2>&1; echo \"--- user-level grill ---\" && ls -la ~/.claude/skills/grill 2>&1; echo \"--- any grill skill anywhere under ~/.claude ---\" && find ~/.claude -maxdepth 5 -iname '*grill*' 2>/dev/null; echo \"--- PLAN.md ---\" && ls -la PLAN.md 2>&1",
  "description": "Check whether the grill skill and PLAN.md exist"
}
```

### 2026-10-08T03:46:07.219Z · user

**Tool result** (error)

```
Exit code 1
--- project .claude ---
ls: .claude: No such file or directory
ls: .claude/skills/grill: No such file or directory
--- user-level grill ---
ls: /Users/tom/.claude/skills/grill: No such file or directory
--- any grill skill anywhere under ~/.claude ---
--- PLAN.md ---
ls: PLAN.md: No such file or directory
```

### 2026-10-08T03:46:08.024Z · assistant

**Tool call: Bash**

```json
{
  "command": "cat public/assets/parks.sample.json",
  "description": "Show the sample parks data file"
}
```

### 2026-10-08T03:46:08.072Z · user

**Tool result**

```
[
  {
    "id": "prospect-park",
    "name": "Prospect Park",
    "description": "A 526-acre park in the heart of Brooklyn with meadows, woodlands, a lake, and the borough's only forest. Designed by Olmsted and Vaux after they completed Central Park.",
    "location": { "lat": 40.6602, "lng": -73.969, "address": "Brooklyn, NY 11225" },
    "amenities": ["playground", "dog-run", "trails", "restrooms", "parking", "lake", "picnic-areas"],
    "hours": "6:00 AM - 1:00 AM",
    "images": ["https://images.example.com/prospect-1.jpg", "https://images.example.com/prospect-2.jpg"],
    "acreage": 526,
    "rating": 4.7
  },
  {
    "id": "riverside-commons",
    "name": "Riverside Commons",
    "description": "A narrow riverfront greenway popular with runners and cyclists, with unobstructed sunset views over the water.",
    "location": { "lat": 40.8009, "lng": -73.9722, "address": "Riverside Dr, New York, NY 10024" },
    "amenities": ["trails", "restrooms", "waterfront", "bike-path"],
    "hours": "6:00 AM - 10:00 PM",
    "images": ["https://images.example.com/riverside-1.jpg"],
    "acreage": 91,
    "rating": 4.4
  },
  {
    "id": "cedar-hill-nature-preserve",
    "name": "Cedar Hill Nature Preserve",
    "description": "Protected woodland with 4 miles of marked hiking trails and a birding blind overlooking a restored wetland.",
    "location": { "lat": 40.7128, "lng": -74.006, "address": "Cedar Hill Rd" },
    "amenities": ["trails", "wildlife-viewing", "parking"],
    "hours": "Dawn to dusk",
    "images": [],
    "acreage": 212,
    "rating": null
  },
  {
    "id": "sunset-playground",
    "name": "Sunset Playground",
    "description": "A compact neighborhood playground with shaded seating, a splash pad open in summer, and a small basketball court.",
    "location": { "lat": 40.6452, "lng": -74.0121, "address": "44th St & 7th Ave" },
    "amenities": ["playground", "splash-pad", "basketball", "restrooms"],
    "hours": "8:00 AM - 8:00 PM",
    "images": ["https://images.example.com/sunset-1.jpg"],
    "acreage": 3,
    "rating": 4.1
  },
  {
    "id": "highland-dog-park",
    "name": "Highland Dog Park",
    "description": "Fully fenced off-leash dog park with separate small-dog and large-dog areas, water fountains, and shade structures.",
    "location": { "lat": 40.6789, "lng": -73.9442 },
    "amenities": ["dog-run", "restrooms", "parking", "water-fountain"],
    "hours": "6:00 AM - 9:00 PM",
    "images": ["https://images.example.com/highland-1.jpg"],
    "acreage": 5,
    "rating": 4.8
  },
  {
    "id": "veterans-memorial-field",
    "name": "Veterans Memorial Field",
    "description": "Community sports complex with baseball diamonds, soccer fields, and a walking loop. Hosts local league play on weekends.",
    "location": { "lat": 40.7282, "lng": -73.7949, "address": "Memorial Dr, Queens, NY 11367" },
    "amenities": ["sports-fields", "trails", "restrooms", "parking", "playground"],
    "hours": "7:00 AM - 11:00 PM",
    "images": ["https://images.example.com/veterans-1.jpg"],
    "acreage": 47,
    "rating": 4.2
  },
  {
    "id": "old-mill-botanical-garden",
    "name": "Old Mill Botanical Garden",
    "description": null,
    "location": { "lat": 40.6215, "lng": -74.0776, "address": "12 Old Mill Ln" },
    "amenities": ["gardens", "restrooms", "cafe", "gift-shop", "accessible-paths"],
    "hours": "9:00 AM - 5:00 PM",
    "images": ["https://images.example.com/oldmill-1.jpg", "https://images.example.com/oldmill-2.jpg"],
    "acreage": 34,
    "rating": 4.6
  },
  {
    "id": "lakeshore-point",
    "name": "Lakeshore Point",
    "description": "Small waterfront park with a fishing pier, kayak launch, and a handful of picnic tables. Quiet on weekday mornings.",
    "location": { "lat": 40.5795, "lng": -73.9707, "address": "Shore Pkwy" },
    "amenities": ["waterfront", "fishing", "kayak-launch", "picnic-areas", "parking"],
    "hours": "Dawn to dusk",
    "images": ["https://images.example.com/lakeshore-1.jpg"],
    "acreage": 18,
    "rating": 4.3
  },
  {
    "id": "east-ridge-trailhead",
    "name": "East Ridge Trailhead",
    "description": "Gateway to a 9-mile ridgeline trail network with panoramic overlooks. Trails range from easy to strenuous.",
    "location": { "lat": 40.8501, "lng": -73.8662, "address": "Ridge Rd" },
    "amenities": ["trails", "parking", "wildlife-viewing"],
    "hours": "Dawn to dusk",
    "images": [],
    "acreage": 640,
    "rating": 4.9
  },
  {
    "id": "central-plaza-green",
    "name": "Central Plaza Green",
    "description": "An urban pocket park and event lawn ringed by food vendors, with free public WiFi and frequent weekend markets.",
    "location": { "lat": 40.7549, "lng": -73.984, "address": "1 Plaza Way" },
    "amenities": ["event-lawn", "wifi", "restrooms", "food-vendors", "accessible-paths"],
    "hours": "24 hours",
    "images": ["https://images.example.com/plaza-1.jpg"],
    "acreage": 6,
    "rating": 4.0
  },
  {
    "id": "willow-creek-wetlands",
    "name": "Willow Creek Wetlands",
    "description": "Boardwalk trails wind through a protected tidal wetland. Interpretive signage explains the ecosystem.",
    "location": { "lat": 40.6001, "lng": -74.0899, "address": "Creek Rd" },
    "amenities": ["boardwalk", "wildlife-viewing", "trails", "accessible-paths"],
    "hours": "Dawn to dusk",
    "images": ["https://images.example.com/willow-1.jpg"],
    "acreage": 78,
    "rating": 4.5
  },
  {
    "id": "hillcrest-skate-park",
    "name": "Hillcrest Skate Park",
    "description": "Concrete skate park with bowls, rails, and a street course. Lit for evening use.",
    "location": { "lat": 40.6934, "lng": -73.9876, "address": "Hillcrest Ave" },
    "amenities": ["skate-park", "restrooms", "lighting"],
    "hours": "8:00 AM - 10:00 PM",
    "images": ["https://images.example.com/hillcrest-1.jpg"],
    "acreage": 2,
    "rating": 3.9
  }
]
```

### 2026-10-08T03:46:11.852Z · assistant

**Tool call: Bash**

```json
{
  "command": "echo \"--- node ---\" && node --version 2>&1; echo \"--- npm ---\" && npm --version 2>&1; echo \"--- ng global ---\" && (ng version 2>&1 | head -20 || true); echo \"--- npx @angular/cli latest ---\" && npm view @angular/cli version 2>&1; npm view @angular/cli dist-tags --json 2>&1; echo \"--- leaflet ---\" && npm view leaflet version 2>&1; npm view @types/leaflet version 2>&1; echo \"--- gh ---\" && gh --version 2>&1 | head -1; gh auth status 2>&1; echo \"--- git ---\" && git --version; git config --global user.name; git config --global user.email; echo \"--- gh repo ---\" && gh repo view park-finder --json name,url,isPrivate,defaultBranchRef,sshUrl 2>&1",
  "description": "Check tool versions, Angular CLI latest version, and GitHub auth and repo"
}
```

### 2026-10-08T03:46:12.367Z · assistant

**Tool call: Read**

```json
{
  "file_path": "/Users/tom/park-finder/docs/local-parks-candidate.pdf"
}
```

### 2026-10-08T03:46:16.770Z · user

**Tool result**

```
--- node ---
v24.14.1
--- npm ---
11.11.0
--- ng global ---

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    

Angular CLI: 18.2.11
Node: 24.14.1 (Unsupported)
Package Manager: npm 11.11.0
OS: darwin x64

Angular: 
... 

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1802.11 (cli-only)
--- npx @angular/cli latest ---
22.2.2
{
  "v6-lts": "6.2.9",
  "v7-lts": "7.3.10",
  "v8-lts": "8.3.29",
  "v9-lts": "9.1.15",
  "v10-lts": "10.2.4",
  "v11-lts": "11.2.19",
  "v12-lts": "12.2.18",
  "v13-lts": "13.3.11",
  "v14-lts": "14.2.13",
  "v15-lts": "15.2.11",
  "v16-lts": "16.2.16",
  "v17-lts": "17.3.17",
  "v18-lts": "18.2.21",
  "v19-lts": "19.2.27",
  "next": "22.3.0-next.1",
  "v20-lts": "20.3.39",
  "v21-lts": "21.2.26",
  "latest": "22.2.2"
}
--- leaflet ---
1.9.4
1.9.22
--- gh ---
gh version 2.89.0 (2026-03-26)
github.com
  ✓ Logged in to github.com account tomdriver123 (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'project', 'read:org', 'repo', 'workflow'
--- git ---
git version 2.50.1 (Apple Git-155)
--- gh repo ---
{"defaultBranchRef":{"name":""},"isPrivate":true,"name":"park-finder","sshUrl":"git@github.com:tomdriver123/park-finder.git","url":"https://github.com/tomdriver123/park-finder"}
```

### 2026-10-08T03:46:16.820Z · user

**Tool result**

```
PDF file read: /Users/tom/park-finder/docs/local-parks-candidate.pdf (98.5KB)
```

```json
{
  "type": "document",
  "source": {
    "type": "base64",
    "media_type": "application/pdf",
    "data": "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovUHJvZHVjZXIgKFJlcG9ydExhYiBQREYgTGlicmFyeSBcMDU1IFwwNTBvcGVuc291cmNlXDA1MSkKL0F1dGhvciAoR3JhbmljdXMpCi9DcmVhdGlvbkRhdGUgKERcMDcyMjAyNjA5MTcxMDU0MzZcMDU1MDdcMDQ3MDBcMDQ3KQovQ3JlYXRvciAoXDA1MHVuc3BlY2lmaWVkXDA1MSkKL0tleXdvcmRzICgpCi9Nb2REYXRlIChEXDA3MjIwMjYwOTE3MTA1NDM2XDA1NTA3XDA0NzAwXDA0NykKL1N1YmplY3QgKFwwNTB1bnNwZWNpZmllZFwwNTEpCi9UaXRsZSAoRmluZCBhIFBhcmsgVGFrZSBIb21lIFwxNzQgQ2FuZGlkYXRlIGJyaWVmKQovVHJhcHBlZCAoXDA1N0ZhbHNlKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDMKL0tpZHMgWyA0IDAgUiAxNiAwIFIgMzIgMCBSIF0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9Db250ZW50cyA1IDAgUgovTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgNiAwIFIKL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4KL1JvdGF0ZSAwCi9UcmFucyA8PAo+PgovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9GaWx0ZXIgWyAvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGUgXQovTGVuZ3RoIDE2MjkKPj4Kc3RyZWFtCkdhdUhKPyNTSWUmOkUqNWZYSkdvX1hLc0E1ISNqMChlQjgwQWZESEpiREE/TD0tNVc9bU82YVJJc2JtaVBVbjJqUz1qXyxecFw+LF0vcWYxW3Q4KWVNIiFMLExnSHFNbyFLU3BVMycrPSovdUNxOCc/I0RmLSNyYG5ST2hdLiUtLDAwZFxHV11idVc+NyhZYFpqIlxlKjtsWExkU1ZSNTtcZk84XUJKTm9QYCwlSyskKE1RL1NXXlooK0g1TS9vMTpMMSdgc0dGTitwUyIoWFxITFQ9cU04ZWxoPiZTXD9QI0A5VFJiPzRzKlhNbWpjXDBAJkomamJJcidwIlNVIWo3Vy8ycl5sPmJTRitfc1BLPjNrYEgpcWxUKlFUWj9aTDheKFkhYWoqN0lTODBPMkJWTUBtMl9tbW8iLFxHJ0RkMG9gZSEkLFZXNk5cZCxYMFgjVmlQR0ZoSWgsI1JbTVZhZG80VUNwVmk5PFQjSlxNPyxSJC5AQyg0aitxTGpMPDI+aidOYz4kN3VZb0pfYTgzKkxNXXAyals2a0cxPFNRT0U0XTFDOFddNkJSVVBGIyI2QHEmNDRrLz1QQFwuOlc6cDEoPTdrW0NUbik+cFtbV0clc0lPQnVoKz07a19AUk9dPjA+V3FNSig5TGBfTz1dLD5nPlhbYjE8SDxUcChUZUNuPEpfViYzTWo8OEE4MjdHQTJFIkJGZ2VTZiM+bilDW0laYGVnMTIrJTttKmRfLHNpSy03NlZhPjc6QW1CQ0RBJSdAQkQ+aDlvVFpgJF8/VFFRSjE0YlZdX0hbN2ZPSz5mNWNjTjYuRUl0Yjk9OiQ8T3A+ZGIzQWhlNEY1PWI8XT9XJGVsOEhSYjIqLi87cHE0Tk0tSCsjbzdfQGBETyZKUjthWVMzPi1JNjJnMWFwYDdddDAjSWZRUmQ/JmFwL0dNSCcnJVg+SWA4cGE7ODJqV1VHKj9FQnVZImxraDo7LidxNyVBaTJgOSJAXldSPnFUUSIwN1pESU1aRlcqTmkpTTMsI2FUUGQ8M2NIOCcuTUsnaD5jNUh1QT9TMFRSSEc+RiZnNypnPjZiYkReKHFOcHNYJmtCNS84aUwjQVJuSEFwPj51cmVaTV9vNm0hIkI2Q0dOcUxYX1xIL0NEYnE5YUQnJW8zR0x1VWtTTlgiZDRNQFFhYFhYJjlQJU1EXXM0YzxgKl1yS19TV0w2Mkc7U2BWYSlUXystKmZFMz9dQjpCX11gLVhFc09DUD1haHBrQFkwZF8pTEU4Xyt0MnBsQEJNJ1ZiPU41JFU7N2VnQF41OVIiTSdEZ3BiIlxoOzI6VWFgbzcjNnBHZmBBOy9ZV2AzK0tMVG5HI1EhYig/KmpkajNacXQvNF1SdHBmI0o4ZENHbTtXVzopKz9bLmU9WEtMNT9GaEBUcXQ+YkVOQkxqaSRtXygyYzIxWTVAN2piVE1lLDwwKnMrYTNbVnIkMkVrW047ZzApP1FHKjwjP0ApOCojaihqR08+XFA9UW9TNl9wdT9GWGFnYiM4IlRrXi1uSXNcN0E+L0E3bV1tcEdJbVpZNVJRTz1ZRks3NWFWRHJNW0tdaVUlQ2BLbCJRN15GPGZoRTM5Ll9baFtgaWR1YHNtJDhCRFEkWVE+NWZwX1k6bU5fPzc4Oy8uUFxKRmZIcztVWW4rTVlsaXM6NTZCdUJZUWs0Yi5wXXVMZChaWmxAJDNgOi4taDFmLU0sOk4uRENMJGxiOmJnI0goWEgvTWhPLExBKmdvRltGUSJSImVrdFxSQ00zJDwqdUo7ZGQ+VSlcTEskTnIpbz9TV01DKF5OXUBzTXVnOjhfIkR0MzRJQkIqcmQsIltjVCVnOTNwZVckKjRvKSIpajMsRURJb1dnTFlaSGZzK0czMj05JSJEPUg1U29ZU0NZMEhUS3JvXlRQbGdEdUxNNEBMOS5EZ2hRJV0pXE5RNWIzWFJkP2pFaXJYS3AvI0BJZU9PczYyTkxwaCVKVl47OEtGLl05QVUoOWtPKileaClPQm9NYCRrPXNEN0RAcDAvcEhSIzBKUUxMNm1OLko2QCVZI0knXiJnRTtoPV9dZTojbVkjdWxRaTlOUiphZCQ7ZzUoZFdtLTF0LicpL2VhKihGJCxgTFdbWjF1YERjJkMwL3NGPyFGKTVKRm9+PgplbmRzdHJlYW0KZW5kb2JqCjYgMCBvYmoKPDwKL0YxIDcgMCBSCi9GMiswIDggMCBSCi9GMyswIDEyIDAgUgo+PgplbmRvYmoKNyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwovTmFtZSAvRjEKL1N1YnR5cGUgL1R5cGUxCi9UeXBlIC9Gb250Cj4+CmVuZG9iago4IDAgb2JqCjw8Ci9CYXNlRm9udCAvQUFBQUFBK1VidW50dQovRmlyc3RDaGFyIDAKL0ZvbnREZXNjcmlwdG9yIDkgMCBSCi9MYXN0Q2hhciAxMjcKL05hbWUgL0YyKzAKL1N1YnR5cGUgL1RydWVUeXBlCi9Ub1VuaWNvZGUgMTEgMCBSCi9UeXBlIC9Gb250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UChUaElINzlqYDllNFtyXHNmNSlxKE43a2BYVl1gWWB0RClTPmZFMy5EPWUpWkRzQi9oMjhNJy90Z0JjQT9tbiNOaV01biopQlsuJGAuRygsNUNENSYsPSRfbS5cQiooXGRxOi0iVFApNj43Ljk7Nz9fK0FqSURrYmt0WFYlNkMjOlhCN1xhK1dVMlczSEJoUGppTC4pTm1gUyJyOEgpSEtzP25WKU9YcT4uc2ZPLW84JjBjVWdzMkBcKktNKHFJXWNhbGxdLzRqbyNrWGZASUdNIldoXktyUD5wbig2ckVvYkklWF40dSk8UzspY1gyW1FMQjM6KEtkSkQ9Z0FMKzNgdDkkSlI2c1lIMEg7altvYkRZVCdKc1I5MF5JWSl1ZFJLOXI+ZThDSzc2NEJnMyxYPCE9Vl8vWGNANSRBWUdEUF9EWmVqSi1sPyRyTHRNVzpNSUFjJFZKJyhpOCpVRWhyI2ZybiZSPiRCRD9dS1xaakFwSiZvYypyWklXY1dXRCxScmE3cmRoWmNnJiQ5ZGAlNWpzSG0uYEcodC5YUjNpJl5kZ0k3ZXQiWzZxUjFwb0QqM2cwNFgscjhJP0Q3MW8kWTNYK2coaigjPyktYT5PQFkoVGNDKHVVY24lXDklRTBsI25bJEstaThbbCtvbTYrY29QcTciPixtUD9vViQ0Rl5iQ05gIUlzPGp1PzZdTXRPLVBrQ2Q2TzBWODxLW0RLakg9Z1tYJy0tK1BFVkpRUEhlPV0+P3VpJCduKVA1JGFfQ1IlJTtCaiUqLEk5cTVOKFVaIUtzSVVLaUElKEdPUTFqPkJcJ10jTG4hQSxqSUgiWko8Iz9gP2YuYjM7XSRTOVJhVj1mNydiTSZEbFBlI2owN1VXOF1KWUs6TEg9STQpcnNib00/OiJVLFgpOj8uTz1jdUVVSTVGTTNhMlJkLWdlJVksWydyPjxMMmE3RFdHTzRkIilbZy9CalhxWSZxUkluZFwhWDVuM2J1PkBGdFFOKlBvb0J1XFdub0YuMVkxVk5fYS0zdTVjNypDWmdPRzwwcz5OUHM3bmRMMStwKTBGWjROWTVcJ01mZ1g9Vz9iWCo5Oj5uQltnRj9DQi1EQmlOYjxDQVRtKz9xNU1WQCtxZzVtclReNyVZT1hKJFYzWClxPUl1XkgsMWxRRTJJWDc6YCdzXmRxcjIrcGdLYSpeKzIoXWJfWmI4QStmQjgrVyMma2xjLWdKJ2khQl9fXzltQVwjODNiTSc+QjZTKzFtR1ghMDtwNCxIZi1uMiQ4ZSRAcllmW0kvXVpmSCkvT1k5XFIpQi4tTDJAPmMmK2dIJTRgUWA0IWkuRkpDZVxSXiJXU1hUQVAhb1g7IVNTInVkc0NDUW9qLVFhJUw0cU9tUm9xRVMrXTpQbklMck4iWSdkYFkpaTRHLjlwND9fLm81TDRbYFh0PFdYSlYlbGIrO19qY3VkLGRFI2JbJiRmNSRbPFJzMmw9M0NaZmBoLU9ZNm86Q0lJWGNBMnFYZzwnL25XUzVocDgwTEksKGBHLnQhTXU2JlxOdWRxO1JzTGM9LFtWOz1IJFptTUx+PgplbmRzdHJlYW0KZW5kb2JqCjE4IDAgb2JqCjw8Ci9GMSAxOSAwIFIKL0YyKzAgMjAgMCBSCi9GMyswIDI0IDAgUgovRjQrMCAyOCAwIFIKPj4KZW5kb2JqCjE5IDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCi9OYW1lIC9GMQovU3VidHlwZSAvVHlwZTEKL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjIwIDAgb2JqCjw8Ci9CYXNlRm9udCAvQUFBQUFBK1VidW50dS1Cb2xkCi9GaXJzdENoYXIgMAovRm9udERlc2NyaXB0b3IgMjEgMCBSCi9MYXN0Q2hhciAxMjcKL05hbWUgL0YyKzAKL1N1YnR5cGUgL1RydWVUeXBlCi9Ub1VuaWNvZGUgMjMgMCBSCi9UeXBlIC9Gb250Ci9XaWR0aHMgWyAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMjQwIDI4NiA0NjUgNjk5IDU2OCA5MTggNzA1IDI0NyAzNTYgMzU2IDUwMiA1NjggMjQ2IDM0MCAyNDYgNDM3IDU2OCA1NjggNTY4IDU2OCA1NjggNTY4IDU2OCA1NjggNTY4IDU2OCAyNDYgMjQ2IDU2OCA1NjggNTY4IDQ1NSA5NzQgNzIxIDY3MiA2NDggNzM3IDYwNiA1NzQgNzAyIDczNCAzMTYgNTI5IDY4NCA1NjMgODk3IDc1NiA3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ZHN0cmVhbQplbmRvYmoKMjggMCBvYmoKPDwKL0Jhc2VGb250IC9BQUFBQUErVWJ1bnR1TW9uby1SZWd1bGFyCi9GaXJzdENoYXIgMAovRm9udERlc2NyaXB0b3IgMjkgMCBSCi9MYXN0Q2hhciAxMjcKL05hbWUgL0Y0KzAKL1N1YnR5cGUgL1RydWVUeXBlCi9Ub1VuaWNvZGUgMzEgMCBSCi9UeXBlIC9Gb250Ci9XaWR0aHMgWyA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIDUwMCA1MDAgNTAwIF0KPj4KZW5kb2JqCjI5IDAgb2JqCjw8Ci9Bc2NlbnQgNjkzCi9DYXBIZWlnaHQgNjkzCi9EZXNjZW50IC0xNjUKL0ZsYWdzIDUKL0ZvbnRCQm94IFsgLTMxNiAtMTcwIDY2NSA4MzAgXQovRm9udEZpbGUyIDMwIDAgUgovRm9udE5hbWUgL0FBQUFBQStVYnVudHVNb25vLVJlZ3VsYXIKL0l0YWxpY0FuZ2xlIDAKL01pc3NpbmdXaWR0aCA1MDAKL1N0ZW1WIDg3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PDckQzVLOXI8Oi5rMkM+NihcMXMwJjdqUWo6JSxULV1FQE9iMlIhZ11cSVJGQShba3VJcDFyQyRZYlppRz4sTFkkR2hMXiNQPzY4VCsqMFJqViJvOnA0bzswdXBnX0tbYy1TKj0pZk5sLEJfSktVTm1qKEpeP10zWk4qKVVXYF0pITF1UjNWWGljKC85JXFqIkcxVl8oJS1WOytVUidibDw9a21pOlMxcVJJXCJOOCYkbis7bW90THJSXi41cjlVOVBLKzhmVWtvdDFiYEcnWjsxLWtoPUNyXTZdPCNCaEYrZE1YPGxlMSlYJD9LaTBVZj9SaD9hbGI/KTNbP1lLWD0yYTpHYmpJbk5XPTUnMl8xS0RkOXQ7cjIsQG03aHEuSj5MXCVmKkorTksnakszVChYM1E6QSxfVkhCLlMqcVRhLWQ9LW1QOSsiaG1NO2JPXyxtN05KOlouYyRUV21cUDNSZV1pM14kNU8xPD1YJVM+IzxNWSFhL0pwPj5cU0YwVThNXEFsR151ZWhQL2ZJMWcsYiY9aGRnV3I1OUspVWYuLSpedSgualloV2xSSD8raHJhJUNmPjJAN2Q9OUwsXiJCLUhJVUdgIStLZWRnYSVqZyg3MEdaMWY3NkZtIUFJNSZOTWQzLjskak9DdU1hZj9oXEA9MVhUMWIwMzgxZTdpMldPQTw3VnI6ayEtNUomSTNkPUIhMlNAZldOOStmQEFSSUcvTl1kMF1LbzkmXzFPXzk5Vll0R1IoIlFrPElOalZiLTEkWlFtQSheOFJuSzdPMnVdNywmczMkTUlbOVI6cnEnZjFyUUoyTSlDLGFfXlI2ZUw6S3A0WGNSZSciKmMycllxJ0VeMDxUX0w7SW03QzAlV0YiISsyI0cxK1E6Ii5jcV5aRC91JUErQDk9RFJIMWAzKjByIlMsP0ZPby9yQFdwVlIjQkIkRGMqUGQ5YGU5PDNOX1cqUnRaLV1WYyYvRFcwSixOOE9hRkZVdVohajtZXCdRITpCaChDXV50RjwiJkohbWQnUkgkTj9Naj9YNSZHMT1dTU9sOy4jL2ZYMihYRW9ZPUkvRltqNTdMcTU7Si1EWywzbDYtRCJhbWozSVIiP240InAvQls+Y1xSNkInJEw8OShhT2wlP2UvIW9pWzdDYmB1J2pHMS5fQjwhP3BCLlNUJScqWGgoMVtFS1RWKUg+UUQuJ1gzRmFbI1IsPmJZYVNdQWxvcSQuP149NCVIYlFiZURzKjVPZVooUTJgcGFxQj9tb1FSZllTKWJpOltHdW4qZjUsXzpYYitiSyZuYlE5Lz1PWyw1Iic1ZmdtNEpBUDhzWT0sLCxhTkZTSGtMRTgpJF05aU5GO1JubTw1NylyailDPDktYlxLMFJVcnBdNyU7IWQuTTcndFVaJSZlKD9FTVZFaVFlMGNiZTJqZC0vRzdlPW9dWjhXN3NwR1tiVl1jKy5EWEBBWV1OXT8sRGtdR2deLSI9LyJbJWpIZ25XKj9EQ1NaPiNGX0MxVl8vbTtFViFrQmslQnBUcV00Yj1hKnBpU0stQ0xlT3FYRCg0bEA1MGNTJ0wyO1k5ZDNNMF1cXi85LkpAWF46LXBxYkNGKXFbRUYoWWtwOHFIJlRMJm8kPykqcmJENSYoY2IuLVs4MjhrWiMmPU1IZEFjLio+KlIjTyxuYEE2NDE1PEtJQl1hWm8nRVQnTlhxQS9MMyE6ZzBiRSo5SUJlYSh1JU8rY1grNDopaThlOm1GOXAnPSxSIWZBOiIxX2J0TU4xKkNTUidVLGcjLENHK0pfL1diVDxuTkVGIT9zWk9XNiVKb003ImA/Z0dWOVY6YDUnJy00dShXIkYnWFtSQkxkQlByazpGKW1CLydKOiptRFVKVV46UjojY245aFJgcCo2Wy45NkQ5WCMidGlfRCpPJ05oTzNBS0UjZVJISTU7TDEoL2YkbUgvaGtHVXA5VW4ocVtAYDNSV0d0XDdpQ0ZObFhqRT9dYitqTW50UyVQIzNaX2AzN0s6bmQqSU84WnM1Q21jRD5aSjxvaFlHMyhsaiZNVl5OTiFJdD0ycTYtdFtiZVFraiktNmFaRkldWFwwYkE1QmxQMzE3Rk5uJVw2cjM1YEUvZEIrcTZGJUkpMG86NDcqaiNCYCspQWs5aSg6KTMqRS5rdWIuSkc1SDBtVDhjPWJST3U0PDFBIldUbWNCc18oOz9EZCNia0dqTid1N0NYOCFKQSRgdTxoWkxNbCFuK2BSTy4ya1YjZixdOVYzczlGV2tTLWAhX09aazRZSF0rUi4zaSFlRyhkcC4nUXJaSltvU2A9VmJJLjVSUyItR0wtUkNVYGpoYVhxUzhQM2MrPSc1MU1BZkZQKiVMVG1wOWotYnByK0s7YTw6ODFiV2VMMzlPQFVXR1EiMVV0U0RnST83K2tTWCQrLkomT2tlRFU+dDApbSxxTCV1QWhSbFY1XkVEXCduc1smIiFMIWtrTWpcYmJWPyQzajxLUS4ucTYzI1AhXyNyUDlPPHQ6al9LIisqMipmbCc5TG45RmRnWDFYKW48PE0rMkBDMG5fKSojKSo7bFc6cSdMK0E0ayNsUy0vNCgoITsiRCpHOTpKXEJDQjomRUlOMytjZzo1R1ZrKmVTLz4iMj8/cExcNU4uKTxeVlkvcj5CQXInKDRdOHBCfj4KZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMzQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAzNjAgMDAwMDAgbiAKMDAwMDAwMDQzMyAwMDAwMCBuIAowMDAwMDAwNDgyIDAwMDAwIG4gCjAwMDAwMDA2NzEgMDAwMDAgbiAKMDAwMDAwMjM5MiAwMDAwMCBuIAowMDAwMDAyNDQ4IDAwMDAwIG4gCjAwMDAwMDI1NTUgMDAwMDAgbiAKMDAwMDAwMzE3MyAwMDAwMCBuIAowMDAwMDAzMzg1IDAwMDAwIG4gCjAwMDAwMjI3NzUgMDAwMDAgbiAKMDAwMDAyMzUyNSAwMDAwMCBuIAowMDAwMDI0MTQ4IDAwMDAwIG4gCjAwMDAwMjQzNzIgMDAwMDAgbiAKMDAwMDA0MDAzMyAwMDAwMCBuIAowMDAwMDQwNzgzIDAwMDAwIG4gCjAwMDAwNDA5NzUgMDAwMDAgbiAKMDAwMDA0MjYwNCAwMDAwMCBuIAowMDAwMDQyNjc2IDAwMDAwIG4gCjAwMDAwNDI3ODQgMDAwMDAgbiAKMDAwMDA0MzQwNyAwMDAwMCBuIAowMDAwMDQzNjMxIDAwMDAwIG4gCjAwMDAwNTkyOTIgMDAwMDAgbiAKMDAwMDA2MDA0MiAwMDAwMCBuIAowMDAwMDYwNjYyIDAwMDAwIG4gCjAwMDAwNjA4NzUgMDAwMDAgbiAKMDAwMDA4MDI2NSAwMDAwMCBuIAowMDAwMDgxMDE1IDAwMDAwIG4gCjAwMDAwODE3MDkgMDAwMDAgbiAKMDAwMDA4MTkzMyAwMDAwMCBuIAowMDAwMDk3MDQ2IDAwMDAwIG4gCjAwMDAwOTc4MDEgMDAwMDAgbiAKMDAwMDA5Nzk5MyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDM0Ci9Sb290IDMgMCBSCi9JbmZvIDEgMCBSCj4+CnN0YXJ0eHJlZgoxMDAxMzMKJSVFT0YK"
  }
}
```

- 2026-10-08T03:46:16.832Z · `attachment` record

- 2026-10-08T03:46:16.836Z · `attachment` record

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

- 2026-10-08T03:49:57.737Z · `attachment` record

### 2026-10-08T03:49:57.736Z · assistant

**Thinking**



### 2026-10-08T03:49:57.752Z · assistant

**Thinking**

Survey found three issues: the grill skill is missing entirely, parks.sample.json is already in public/assets (so scaffolding must avoid overwriting it), and PLAN.md is referenced but doesn't exist yet. Next I'll check git identity/credentials, search elsewhere for the grill skill, and verify Angular 22's `ng new` flags.



### 2026-10-08T03:49:59.656Z · assistant

**Tool call: Bash**

```json
{
  "command": "echo \"--- wide grill search (Spotlight) ---\"; mdfind -name SKILL.md 2>/dev/null | grep -i grill; mdfind 'kMDItemFSName == \"grill\"' 2>/dev/null | head; echo \"--- find under home, dirs named grill* ---\"; find ~ -maxdepth 7 -type d -iname 'grill*' -not -path '*/node_modules/*' -not -path '*/Library/*' 2>/dev/null | head; echo \"--- user claude dir layout ---\"; ls -la ~/.claude 2>&1 | head -40; ls ~/.claude/skills 2>&1; ls ~/.claude/commands 2>&1; ls ~/.claude/plugins 2>&1 | head; echo \"--- settings mention of grill ---\"; grep -ril grill ~/.claude/settings.json ~/.claude/settings.local.json 2>/dev/null",
  "description": "Search the whole home folder for a grill skill"
}
```

### 2026-10-08T03:50:02.519Z · assistant

**Tool call: Bash**

```json
{
  "command": "echo \"--- git identity (any scope) ---\"; git config --get user.name; git config --get user.email; git config --list --show-origin 2>/dev/null | grep -iE 'user\\.|credential|init\\.default' ; echo \"--- gh profile ---\"; gh api user --jq '{login: .login, name: .name, email: .email}' 2>&1; echo \"--- gh git-credential wired? ---\"; git config --show-origin --get-all credential.helper 2>&1; git config --show-origin --get-all 'credential.https://github.com.helper' 2>&1; echo \"--- prettier latest ---\"; npm view prettier version 2>&1",
  "description": "Check git identity, GitHub profile, and credential helper setup"
}
```

### 2026-10-08T03:50:04.332Z · user

**Tool result** (error)

```
Exit code 2
--- wide grill search (Spotlight) ---
--- find under home, dirs named grill* ---
/Users/tom/.cursor/skills/grill-me
--- user claude dir layout ---
total 64
drwx------   24 tom  staff    768 Oct  7 23:26 .
drwxr-xr-x+ 142 tom  staff   4544 Oct  7 23:48 ..
-rw-r--r--@   1 tom  staff     24 Oct  7 23:36 .last-cleanup
-rw-r--r--@   1 tom  staff    165 Sep 21 23:47 .last-update-result.json
drwxr-xr-x    7 tom  staff    224 Oct  7 23:48 backups
drwx------@   2 tom  staff     64 Sep 24 12:08 bridge-spawn
drwxr-xr-x@   5 tom  staff    160 Sep 16 12:51 cache
drwxr-xr-x@   3 tom  staff     96 Jul  8 13:08 chrome
drwxr-xr-x@  21 tom  staff    672 Oct  7 20:49 file-history
-rw-------@   1 tom  staff  11401 Jul 22 02:18 history.jsonl
drwxr-xr-x    7 tom  staff    224 May  5 05:22 hooks
drwx------    9 tom  staff    288 Oct  7 21:20 ide
-rw-r--r--@   1 tom  staff    171 Oct  3 08:01 mcp-needs-auth-cache.json
-rw-r--r--    1 tom  staff    813 Aug 21 22:37 mcp.json
drwxr-xr-x@  13 tom  staff    416 Sep 23 19:54 plans
drwxr-xr-x    4 tom  staff    128 Oct  7 23:48 plugins
drwx------    4 tom  staff    128 Oct  7 23:45 projects
drwxr-xr-x  171 tom  staff   5472 Oct  7 23:48 session-env
drwx------@  12 tom  staff    384 Oct  7 23:48 sessions
-rw-r--r--    1 tom  staff   1440 Oct  7 23:26 settings.json
drwxr-xr-x@  12 tom  staff    384 Oct  7 23:46 shell-snapshots
drwxr-xr-x    3 tom  staff     96 Sep 16 15:25 skills
drwx------    3 tom  staff     96 Oct  7 16:00 state
drwxr-xr-x    3 tom  staff     96 Oct  4 13:30 telemetry
synced
ls: /Users/tom/.claude/commands: No such file or directory
plugin-directory-cache-v2.json
synced
--- settings mention of grill ---
```

### 2026-10-08T03:50:05.084Z · assistant

**Tool call: Bash**

```json
{
  "command": "cd /private/tmp/claude-501/-Users-tom-park-finder/89b775c1-f4be-4150-8226-c47dfdd97844/scratchpad && npx -y -p @angular/cli@22.2.2 ng new --help 2>&1 | grep -vE '^\\s*$' | head -120",
  "description": "Fetch Angular CLI 22.2.2 and print the ng new options",
  "timeout": 180000
}
```

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

### 2026-10-08T03:50:05.709Z · user

**Tool result**

```
--- git identity (any scope) ---
file:/Library/Developer/CommandLineTools/usr/share/git-core/gitconfig	credential.helper=osxkeychain
file:/Library/Developer/CommandLineTools/usr/share/git-core/gitconfig	init.defaultbranch=main
--- gh profile ---
{"email":null,"login":"tomdriver123","name":null}
--- gh git-credential wired? ---
file:/Library/Developer/CommandLineTools/usr/share/git-core/gitconfig	osxkeychain
--- prettier latest ---
3.9.9
```

### 2026-10-08T03:50:11.801Z · user

**Tool result**

```
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@angular/cli@22.2.2',
npm warn EBADENGINE   required: {
npm warn EBADENGINE     npm: '^6.11.0 || ^7.5.6 || >=8.0.0',
npm warn EBADENGINE     node: '^22.22.3 || ^24.15.0 || >=26.0.0',
npm warn EBADENGINE     yarn: '>= 1.13.0'
npm warn EBADENGINE   },
npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@angular-devkit/architect@0.2202.2',
npm warn EBADENGINE   required: {
npm warn EBADENGINE     npm: '^6.11.0 || ^7.5.6 || >=8.0.0',
npm warn EBADENGINE     node: '^22.22.3 || ^24.15.0 || >=26.0.0',
npm warn EBADENGINE     yarn: '>= 1.13.0'
npm warn EBADENGINE   },
npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@angular-devkit/core@22.2.2',
npm warn EBADENGINE   required: {
npm warn EBADENGINE     npm: '^6.11.0 || ^7.5.6 || >=8.0.0',
npm warn EBADENGINE     node: '^22.22.3 || ^24.15.0 || >=26.0.0',
npm warn EBADENGINE     yarn: '>= 1.13.0'
npm warn EBADENGINE   },
npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@angular-devkit/schematics@22.2.2',
npm warn EBADENGINE   required: {
npm warn EBADENGINE     npm: '^6.11.0 || ^7.5.6 || >=8.0.0',
npm warn EBADENGINE     node: '^22.22.3 || ^24.15.0 || >=26.0.0',
npm warn EBADENGINE     yarn: '>= 1.13.0'
npm warn EBADENGINE   },
npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@schematics/angular@22.2.2',
npm warn EBADENGINE   required: {
npm warn EBADENGINE     npm: '^6.11.0 || ^7.5.6 || >=8.0.0',
npm warn EBADENGINE     node: '^22.22.3 || ^24.15.0 || >=26.0.0',
npm warn EBADENGINE     yarn: '>= 1.13.0'
npm warn EBADENGINE   },
npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'npm-package-arg@14.0.0',
npm warn EBADENGINE   required: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' },
npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'hosted-git-info@10.1.1',
npm warn EBADENGINE   required: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' },
npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'proc-log@7.0.0',
npm warn EBADENGINE   required: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' },
npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'validate-npm-package-name@8.0.0',
npm warn EBADENGINE   required: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' },
npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
npm warn EBADENGINE }
Node.js version v24.14.1 detected.
The Angular CLI requires a minimum Node.js version of v22.22.3 or v24.15.0 or v26.0.0.
Please update your Node.js version or visit https://nodejs.org/ for additional instructions.
Shell cwd was reset to /Users/tom/park-finder
```

- 2026-10-08T03:50:11.811Z · `attachment` record

- 2026-10-08T03:50:11.816Z · `attachment` record

- 2026-10-08T03:51:15.128Z · `attachment` record

### 2026-10-08T03:51:15.127Z · assistant

**Thinking**



### 2026-10-08T03:51:15.136Z · assistant

**Thinking**

Node 24.14.1 is too old for Angular 22.2 (needs 24.15.0) and git has no identity set, so I'll check available version managers and configure a local git identity before continuing. I also found a `grill-me` skill in your Cursor skills folder and will read it to confirm it's the one you meant.



### 2026-10-08T03:51:19.324Z · assistant

**Tool call: Bash**

```json
{
  "command": "echo \"--- node binaries on PATH ---\"; which -a node; node -p process.execPath; echo \"--- version managers ---\"; for t in nvm fnm volta mise asdf n; do printf '%s: ' \"$t\"; command -v \"$t\" 2>/dev/null || echo \"(not on PATH)\"; done; ls -d ~/.nvm ~/.fnm ~/.volta ~/.local/share/mise ~/.asdf 2>&1; echo \"--- shell rc mentions ---\"; grep -nEi 'nvm|fnm|volta|mise|asdf' ~/.zshrc ~/.zprofile ~/.zshenv 2>/dev/null; echo \"--- nvm (sourced) ---\"; [ -s ~/.nvm/nvm.sh ] && . ~/.nvm/nvm.sh && nvm ls --no-colors 2>&1 | head -20 && nvm ls-remote --lts --no-colors 2>/dev/null | tail -5; echo \"--- homebrew node ---\"; brew list --versions 2>/dev/null | grep -iE '^node'; brew --prefix 2>/dev/null; echo \"--- latest node 24 ---\"; curl -s --max-time 15 https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt | head -2",
  "description": "Check available Node versions, version managers, and the latest Node 24 release",
  "timeout": 60000
}
```

### 2026-10-08T03:51:21.428Z · assistant

**Tool call: Bash**

```json
{
  "command": "echo \"--- cursor grill-me ---\"; ls -la ~/.cursor/skills/grill-me; echo \"--- SKILL.md ---\"; cat ~/.cursor/skills/grill-me/SKILL.md; echo; echo \"--- other cursor skills ---\"; ls ~/.cursor/skills; echo \"--- claude synced skills ---\"; ls -la ~/.claude/skills/synced 2>&1 | head; ls -la ~/.claude/plugins/synced 2>&1 | head",
  "description": "Read the Cursor grill-me skill and list other skills"
}
```

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

### 2026-10-08T03:51:27.062Z · user

**Tool result**

```
--- node binaries on PATH ---
/usr/local/Cellar/node@24/24.14.1_1/bin/node
/Users/tom/.nvm/versions/node/v18.20.4/bin/node
/usr/local/bin/node
/usr/local/Cellar/node@24/24.14.1_1/bin/node
/Users/tom/.nvm/versions/node/v18.20.4/bin/node
/usr/local/Cellar/node@24/24.14.1_1/bin/node
--- version managers ---
nvm: nvm
fnm: (not on PATH)
volta: (not on PATH)
mise: (not on PATH)
asdf: (not on PATH)
n: /usr/local/bin/n
ls: /Users/tom/.asdf: No such file or directory
ls: /Users/tom/.fnm: No such file or directory
ls: /Users/tom/.local/share/mise: No such file or directory
ls: /Users/tom/.volta: No such file or directory
/Users/tom/.nvm
--- shell rc mentions ---
/Users/tom/.zshrc:6:export NVM_DIR="$HOME/.nvm"
/Users/tom/.zshrc:7:[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
/Users/tom/.zshrc:8:[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
--- nvm (sourced) ---
->     v18.20.4 *
       v20.18.0 *
       v20.18.1 *
         system *
default -> 18 (-> v18.20.4 *)
iojs -> N/A (default)
node -> stable (-> v20.18.1 *) (default)
stable -> 20.18 (-> v20.18.1 *) (default)
unstable -> N/A (default)
lts/* -> lts/jod (-> N/A)
lts/argon -> v4.9.1 (-> N/A)
lts/boron -> v6.17.1 (-> N/A)
lts/carbon -> v8.17.0 (-> N/A)
lts/dubnium -> v10.24.1 (-> N/A)
lts/erbium -> v12.22.12 (-> N/A)
lts/fermium -> v14.21.3 (-> N/A)
lts/gallium -> v16.20.2 (-> N/A)
lts/hydrogen -> v18.20.5 (-> N/A)
lts/iron -> v20.18.1 *
lts/jod -> v22.11.0 (-> N/A)
       v24.18.0   (LTS: Krypton)
       v24.18.1   (LTS: Krypton)
       v24.19.0   (LTS: Krypton)
       v24.20.0   (LTS: Krypton)
       v24.21.0   (Latest LTS: Krypton)
--- homebrew node ---
node@24 24.14.1_1
/usr/local
--- latest node 24 ---
aec7b2464afb99f078c19cb06d201d543bd3b311cba071282bce1b17c97e58bb  node-v24.21.0-aix-ppc64.tar.gz
22ca85110f26015696a3fa9216bc372ae65203d170622eaf7d211e2dd5bb49e3  node-v24.21.0-arm64.msi
```

### 2026-10-08T03:51:27.155Z · user

**Tool result**

```
--- cursor grill-me ---
total 8
drwxr-xr-x@ 3 tom  staff   96 Apr  3  2026 .
drwxr-xr-x@ 3 tom  staff   96 Apr  3  2026 ..
-rw-r--r--@ 1 tom  staff  635 Apr  5  2026 SKILL.md
--- SKILL.md ---
---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

--- other cursor skills ---
grill-me
--- claude synced skills ---
total 0
drwxr-xr-x   4 tom  staff  128 Sep 16 15:25 .
drwxr-xr-x   3 tom  staff   96 Sep 16 15:25 ..
-rw-r--r--   1 tom  staff    0 Sep 16 15:25 .bucket-64359c2a-2cea-4ca7-b9c1-4fd964ab62fd_c06fa474-a7f3-4b11-9c6e-c17fde7084ca
drwxr-xr-x  17 tom  staff  544 Oct  7 23:48 64359c2a-2cea-4ca7-b9c1-4fd964ab62fd_c06fa474-a7f3-4b11-9c6e-c17fde7084ca
total 0
drwxr-xr-x  4 tom  staff  128 Sep 16 15:25 .
drwxr-xr-x  4 tom  staff  128 Oct  7 23:48 ..
-rw-r--r--  1 tom  staff    0 Sep 16 15:25 .bucket-64359c2a-2cea-4ca7-b9c1-4fd964ab62fd_c06fa474-a7f3-4b11-9c6e-c17fde7084ca
drwxr-xr-x  4 tom  staff  128 Oct  7 23:48 64359c2a-2cea-4ca7-b9c1-4fd964ab62fd_c06fa474-a7f3-4b11-9c6e-c17fde7084ca
```

- 2026-10-08T03:51:27.160Z · `attachment` record

- 2026-10-08T03:51:27.164Z · `attachment` record

### 2026-10-08T03:52:05.337Z · assistant

**Thinking**



### 2026-10-08T03:52:05.343Z · assistant

**Thinking**

Installing Node 24.21.0 via nvm for project use, and copying the Cursor grill-me skill into the expected path with its frontmatter name updated to "grill" — running both now in parallel.



### 2026-10-08T03:52:06.109Z · assistant

**Tool call: Bash**

```json
{
  "command": "export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm install 24.21.0 2>&1 | tail -5; echo \"--- verify ---\"; nvm use 24.21.0 >/dev/null && node --version && npm --version && echo \"default alias unchanged: $(nvm alias default 2>/dev/null | head -1)\"",
  "description": "Install Node 24.21.0 through nvm and verify it",
  "timeout": 300000
}
```

### 2026-10-08T03:52:08.425Z · assistant

**Tool call: Bash**

```json
{
  "command": "mkdir -p .claude/skills/grill && sed 's/^name: grill-me$/name: grill/' ~/.cursor/skills/grill-me/SKILL.md > .claude/skills/grill/SKILL.md && echo \"--- result ---\" && cat .claude/skills/grill/SKILL.md && echo && echo \"--- diff vs cursor original (expect only the name line) ---\" && diff ~/.cursor/skills/grill-me/SKILL.md .claude/skills/grill/SKILL.md; true",
  "description": "Copy the grill skill into the project with the name changed to grill"
}
```

### 2026-10-08T03:52:18.271Z · user

**Tool result**

```
Downloading https://nodejs.org/dist/v24.21.0/node-v24.21.0-darwin-x64.tar.xz...
                                                                           0.2%#                                                                          2.7%####                                                                       6.7%#####                                                                      8.0%###############                                                           21.0%###########################                                               37.8%####################################                                      50.5%####################################################                      72.7%###########################################################               82.3%##################################################################        92.1%######################################################################## 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v24.21.0 (npm v11.19.0)
--- verify ---
v24.21.0
11.19.0
default alias unchanged: default -> 18 (-> v18.20.4 *)
```

### 2026-10-08T03:52:18.350Z · user

**Tool result**

```
--- result ---
---
name: grill
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

--- diff vs cursor original (expect only the name line) ---
2c2
< name: grill-me
---
> name: grill
```

- 2026-10-08T03:52:18.354Z · `attachment` record

- 2026-10-08T03:52:18.357Z · `attachment` record

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

- 2026-10-08T03:52:24.112Z · `attachment` record

### 2026-10-08T03:52:24.112Z · assistant

**Thinking**



### 2026-10-08T03:52:24.114Z · assistant

Node 24.21.0 is in and the grill skill is in place. Now I'll confirm the Angular 22 `ng new` flags before scaffolding.

### 2026-10-08T03:52:26.778Z · assistant

**Tool call: Bash**

```json
{
  "command": "export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm use 24.21.0 >/dev/null; cd /private/tmp/claude-501/-Users-tom-park-finder/89b775c1-f4be-4150-8226-c47dfdd97844/scratchpad && npx -y -p @angular/cli@22.2.2 ng new --help 2>&1 | grep -vE '^\\s*$'",
  "description": "Print the Angular CLI 22.2.2 ng new options",
  "timeout": 120000
}
```

### 2026-10-08T03:52:30.579Z · user

**Tool result**

```
ng new [name]
Creates a new Angular workspace.
Arguments:
  name  The name for the new workspace and the initial project. This name will be used for the root directory and various identifiers throughout the project.  [string]
Options:
      --help                   Shows a help message for this command in the console.  [boolean]
      --interactive            Enable interactive input prompts.  [boolean] [default: true]
  -d, --dry-run                Run through and reports activity without writing out results.  [boolean] [default: false]
      --defaults               Disable interactive input prompts for options with a default.  [boolean] [default: false]
      --force                  Force overwriting of existing files.  [boolean] [default: false]
  -c, --collection             A collection of schematics to use in generating the initial application.  [string]
      --ai-config              Specifies which AI tools to generate configuration files for. These file are used to improve the outputs of AI tools by following the best practices.  [array] [choices: "claude-code", "cursor", "gemini-cli", "none", "open-ai-codex", "vscode"]
      --commit                 Configure the initial Git commit for the new repository.  [boolean] [default: true]
      --create-application     Create a new initial application project in the new workspace. When false, creates an empty workspace with no initial application. You can then use the `ng generate application` command to create applications in the `projects` directory.  [boolean] [default: true]
      --directory              The directory where the new workspace and project should be created. If not specified, the workspace will be created in the current directory.  [string]
      --file-name-style-guide  The file naming convention to use for generated files. The '2025' style guide (default) uses a concise format (e.g., `app.ts` for the root component), while the '2016' style guide includes the type in the file name (e.g., `app.component.ts`). For more information, see the Angular Style Guide (https://angular.dev/style-guide).  [string] [choices: "2016", "2025"] [default: "2025"]
  -s, --inline-style           Include the styles for the initial application's root component directly within the `app.ts` file. By default, a separate stylesheet file (e.g., `app.css`) is created.  [boolean]
  -t, --inline-template        Include the HTML template for the initial application's root component directly within the `app.ts` file. By default, a separate template file (e.g., `app.html`) is created.  [boolean]
      --minimal                Generate a minimal Angular workspace without any testing frameworks. This is intended for learning purposes and simple experimentation, not for production applications.  [boolean] [default: false]
      --new-project-root       The path where new projects will be created within the workspace, relative to the workspace root. By default, new projects are created in the `projects` directory.  [string] [default: "projects"]
      --package-manager        The package manager used to install dependencies.  [string] [choices: "bun", "npm", "pnpm", "yarn"]
  -p, --prefix                 The prefix to apply to generated selectors for the initial project. For example, if the prefix is `my-app` and you generate a component named `my-component`, the selector will be `my-app-my-component`.  [string] [default: "app"]
      --routing                Enable routing in the initial application project. This sets up the necessary files and modules for managing navigation between different views in your application.  [boolean]
  -g, --skip-git               Do not initialize a Git repository in the new workspace. By default, a Git repository is initialized to help you track changes to your project.  [boolean] [default: false]
      --skip-install           Skip the automatic installation of packages. You will need to manually install the dependencies later.  [boolean] [default: false]
  -S, --skip-tests             Skip the generation of unit test files `spec.ts`.  [boolean] [default: false]
      --ssr                    Configure the initial application for Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering).  [boolean]
      --standalone             Creates an application based upon the standalone API, without NgModules.  [boolean] [default: true]
      --strict                 Enable stricter type checking and stricter bundle budgets settings. This setting helps improve maintainability and catch bugs ahead of time. For more information, see https://angular.dev/tools/cli/template-typecheck#strict-mode  [boolean] [default: true]
      --style                  The type of stylesheet files to be created for components in the initial project.  [string] [choices: "css", "less", "sass", "scss", "tailwind"]
      --test-runner            The unit testing runner to use.  [string] [choices: "karma", "vitest"] [default: "vitest"]
      --view-encapsulation     Sets the view encapsulation mode for components in the initial project. This determines how component styles are scoped and applied. Options include: `Emulated` (default, styles are scoped to the component), `None` (styles are global), and `ShadowDom` (styles are encapsulated using Shadow DOM).  [string] [choices: "Emulated", "None", "ShadowDom"]
      --zoneless               Create an initial application that does not utilize `zone.js`.  [boolean]
Shell cwd was reset to /Users/tom/park-finder
```

- 2026-10-08T03:52:30.585Z · `attachment` record

- 2026-10-08T03:52:30.589Z · `attachment` record

### 2026-10-08T03:52:40.877Z · assistant

**Thinking**



### 2026-10-08T03:52:40.883Z · assistant

**Thinking**

Flags confirmed (`--test-runner vitest`, `--zoneless`, `--ai-config none` to preserve your CLAUDE.md). Scaffolding into the current folder now, skipping git and install so I can handle those myself.



### 2026-10-08T03:52:43.001Z · assistant

**Tool call: Bash**

```json
{
  "command": "export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm use 24.21.0 >/dev/null; cd /Users/tom/park-finder && echo \"--- checksums before ---\" && shasum CLAUDE.md public/assets/parks.sample.json docs/local-parks-candidate.pdf && npx -y -p @angular/cli@22.2.2 ng new park-finder --directory . --defaults --routing --style css --ssr false --zoneless --test-runner vitest --ai-config none --package-manager npm --skip-git --skip-install 2>&1 && echo \"--- checksums after ---\" && shasum CLAUDE.md public/assets/parks.sample.json docs/local-parks-candidate.pdf && echo \"--- tree ---\" && find . -not -path '*/node_modules*' -not -name '.DS_Store' | sort",
  "description": "Scaffold Angular 22 into the current folder and verify existing files are untouched",
  "timeout": 180000
}
```

### 2026-10-08T03:52:46.576Z · user

**Tool result**

```
--- checksums before ---
a9b4a18d339b821ae51b57e8bb7d6c184d120ab2  CLAUDE.md
d99fab7551d5dd5fbe76311861b67ee54fbef9f4  public/assets/parks.sample.json
4ebb95a162a136e8b9d98c0a9f7a34fce45ebbf3  docs/local-parks-candidate.pdf
CREATE .prettierrc (161 bytes)
CREATE README.md (1463 bytes)
CREATE .editorconfig (314 bytes)
CREATE .gitignore (622 bytes)
CREATE angular.json (1918 bytes)
CREATE package.json (787 bytes)
CREATE tsconfig.json (908 bytes)
CREATE .vscode/extensions.json (130 bytes)
CREATE .vscode/launch.json (470 bytes)
CREATE .vscode/tasks.json (978 bytes)
CREATE src/app/app.css (0 bytes)
CREATE src/app/app.spec.ts (685 bytes)
CREATE src/app/app.ts (294 bytes)
CREATE src/app/app.html (20144 bytes)
CREATE src/main.ts (222 bytes)
CREATE src/app/app.config.ts (312 bytes)
CREATE src/app/app.routes.ts (77 bytes)
CREATE tsconfig.app.json (398 bytes)
CREATE tsconfig.spec.json (409 bytes)
CREATE public/favicon.ico (15086 bytes)
CREATE src/index.html (296 bytes)
CREATE src/styles.css (80 bytes)
--- checksums after ---
a9b4a18d339b821ae51b57e8bb7d6c184d120ab2  CLAUDE.md
d99fab7551d5dd5fbe76311861b67ee54fbef9f4  public/assets/parks.sample.json
4ebb95a162a136e8b9d98c0a9f7a34fce45ebbf3  docs/local-parks-candidate.pdf
--- tree ---
.
./.claude
./.claude/skills
./.claude/skills/grill
./.claude/skills/grill/SKILL.md
./.editorconfig
./.gitignore
./.prettierrc
./.vscode
./.vscode/extensions.json
./.vscode/launch.json
./.vscode/tasks.json
./CLAUDE.md
./README.md
./angular.json
./docs
./docs/local-parks-candidate.pdf
./package.json
./public
./public/assets
./public/assets/parks.sample.json
./public/favicon.ico
./src
./src/app
./src/app/app.config.ts
./src/app/app.css
./src/app/app.html
./src/app/app.routes.ts
./src/app/app.spec.ts
./src/app/app.ts
./src/index.html
./src/main.ts
./src/styles.css
./tsconfig.app.json
./tsconfig.json
./tsconfig.spec.json
```

- 2026-10-08T03:52:46.581Z · `attachment` record

- 2026-10-08T03:52:46.585Z · `attachment` record

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

### 2026-10-08T03:52:57.487Z · assistant

**Thinking**



### 2026-10-08T03:52:57.492Z · assistant

**Thinking**

The scaffold is in place and matches the pre-existing files exactly. Now I'll install dependencies and Leaflet, while also reviewing the generated config to wire up Leaflet's CSS and verify the Vitest and zoneless setup.



### 2026-10-08T03:52:58.928Z · assistant

**Tool call: Bash**

```json
{
  "command": "export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm use 24.21.0 >/dev/null; cd /Users/tom/park-finder && npm install leaflet@1.9.4 2>&1 | grep -vE 'EBADENGINE|^\\s*$' | tail -8 && echo \"--- types ---\" && npm install -D @types/leaflet@1.9.22 2>&1 | grep -vE 'EBADENGINE|^\\s*$' | tail -5 && echo \"--- installed ---\" && npm ls leaflet @types/leaflet vitest jsdom @angular/core @angular/cli @angular/build 2>&1 | head -20",
  "description": "Install project dependencies, Leaflet, and Leaflet types",
  "timeout": 600000
}
```

### 2026-10-08T03:53:01.306Z · assistant

**Tool call: Bash**

```json
{
  "command": "for f in package.json angular.json .prettierrc .gitignore .editorconfig src/styles.css src/app/app.config.ts src/main.ts src/app/app.routes.ts src/app/app.ts src/app/app.spec.ts src/index.html tsconfig.json tsconfig.spec.json; do echo \"===== $f =====\"; cat \"$f\"; echo; done; echo \"===== app.html (size and first 15 lines) =====\"; wc -c src/app/app.html; head -15 src/app/app.html",
  "description": "Show the generated Angular config and source files"
}
```

### 2026-10-08T03:53:28.128Z · user

**Tool result**

```
found 0 vulnerabilities
npm warn install-scripts 4 packages have install scripts not yet covered by allowScripts:
npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)
npm warn install-scripts   esbuild@0.28.2 (postinstall: node install.js)
npm warn install-scripts   lmdb@3.5.6 (install: node-gyp-build-optional-packages)
npm warn install-scripts   msgpackr-extract@3.0.4 (install: node-gyp-build-optional-packages)
npm warn install-scripts
npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.
--- types ---
npm warn install-scripts   fsevents@2.3.3 (install: (install scripts present))
npm warn install-scripts   lmdb@3.5.6 (install: node-gyp rebuild)
npm warn install-scripts   msgpackr-extract@3.0.4 (install: node-gyp rebuild)
npm warn install-scripts
npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.
--- installed ---
park-finder@0.0.0 /Users/tom/park-finder
├─┬ @angular/build@22.2.2
│ ├── @angular/core@22.2.1 deduped
│ └── vitest@5.0.3 deduped
├── @angular/cli@22.2.2
├─┬ @angular/common@22.2.1
│ └── @angular/core@22.2.1 deduped
├── @angular/core@22.2.1
├─┬ @angular/forms@22.2.1
│ └── @angular/core@22.2.1 deduped
├─┬ @angular/platform-browser@22.2.1
│ └── @angular/core@22.2.1 deduped
├─┬ @angular/router@22.2.1
│ └── @angular/core@22.2.1 deduped
├── @types/leaflet@1.9.22
├── jsdom@30.1.2
├── leaflet@1.9.4
└─┬ vitest@5.0.3
  └── jsdom@30.1.2 deduped
```

### 2026-10-08T03:53:28.239Z · user

**Tool result**

```
===== package.json =====
{
  "name": "park-finder",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "packageManager": "npm@11.19.0",
  "dependencies": {
    "@angular/common": "^22.2.0",
    "@angular/compiler": "^22.2.0",
    "@angular/core": "^22.2.0",
    "@angular/forms": "^22.2.0",
    "@angular/platform-browser": "^22.2.0",
    "@angular/router": "^22.2.0",
    "leaflet": "^1.9.4",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
  },
  "devDependencies": {
    "@angular/build": "^22.2.2",
    "@angular/cli": "^22.2.2",
    "@angular/compiler-cli": "^22.2.0",
    "@types/leaflet": "^1.9.22",
    "jsdom": "^30.0.0",
    "prettier": "^3.8.1",
    "typescript": "~6.0.2",
    "vitest": "^5.0.0"
  }
}

===== angular.json =====
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "packageManager": "npm"
  },
  "newProjectRoot": "projects",
  "projects": {
    "park-finder": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "browser": "src/main.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": [
              "src/styles.css"
            ]
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "4kB",
                  "maximumError": "8kB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "park-finder:build:production"
            },
            "development": {
              "buildTarget": "park-finder:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "test": {
          "builder": "@angular/build:unit-test"
        }
      }
    }
  }
}

===== .prettierrc =====
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}

===== .gitignore =====
# See https://docs.github.com/get-started/getting-started-with-git/ignoring-files for more about ignoring files.

# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Node
/node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/mcp.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings
__screenshots__/

# System files
.DS_Store
Thumbs.db

===== .editorconfig =====
# Editor configuration, see https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.ts]
quote_type = single
ij_typescript_use_double_quotes = false

[*.md]
max_line_length = off
trim_trailing_whitespace = false

===== src/styles.css =====
/* You can add global styles to this file, and also import other style files */

===== src/app/app.config.ts =====
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};

===== src/main.ts =====
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

===== src/app/app.routes.ts =====
import { Routes } from '@angular/router';

export const routes: Routes = [];

===== src/app/app.ts =====
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('park-finder');
}

===== src/app/app.spec.ts =====
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, park-finder');
  });
});

===== src/index.html =====
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>ParkFinder</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>

===== tsconfig.json =====
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "compileOnSave": false,
  "compilerOptions": {
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "preserve"
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true
  },
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ]
}

===== tsconfig.spec.json =====
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": [
      "vitest/globals"
    ]
  },
  "include": [
    "src/**/*.d.ts",
    "src/**/*.spec.ts"
  ]
}

===== app.html (size and first 15 lines) =====
   20144 src/app/app.html
<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
<!-- * * * * * * * * * * * The content below * * * * * * * * * * * -->
<!-- * * * * * * * * * * is only a placeholder * * * * * * * * * * -->
<!-- * * * * * * * * * * and can be replaced.  * * * * * * * * * * -->
<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
<!-- * * * * * * * * * Delete the template below * * * * * * * * * -->
<!-- * * * * * * * to get started with your project! * * * * * * * -->
<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

<style>
  :host {
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
```

- 2026-10-08T03:53:28.243Z · `attachment` record

- 2026-10-08T03:53:28.245Z · `attachment` record

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

- 2026-10-08T03:54:34.393Z · `attachment` record

### 2026-10-08T03:54:34.393Z · assistant

**Thinking**



### 2026-10-08T03:54:34.400Z · assistant

**Thinking**

The scaffold uses Vitest, is zoneless, and already has Prettier and `.gitignore` set up. Next I'll add Leaflet's CSS to angular.json, create the app folders with `.gitkeep`, add `.nvmrc` and the settings ignore line, then run a production build, the Vitest suite, and a Prettier check.



### 2026-10-08T03:54:40.110Z · assistant

**Tool call: Bash**

```json
{
  "command": "export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm use 24.21.0 >/dev/null; cd /Users/tom/park-finder && set -e\necho \"=== 1. angular.json styles ===\"\nnode -e '\nconst fs=require(\"fs\");const p=\"angular.json\";const j=JSON.parse(fs.readFileSync(p,\"utf8\"));\nconst o=j.projects[\"park-finder\"].architect.build.options;\no.styles=[\"node_modules/leaflet/dist/leaflet.css\",\"src/styles.css\"];\nfs.writeFileSync(p,JSON.stringify(j,null,2)+\"\\n\");'\ngrep -n -A4 '\"styles\"' angular.json\necho \"=== 2. folders ===\"\nfor d in data map panel; do mkdir -p \"src/app/$d\" && touch \"src/app/$d/.gitkeep\"; done\nfind src/app -type d | sort; find src/app -name .gitkeep\necho \"=== 3. .nvmrc and .gitignore ===\"\nprintf '24.21.0\\n' > .nvmrc\nprintf '\\n# Claude Code local settings\\n.claude/settings.local.json\\n' >> .gitignore\ncat .nvmrc; tail -4 .gitignore\necho \"=== 4. unit-test builder options ===\"\nnode -e 'console.log(Object.keys(require(\"./node_modules/@angular/build/src/builders/unit-test/schema.json\").properties).join(\", \"))'\nset +e\necho \"=== 5. production build ===\"\nnpx ng build 2>&1 | grep -vE 'EBADENGINE' | tail -22\necho \"--- dist contents ---\"; ls -la dist/park-finder/browser/ dist/park-finder/browser/assets/ 2>&1\necho \"--- leaflet css present in styles bundle? ---\"; grep -l 'leaflet-container' dist/park-finder/browser/styles-*.css && echo \"YES: leaflet css bundled\"\necho \"=== 6. vitest ===\"\nnpx ng test --watch=false 2>&1 | grep -vE 'EBADENGINE' | tail -25\necho \"=== 7. prettier --check ===\"\nnpx prettier --check . 2>&1 | tail -40",
  "description": "Wire Leaflet CSS, create folders, add .nvmrc, then build, test, and prettier-check",
  "timeout": 420000
}
```

### 2026-10-08T03:54:53.536Z · user

**Tool result**

```
=== 1. angular.json styles ===
27:            "styles": [
28-              "node_modules/leaflet/dist/leaflet.css",
29-              "src/styles.css"
30-            ]
31-          },
=== 2. folders ===
src/app
src/app/data
src/app/map
src/app/panel
src/app/panel/.gitkeep
src/app/map/.gitkeep
src/app/data/.gitkeep
=== 3. .nvmrc and .gitignore ===
24.21.0
Thumbs.db

# Claude Code local settings
.claude/settings.local.json
=== 4. unit-test builder options ===
buildTarget, tsConfig, runner, runnerConfig, browsers, browserViewport, include, exclude, filter, watch, headless, debug, ui, isolate, splitting, quiet, coverage, coverageInclude, coverageExclude, coverageReporters, coverageThresholds, coverageWatermarks, reporters, outputFile, providersFile, setupFiles, progress, listTests, dumpVirtualFiles
=== 5. production build ===
❯ Building...
✔ Building...
Initial chunk files | Names         |  Raw size | Estimated transfer size
main-ZHF54JWB.js    | main          | 216.47 kB |                59.40 kB
styles-OPSORIUJ.css | styles        |  11.07 kB |                 2.32 kB

                    | Initial total | 227.54 kB |                61.72 kB

Application bundle generation complete. [2.517 seconds] - 2026-10-08T03:54:45.810Z

Output location: /Users/tom/park-finder/dist/park-finder

--- dist contents ---
dist/park-finder/browser/:
total 488
drwxr-xr-x  8 tom  staff     256 Oct  7 23:54 .
drwxr-xr-x  4 tom  staff     128 Oct  7 23:54 ..
drwxr-xr-x  3 tom  staff      96 Oct  7 23:54 assets
-rw-r--r--  1 tom  staff   15086 Oct  7 23:52 favicon.ico
-rw-r--r--  1 tom  staff     715 Oct  7 23:54 index.html
-rw-r--r--  1 tom  staff  216466 Oct  7 23:54 main-ZHF54JWB.js
drwxr-xr-x  5 tom  staff     160 Oct  7 23:54 media
-rw-r--r--  1 tom  staff   11072 Oct  7 23:54 styles-OPSORIUJ.css

dist/park-finder/browser/assets/:
total 16
drwxr-xr-x  3 tom  staff    96 Oct  7 23:54 .
drwxr-xr-x  8 tom  staff   256 Oct  7 23:54 ..
-rw-r--r--  1 tom  staff  5910 Oct  7 19:54 parks.sample.json
--- leaflet css present in styles bundle? ---
dist/park-finder/browser/styles-OPSORIUJ.css
YES: leaflet css bundled
=== 6. vitest ===
❯ Building...
✔ Building...
Application bundle generation complete. [1.267 seconds] - 2026-10-08T03:54:48.704Z


[1m[30m[46m RUN [49m[39m[22m [36mv5.0.3 [39m[90m/Users/tom/park-finder[39m


[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m   Start at [22m 23:54:50
[2m   Duration [22m 1.55s[2m (environment 70%, setup 16%, tests 6%, transform 4%, import 3%, worker 1%)[22m

=== 7. prettier --check ===
Checking formatting...
[warn] angular.json
[warn] CLAUDE.md
[warn] public/assets/parks.sample.json
[warn] src/app/app.config.ts
[warn] src/app/app.html
[warn] src/app/app.spec.ts
[warn] src/index.html
[warn] src/main.ts
[warn] tsconfig.app.json
[warn] tsconfig.spec.json
[warn] Code style issues found in 10 files. Run Prettier with --write to fix.
```

- 2026-10-08T03:54:53.541Z · `attachment` record

- 2026-10-08T03:54:53.544Z · `attachment` record

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

### 2026-10-08T03:55:24.060Z · assistant

**Thinking**



### 2026-10-08T03:55:24.067Z · assistant

**Thinking**

Build and tests pass, with Leaflet CSS bundled correctly. I'll add a `.prettierignore` to preserve CLAUDE.md and parks.sample.json, format the remaining files, re-run tests, then init git, set a repo-local identity, commit, and push.



### 2026-10-08T03:55:33.874Z · assistant

**Tool call: Bash**

```json
{
  "command": "export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm use 24.21.0 >/dev/null; cd /Users/tom/park-finder\necho \"=== what prettier would change in the two source documents (for the record) ===\"\nnpx prettier CLAUDE.md | diff CLAUDE.md - | head -8 || true\nnpx prettier public/assets/parks.sample.json | diff public/assets/parks.sample.json - | head -8 || true\nset -e\necho \"=== .prettierignore ===\"\nprintf '# Source documents stay byte-identical to what was supplied\\npublic/assets/parks.sample.json\\nCLAUDE.md\\ndocs/\\n' > .prettierignore\ncat .prettierignore\necho \"=== prettier --write ===\"\nnpx prettier --write . 2>&1 | grep -v unchanged\nnpx prettier --check . 2>&1 | tail -2\necho \"=== re-run tests after formatting ===\"\nnpx ng test --watch=false 2>&1 | grep -E 'Test Files|Tests |failed|error' \necho \"=== git init + identity (repo-local only) ===\"\ngit init -b main\ngit config user.name \"Tom Driver\"\ngit config user.email \"thomas.andrew.driver@gmail.com\"\ngit add -A\necho \"--- tracked files ---\"\ngit status --short\necho \"--- sanity: nothing from node_modules/dist/.angular/.DS_Store staged ---\"\ngit diff --cached --name-only | grep -E 'node_modules|^dist/|\\.angular|\\.DS_Store' && { echo \"UNEXPECTED FILES STAGED\"; exit 1; } || echo \"clean\"\necho \"=== commit ===\"\ngit commit -q -F - <<'EOF'\nchore: scaffold Angular 22 app with Leaflet and Vitest\n\n- ng new with routing, CSS, zoneless, Vitest, no SSR\n- leaflet 1.9.4 and @types/leaflet; Leaflet CSS in the global styles array\n- folders src/app/data, src/app/map, src/app/panel\n- sample data at public/assets/parks.sample.json, brief in docs/\n- .nvmrc pins Node 24.21.0 (Angular 22.2 needs >= 24.15)\n- grill skill at .claude/skills/grill/SKILL.md\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\nEOF\ngit log --oneline -1 && git log -1 --format='author: %an <%ae>'\necho \"=== remote + push ===\"\ngit remote add origin https://github.com/tomdriver123/park-finder.git\ngit -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -u origin main 2>&1 | tail -5\necho \"=== verify on GitHub ===\"\ngh repo view tomdriver123/park-finder --json defaultBranchRef,isPrivate,url --jq '{branch: .defaultBranchRef.name, private: .isPrivate, url: .url}'\ngh api repos/tomdriver123/park-finder/commits/main --jq '{sha: .sha[0:7], message: .commit.message | split(\"\\n\")[0], files: (.files | length)}'\ngit status --short --branch",
  "description": "Format with Prettier, re-test, init git with local identity, commit, and push to GitHub",
  "timeout": 300000
}
```

### 2026-10-08T03:55:47.196Z · user

**Tool result**

```
=== what prettier would change in the two source documents (for the record) ===
5a6
> 
8a10
> 
11a14
> 
14a18
> 
7c7,15
<     "amenities": ["playground", "dog-run", "trails", "restrooms", "parking", "lake", "picnic-areas"],
---
>     "amenities": [
>       "playground",
>       "dog-run",
>       "trails",
>       "restrooms",
=== .prettierignore ===
# Source documents stay byte-identical to what was supplied
public/assets/parks.sample.json
CLAUDE.md
docs/
=== prettier --write ===
angular.json 4ms
src/app/app.config.ts 38ms
src/app/app.html 114ms
src/app/app.spec.ts 12ms
src/index.html 3ms
src/main.ts 3ms
tsconfig.app.json 2ms
tsconfig.spec.json 1ms
Checking formatting...
All matched files use Prettier code style!
=== re-run tests after formatting ===
[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m2 passed[39m[22m[90m (2)[39m
=== git init + identity (repo-local only) ===
Initialized empty Git repository in /Users/tom/park-finder/.git/
--- tracked files ---
A  .claude/skills/grill/SKILL.md
A  .editorconfig
A  .gitignore
A  .nvmrc
A  .prettierignore
A  .prettierrc
A  .vscode/extensions.json
A  .vscode/launch.json
A  .vscode/tasks.json
A  CLAUDE.md
A  README.md
A  angular.json
A  docs/local-parks-candidate.pdf
A  package-lock.json
A  package.json
A  public/assets/parks.sample.json
A  public/favicon.ico
A  src/app/app.config.ts
A  src/app/app.css
A  src/app/app.html
A  src/app/app.routes.ts
A  src/app/app.spec.ts
A  src/app/app.ts
A  src/app/data/.gitkeep
A  src/app/map/.gitkeep
A  src/app/panel/.gitkeep
A  src/index.html
A  src/main.ts
A  src/styles.css
A  tsconfig.app.json
A  tsconfig.json
A  tsconfig.spec.json
--- sanity: nothing from node_modules/dist/.angular/.DS_Store staged ---
clean
=== commit ===
ad8dcb5 chore: scaffold Angular 22 app with Leaflet and Vitest
author: Tom Driver <thomas.andrew.driver@gmail.com>
=== remote + push ===
To https://github.com/tomdriver123/park-finder.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
=== verify on GitHub ===
{"branch":"main","private":true,"url":"https://github.com/tomdriver123/park-finder"}
{"files":32,"message":"chore: scaffold Angular 22 app with Leaflet and Vitest","sha":"ad8dcb5"}
## main...origin/main
```

- 2026-10-08T03:55:47.201Z · `attachment` record

- 2026-10-08T03:55:47.204Z · `attachment` record

### 2026-10-08T03:56:52.639Z · assistant

**Thinking**



### 2026-10-08T03:56:52.722Z · assistant

**Thinking**

Verified: commit ad8dcb5 is on main with 32 files, the tree is clean, and build/tests pass after formatting. Now I'll save two environment facts to memory so future sessions avoid the Node and credential issues before writing things up.



### 2026-10-08T03:56:52.725Z · assistant

**Tool call: Bash**

```json
{
  "command": "ls -la /Users/tom/.claude/projects/-Users-tom-park-finder/memory/ 2>&1; echo \"--- MEMORY.md ---\"; cat /Users/tom/.claude/projects/-Users-tom-park-finder/memory/MEMORY.md 2>&1",
  "description": "List existing memory files and the memory index"
}
```

### 2026-10-08T03:56:52.792Z · user

**Tool result** (error)

```
Exit code 1
total 0
drwxr-xr-x  2 tom  staff   64 Oct  7 23:45 .
drwxr-xr-x  4 tom  staff  128 Oct  7 23:45 ..
--- MEMORY.md ---
cat: /Users/tom/.claude/projects/-Users-tom-park-finder/memory/MEMORY.md: No such file or directory
```

- 2026-10-08T03:56:52.798Z · `attachment` record

- 2026-10-08T03:56:52.799Z · `attachment` record

- 2026-10-08T03:56:52.802Z · `attachment` record

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

### 2026-10-08T03:57:03.648Z · assistant

**Thinking**



### 2026-10-08T03:57:03.649Z · assistant

Saving memory now, then the write-up.

### 2026-10-08T03:57:21.581Z · assistant

**Tool call: Bash**

```json
{
  "command": "M=/Users/tom/.claude/projects/-Users-tom-park-finder/memory\ncat > \"$M/node-24-via-nvm-for-angular-22.md\" <<'EOF'\n---\nname: node-24-via-nvm-for-angular-22\ndescription: Angular 22.2 CLI refuses the Homebrew Node 24.14.1 on PATH; run every project command through nvm Node 24.21.0 (.nvmrc) and never the global ng v18\nmetadata:\n  type: project\n---\n\nAngular CLI 22.2 hard-fails on Node < 24.15.0. The tool shell's first `node` is Homebrew 24.14.1 and nvm is not auto-sourced there; the nvm default alias is 18. Node 24.21.0 was installed via nvm on 2026-10-07 and `.nvmrc` pins it. A global `ng` v18.2 also sits on PATH.\n\n**Why:** Without sourcing nvm, `ng build`/`ng test`/`npx @angular/cli` abort with a Node version error, and bare `ng` runs the wrong major.\n\n**How to apply:** Prefix Bash commands with `export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm use 24.21.0 >/dev/null;` and use `npx ng` or `npm run`, never bare `ng`. See [[github-push-via-gh-credential]] for the git side.\nEOF\ncat > \"$M/github-push-via-gh-credential.md\" <<'EOF'\n---\nname: github-push-via-gh-credential\ndescription: No git identity or GitHub credential helper is configured globally; park-finder uses a repo-local identity and pushes with a one-off gh credential helper\nmetadata:\n  type: project\n---\n\nGit has no user.name/user.email at any scope and only the osxkeychain helper. For park-finder, identity is set repo-locally (Tom Driver, thomas.andrew.driver@gmail.com) and the remote is https://github.com/tomdriver123/park-finder.git (private, default branch main). gh is logged in as tomdriver123.\n\n**Why:** A plain `git push` may prompt for credentials that are not stored; `gh auth git-credential` works without changing global config.\n\n**How to apply:** Push with `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push`. Commit only when Tom says so (CLAUDE.md working agreement); the first scaffold commit was an explicit exception. See [[node-24-via-nvm-for-angular-22]].\nEOF\ncat > \"$M/grill-skill-and-plan-md-workflow.md\" <<'EOF'\n---\nname: grill-skill-and-plan-md-workflow\ndescription: Tom plans slices by running the grill skill (copied from ~/.cursor/skills/grill-me) and expects the outcome in PLAN.md, which CLAUDE.md references but did not exist as of 2026-10-07\nmetadata:\n  type: project\n---\n\nThe project skill at .claude/skills/grill/SKILL.md is a copy of Tom's Cursor skill `grill-me` (only the frontmatter name changed). It interviews Tom one question at a time with a recommended answer per question, exploring the codebase instead of asking when possible. CLAUDE.md says to read PLAN.md every session and that optional brief items are in scope only if PLAN.md lists them; PLAN.md had not been written as of 2026-10-07.\n\n**Why:** The skill was not in the loaded skill list the session it was copied; it may need a restart to register, but the file can be read and followed directly.\n\n**How to apply:** When Tom says \"grill me\" or invokes /grill, follow that SKILL.md. Treat the data-hole decisions (hours, missing name/id/coordinates, broken image URLs, amenities display, image alt text) as the open questions to grill on before writing PLAN.md.\nEOF\ncat > \"$M/MEMORY.md\" <<'EOF'\n- [Node 24 via nvm for Angular 22](node-24-via-nvm-for-angular-22.md) — source nvm and use 24.21.0 in every command; never the global ng v18\n- [GitHub push via gh credential](github-push-via-gh-credential.md) — repo-local git identity, push with the gh credential helper flags\n- [Grill skill and PLAN.md workflow](grill-skill-and-plan-md-workflow.md) — grill skill copied from Cursor; PLAN.md still to be written from the data-hole decisions\nEOF\nls -la \"$M\"",
  "description": "Write three memory files and the memory index"
}
```

### 2026-10-08T03:57:21.690Z · user

**Tool result**

```
total 32
drwxr-xr-x  6 tom  staff   192 Oct  7 23:57 .
drwxr-xr-x  4 tom  staff   128 Oct  7 23:45 ..
-rw-r--r--  1 tom  staff   448 Oct  7 23:57 MEMORY.md
-rw-r--r--  1 tom  staff   941 Oct  7 23:57 github-push-via-gh-credential.md
-rw-r--r--  1 tom  staff  1127 Oct  7 23:57 grill-skill-and-plan-md-workflow.md
-rw-r--r--  1 tom  staff   874 Oct  7 23:57 node-24-via-nvm-for-angular-22.md
```

- 2026-10-08T03:57:21.694Z · `attachment` record

- 2026-10-08T03:57:21.697Z · `attachment` record

### 2026-10-08T03:58:14.904Z · assistant

**Thinking**



### 2026-10-08T03:58:28.360Z · assistant

Scaffold is done and pushed. Commit ad8dcb5 is the first commit on main in your private park-finder repo, with 32 files and a clean working tree. The production build and the two scaffold Vitest tests pass, Leaflet's CSS is in the styles bundle, and the sample JSON is served at /assets/parks.sample.json. No app code was written.

Two things were not as described:

- **The grill skill did not exist** in this project or anywhere under `~/.claude`. I found your Cursor skill named grill-me and copied it to [.claude/skills/grill/SKILL.md](.claude/skills/grill/SKILL.md), changing only the frontmatter name to grill. It is not in my loaded skill list this session, so `/grill` may need a restart to register. I can read and follow the file directly either way.
- **Node was too old.** Angular 22.2 refuses Node 24.14.1, and your nvm default is 18. I installed Node 24.21.0 through nvm without touching your default alias and added [.nvmrc](.nvmrc). Run `nvm use` in this folder, and use `npx ng` rather than the global ng, which is v18.

## Decisions to confirm

- Leaflet's CSS went into the `styles` array in [angular.json](angular.json) rather than an import in [styles.css](src/styles.css), so the global stylesheet stays limited to tokens, focus ring, and reduced motion as CLAUDE.md requires.
- The scaffold ships a [.prettierrc](.prettierrc) with single quotes and width 100, which is not "Prettier defaults". I kept it because `ng generate` output follows it. Say so and I'll delete it and reformat.
- I added [.prettierignore](.prettierignore) so Prettier never rewrites [CLAUDE.md](CLAUDE.md) or [parks.sample.json](public/assets/parks.sample.json). Both are byte-identical to what you gave me.
- Git had no identity at any scope, so I set "Tom Driver" and your Gmail address on this repo only. Correct the name with `git config user.name` if it's wrong.
- The commit includes the grill skill, the generated README, and [.vscode/](.vscode/). PLAN.md does not exist yet, though CLAUDE.md asks me to read it every session.

## Data holes

"Sample" means the hole is in the file. "Brief" means the brief's missing-or-null clause allows it but the sample does not contain it.

| # | Hole | Where | CLAUDE.md says | Verdict |
|---|---|---|---|---|
| 1 | description is null | Sample: old-mill-botanical-garden | Show "No description available." | Covered |
| 2 | location.address key absent | Sample: highland-dog-park | Show coordinates | Covered. Format unstated; I'd show "40.6789, -73.9442" |
| 3 | images is [] | Sample: cedar-hill-nature-preserve, east-ridge-trailhead | Show a placeholder | Covered |
| 4 | rating is null | Sample: cedar-hill-nature-preserve | Hide the rating row | Covered. Needs a null check so a rating of 0 still shows |
| 5 | Every image URL is on images.example.com and will never load | Sample: all 10 parks that have images | Only covers empty arrays | Gap. Recommend real src with a swap to the placeholder on the img error event. Your call |
| 6 | Street-only addresses with no city or zip, such as "Shore Pkwy" or "44th St & 7th Ave" | Sample: 8 of the 11 addresses | Never invent values | Covered: show verbatim, never append a city |
| 7 | hours is free text in three shapes: "6:00 AM - 1:00 AM", "Dawn to dusk", "24 hours" | Sample: all | No hours rule at all | Gap. Show verbatim and never parse. For missing hours, recommend hiding the row like rating |
| 8 | name missing, null, or "" | Brief | No rule, and inventing a name is forbidden | Gap. Recommend falling back to the id text. Affects the list label, the heading, and marker alt |
| 9 | id missing, null, or duplicated | Brief | No rule | Gap. id drives the route, @for track, and focus return. Recommend normalize drops the row and the service counts drops |
| 10 | location missing, or lat/lng null, non-numeric, or out of range | Brief | No rule, and rule 2 assumes coordinates exist | Gap. Recommend keeping the park in list and details with "Location not available", no marker, map bounds from the rest. Leaflet throws on NaN |
| 11 | amenities missing, null, [], or entries that are null or "" | Brief | No rule | Gap. Recommend hiding the section when empty. Also decide whether slugs like "dog-run" show raw or humanized |
| 12 | images null, or containing null or "" entries | Brief | "Missing, null, or empty arrays" plus rule 3 | Covered if normalize coalesces to [] and filters bad entries |
| 13 | acreage missing or null | Brief | No rule; the brief does not list acreage among the details | Gap. Recommend hiding the row, with the unit "acres" when shown |
| 14 | Wrong types, such as rating "4.7" as a string or amenities as a string | Brief | Never invent values | Gap, small. Recommend treating a wrong-typed field as missing rather than coercing |
| 15 | Empty or whitespace strings for description, address, hours | Brief | Lists missing, null, and empty arrays but not empty strings | Gap, small. Recommend trim and treat "" as missing |
| 16 | Fetch fails, malformed JSON, or top level is not an array | Brief | ParksService exposes loading and error signals | Covered. An empty array has no rule; recommend "No parks to show" |
| 17 | Unknown id in the URL | CLAUDE.md URL path | No rule | Gap. Recommend "Park not found" with a link back to the list |
| 18 | No alt text or captions for any image | Sample: all | Alt and title for markers only | Gap. Recommend alt like "Photo 1 of 2, Prospect Park", or decorative alt "". Your call |
| 19 | Rating scale not stated; the sample max is 4.9 | Sample | Nothing on display format | Gap, small. Showing "4.7 / 5" asserts a scale. Recommend the bare number |
| 20 | cedar-hill-nature-preserve sits at 40.7128, -74.006, the generic New York City point, for a woodland preserve | Sample | Not actionable | Data quality note for the README only |

Rows 5, 7, 8, 9, 10, 11, and 18 are the questions to grill on before PLAN.md exists. The rest I would apply as recommended.

### 2026-10-08T03:58:28.400Z · system (stop_hook_summary)

```json
{
  "parentUuid": "a68e3c7e-cecd-47ef-9c74-afc54bc82c21",
  "isSidechain": false,
  "type": "system",
  "subtype": "stop_hook_summary",
  "hookCount": 1,
  "hookInfos": [
    {
      "command": "bash ~/.claude/hooks/stop-episodic-append.sh",
      "durationMs": 14
    }
  ],
  "hookErrors": [],
  "hookAdditionalContext": [],
  "preventedContinuation": false,
  "stopReason": "",
  "hasOutput": false,
  "level": "suggestion",
  "timestamp": "2026-10-08T03:58:28.400Z",
  "uuid": "d11a9129-4353-44fa-962e-26b2bb409bef",
  "toolUseID": "546df0ed-1100-4238-a57c-c9e621d238cf",
  "userType": "external",
  "entrypoint": "claude-vscode",
  "cwd": "/Users/tom/park-finder",
  "sessionId": "89b775c1-f4be-4150-8226-c47dfdd97844",
  "version": "2.1.289",
  "gitBranch": "HEAD",
  "slug": "snoopy-whistling-cerf"
}
```

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

- 2026-10-08T04:18:36.612Z · `queue-operation` record

- 2026-10-08T04:18:36.619Z · `queue-operation` record

### 2026-10-08T04:18:36.636Z · user

Change the grill skill to this:
---
name: grill
description: Interview me about a plan until we share an understanding. Use before any implementation.
---

"Interview me about the plan until we reach a shared understanding. Treat it as a design tree. Ask every question whose prerequisites are settled in one numbered round, give your recommended answer for each, and word each question so 'yes' accepts your recommendation. Look up facts yourself, only decisions come to me. Wait for my answers before the next round. Stop when nothing is silently assumed, and do not build until I confirm."

then create a skill called handoff:
"Create a structured handoff file that lets a fresh agent (or future you) pick up exactly where this session left off, with zero ambiguity and no wasted re-exploration."

- 2026-10-08T04:18:36.635Z · `attachment` record

-  · `file-history-snapshot` record

- 2026-10-08T04:18:36.650Z · `attachment` record

### 2026-10-08T04:19:11.933Z · assistant

**Thinking**



### 2026-10-08T04:19:12.467Z · assistant

I'll replace the grill skill body with your text, create the handoff skill next to it, and leave both uncommitted so you can review the diff first.

### 2026-10-08T04:19:18.265Z · assistant

**Tool call: Bash**

```json
{
  "command": "cat > .claude/skills/grill/SKILL.md <<'EOF'\n---\nname: grill\ndescription: Interview me about a plan until we share an understanding. Use before any implementation.\n---\n\nInterview me about the plan until we reach a shared understanding. Treat it as a design tree. Ask every question whose prerequisites are settled in one numbered round, give your recommended answer for each, and word each question so 'yes' accepts your recommendation. Look up facts yourself, only decisions come to me. Wait for my answers before the next round. Stop when nothing is silently assumed, and do not build until I confirm.\nEOF\nmkdir -p .claude/skills/handoff && cat > .claude/skills/handoff/SKILL.md <<'EOF'\n---\nname: handoff\ndescription: Write a structured handoff file so a fresh agent or a future session can resume exactly where this one left off. Use when a session is ending, context is running low, or the user says \"handoff\".\n---\n\nCreate a structured handoff file that lets a fresh agent (or future you) pick up exactly where this session left off, with zero ambiguity and no wasted re-exploration.\nEOF\necho \"=== grill ===\"; cat .claude/skills/grill/SKILL.md\necho; echo \"=== handoff ===\"; cat .claude/skills/handoff/SKILL.md\necho; echo \"=== prettier check on both ===\"; npx prettier --check .claude/skills/grill/SKILL.md .claude/skills/handoff/SKILL.md 2>&1 | tail -2\necho; echo \"=== git status ===\"; git status --short\necho; echo \"=== git diff (grill) ===\"; git diff --stat; git diff .claude/skills/grill/SKILL.md",
  "description": "Rewrite the grill skill, create the handoff skill, and show the resulting diff"
}
```

### 2026-10-08T04:19:19.742Z · user

**Tool result**

```
=== grill ===
---
name: grill
description: Interview me about a plan until we share an understanding. Use before any implementation.
---

Interview me about the plan until we reach a shared understanding. Treat it as a design tree. Ask every question whose prerequisites are settled in one numbered round, give your recommended answer for each, and word each question so 'yes' accepts your recommendation. Look up facts yourself, only decisions come to me. Wait for my answers before the next round. Stop when nothing is silently assumed, and do not build until I confirm.

=== handoff ===
---
name: handoff
description: Write a structured handoff file so a fresh agent or a future session can resume exactly where this one left off. Use when a session is ending, context is running low, or the user says "handoff".
---

Create a structured handoff file that lets a fresh agent (or future you) pick up exactly where this session left off, with zero ambiguity and no wasted re-exploration.

=== prettier check on both ===
Checking formatting...
All matched files use Prettier code style!

=== git status ===
 M .claude/skills/grill/SKILL.md
?? .claude/skills/handoff/

=== git diff (grill) ===
 .claude/skills/grill/SKILL.md | 8 ++------
 1 file changed, 2 insertions(+), 6 deletions(-)
diff --git a/.claude/skills/grill/SKILL.md b/.claude/skills/grill/SKILL.md
index 093df57..b0613c0 100644
--- a/.claude/skills/grill/SKILL.md
+++ b/.claude/skills/grill/SKILL.md
@@ -1,10 +1,6 @@
 ---
 name: grill
-description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
+description: Interview me about a plan until we share an understanding. Use before any implementation.
 ---
 
-Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.
-
-Ask the questions one at a time.
-
-If a question can be answered by exploring the codebase, explore the codebase instead.
+Interview me about the plan until we reach a shared understanding. Treat it as a design tree. Ask every question whose prerequisites are settled in one numbered round, give your recommended answer for each, and word each question so 'yes' accepts your recommendation. Look up facts yourself, only decisions come to me. Wait for my answers before the next round. Stop when nothing is silently assumed, and do not build until I confirm.
```

### 2026-10-08T04:19:26.821Z · assistant

**Tool call: Bash**

```json
{
  "command": "M=/Users/tom/.claude/projects/-Users-tom-park-finder/memory\ncat > \"$M/grill-skill-and-plan-md-workflow.md\" <<'EOF'\n---\nname: grill-skill-and-plan-md-workflow\ndescription: Tom plans with the project grill skill (numbered rounds, yes accepts the recommendation) and ends sessions with the handoff skill; PLAN.md, which CLAUDE.md references, did not exist as of 2026-10-08\nmetadata:\n  type: project\n---\n\nTwo project skills live in .claude/skills, both written by Tom on 2026-10-08. grill: interview Tom about the plan as a design tree, asking every question whose prerequisites are settled in one numbered round, with a recommended answer per question worded so \"yes\" accepts it; look up facts yourself, bring only decisions to Tom, wait between rounds, stop when nothing is silently assumed, and do not build until he confirms. handoff: write a structured handoff file so a fresh agent can resume with no re-exploration. CLAUDE.md says to read PLAN.md every session and that optional brief items are in scope only if PLAN.md lists them; PLAN.md had not been written as of 2026-10-08.\n\n**Why:** Both skills were added mid-session, so they may be missing from the loaded skill list until a restart; the files can be read and followed directly.\n\n**How to apply:** When Tom says \"grill me\" or invokes /grill, follow .claude/skills/grill/SKILL.md; the open data-hole decisions (broken image URLs, hours, missing name/id/coordinates, amenities display, image alt text) are the first round. On /handoff follow .claude/skills/handoff/SKILL.md. See [[node-24-via-nvm-for-angular-22]] before running anything.\nEOF\ncat > \"$M/MEMORY.md\" <<'EOF'\n- [Node 24 via nvm for Angular 22](node-24-via-nvm-for-angular-22.md) — source nvm and use 24.21.0 in every command; never the global ng v18\n- [GitHub push via gh credential](github-push-via-gh-credential.md) — repo-local git identity, push with the gh credential helper flags\n- [Grill skill and PLAN.md workflow](grill-skill-and-plan-md-workflow.md) — grill runs in numbered rounds, handoff writes a resume file; PLAN.md still to be written from the data-hole decisions\nEOF\necho \"memory updated\"; ls \"$M\"",
  "description": "Update the memory note describing the grill and handoff skills"
}
```

### 2026-10-08T04:19:26.903Z · user

**Tool result**

```
memory updated
MEMORY.md
github-push-via-gh-credential.md
grill-skill-and-plan-md-workflow.md
node-24-via-nvm-for-angular-22.md
```

- 2026-10-08T04:19:26.911Z · `attachment` record

- 2026-10-08T04:19:26.911Z · `attachment` record

- 2026-10-08T04:19:26.915Z · `attachment` record

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

- 2026-10-08T04:19:38.048Z · `attachment` record

### 2026-10-08T04:19:38.047Z · assistant

**Thinking**



### 2026-10-08T04:19:38.058Z · assistant

Both skills are in place, Prettier-clean, and uncommitted so you can review them before saying commit.

- [grill/SKILL.md](.claude/skills/grill/SKILL.md) now holds your frontmatter and body verbatim, without the surrounding quotes. The diff is only the description line and the body.
- [handoff/SKILL.md](.claude/skills/handoff/SKILL.md) is new. The body is your sentence verbatim. The description is mine, since a skill needs one to trigger:

```
description: Write a structured handoff file so a fresh agent or a future session can resume exactly where this one left off. Use when a session is ending, context is running low, or the user says "handoff".
```

The harness has now registered grill in my skill list, though the listing still shows the old Cursor description, so it may lag one reload behind the file. Handoff is not listed yet, but I can follow the file directly whenever you invoke it.

One assumption to flag: the handoff skill does not say where the file goes. When invoked I'll write `HANDOFF.md` at the repo root unless you tell me otherwise.

### 2026-10-08T04:19:38.086Z · system (stop_hook_summary)

```json
{
  "parentUuid": "8d6f37d2-5788-41f3-984e-015a30711a49",
  "isSidechain": false,
  "type": "system",
  "subtype": "stop_hook_summary",
  "hookCount": 1,
  "hookInfos": [
    {
      "command": "bash ~/.claude/hooks/stop-episodic-append.sh",
      "durationMs": 15
    }
  ],
  "hookErrors": [],
  "hookAdditionalContext": [],
  "preventedContinuation": false,
  "stopReason": "",
  "hasOutput": false,
  "level": "suggestion",
  "timestamp": "2026-10-08T04:19:38.086Z",
  "uuid": "d9adf2e9-c056-4cf9-9543-94974977649d",
  "toolUseID": "fa722dcb-3fb3-46bc-9123-fa9d4aacd311",
  "userType": "external",
  "entrypoint": "claude-vscode",
  "cwd": "/Users/tom/park-finder",
  "sessionId": "89b775c1-f4be-4150-8226-c47dfdd97844",
  "version": "2.1.289",
  "gitBranch": "HEAD",
  "slug": "snoopy-whistling-cerf"
}
```

- 2026-10-08T04:21:54.722Z · `queue-operation` record

- 2026-10-08T04:21:54.722Z · `queue-operation` record

### 2026-10-08T04:21:54.735Z · user

have it save all handoff files in a folder handoffs at rool such as handoffs/handoff-1.md, handoffs/handoff-2.md

- 2026-10-08T04:21:54.734Z · `attachment` record

-  · `file-history-snapshot` record

### 2026-10-08T04:22:06.142Z · assistant

**Thinking**



### 2026-10-08T04:22:06.913Z · assistant

I'll add the location and numbering rule to the handoff skill, keeping your sentence as written.

### 2026-10-08T04:22:10.721Z · assistant

**Tool call: Bash**

```json
{
  "command": "cat > .claude/skills/handoff/SKILL.md <<'EOF'\n---\nname: handoff\ndescription: Write a structured handoff file so a fresh agent or a future session can resume exactly where this one left off. Use when a session is ending, context is running low, or the user says \"handoff\".\n---\n\nCreate a structured handoff file that lets a fresh agent (or future you) pick up exactly where this session left off, with zero ambiguity and no wasted re-exploration.\n\nSave it in the handoffs folder at the repo root as handoffs/handoff-N.md, where N is one more than the highest number already there (handoffs/handoff-1.md, handoffs/handoff-2.md, ...). Create the folder if it does not exist. Never overwrite an earlier handoff.\nEOF\necho \"=== handoff ===\"; cat .claude/skills/handoff/SKILL.md\necho; echo \"=== prettier ===\"; npx prettier --check .claude/skills/handoff/SKILL.md 2>&1 | tail -1\necho; echo \"=== git status ===\"; git status --short",
  "description": "Add the handoffs folder and numbering rule to the handoff skill"
}
```

### 2026-10-08T04:22:11.703Z · user

**Tool result**

```
=== handoff ===
---
name: handoff
description: Write a structured handoff file so a fresh agent or a future session can resume exactly where this one left off. Use when a session is ending, context is running low, or the user says "handoff".
---

Create a structured handoff file that lets a fresh agent (or future you) pick up exactly where this session left off, with zero ambiguity and no wasted re-exploration.

Save it in the handoffs folder at the repo root as handoffs/handoff-N.md, where N is one more than the highest number already there (handoffs/handoff-1.md, handoffs/handoff-2.md, ...). Create the folder if it does not exist. Never overwrite an earlier handoff.

=== prettier ===
All matched files use Prettier code style!

=== git status ===
 M .claude/skills/grill/SKILL.md
?? .claude/skills/handoff/
```

### 2026-10-08T04:22:13.432Z · assistant

**Tool call: Bash**

```json
{
  "command": "M=/Users/tom/.claude/projects/-Users-tom-park-finder/memory\nsed -i '' 's|On /handoff follow .claude/skills/handoff/SKILL.md.|On /handoff follow .claude/skills/handoff/SKILL.md, which numbers files as handoffs/handoff-N.md at the repo root; at session start, read the highest-numbered one if the folder exists.|' \"$M/grill-skill-and-plan-md-workflow.md\"\ngrep -n 'handoff-N' \"$M/grill-skill-and-plan-md-workflow.md\"",
  "description": "Note the handoff file location in memory"
}
```

### 2026-10-08T04:22:13.499Z · user

**Tool result**

```
12:**How to apply:** When Tom says "grill me" or invokes /grill, follow .claude/skills/grill/SKILL.md; the open data-hole decisions (broken image URLs, hours, missing name/id/coordinates, amenities display, image alt text) are the first round. On /handoff follow .claude/skills/handoff/SKILL.md, which numbers files as handoffs/handoff-N.md at the repo root; at session start, read the highest-numbered one if the folder exists. See [[node-24-via-nvm-for-angular-22]] before running anything.
```

- 2026-10-08T04:22:13.505Z · `attachment` record

- 2026-10-08T04:22:13.505Z · `attachment` record

- 2026-10-08T04:22:13.508Z · `attachment` record

- 2026-10-08T04:22:18.861Z · `attachment` record

### 2026-10-08T04:22:18.860Z · assistant

**Thinking**



### 2026-10-08T04:22:18.867Z · assistant

Done. The handoff skill now ends with:

```
Save it in the handoffs folder at the repo root as handoffs/handoff-N.md, where N is one more than the highest number already there (handoffs/handoff-1.md, handoffs/handoff-2.md, ...). Create the folder if it does not exist. Never overwrite an earlier handoff.
```

Both skills are now registered with their current descriptions, so `/grill` and `/handoff` work in this session. I did not create the `handoffs/` folder itself. The skill creates it on first use, so nothing empty sits in the repo.

Uncommitted and waiting on your review: the grill rewrite and the new [handoff/SKILL.md](.claude/skills/handoff/SKILL.md). Nothing else has changed since commit ad8dcb5.

### 2026-10-08T04:22:18.896Z · system (stop_hook_summary)

```json
{
  "parentUuid": "78e723ed-9cf6-4008-bdba-3b0387c7536c",
  "isSidechain": false,
  "type": "system",
  "subtype": "stop_hook_summary",
  "hookCount": 1,
  "hookInfos": [
    {
      "command": "bash ~/.claude/hooks/stop-episodic-append.sh",
      "durationMs": 13
    }
  ],
  "hookErrors": [],
  "hookAdditionalContext": [],
  "preventedContinuation": false,
  "stopReason": "",
  "hasOutput": false,
  "level": "suggestion",
  "timestamp": "2026-10-08T04:22:18.896Z",
  "uuid": "cefbd847-56af-469f-8d8f-c09b2dbb5b3a",
  "toolUseID": "ec5c7bfe-7ab8-448a-b365-bd2a8a8c68a6",
  "userType": "external",
  "entrypoint": "claude-vscode",
  "cwd": "/Users/tom/park-finder",
  "sessionId": "89b775c1-f4be-4150-8226-c47dfdd97844",
  "version": "2.1.289",
  "gitBranch": "HEAD",
  "slug": "snoopy-whistling-cerf"
}
```

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

- 2026-10-08T04:24:01.469Z · `queue-operation` record

- 2026-10-08T04:24:01.469Z · `queue-operation` record

### 2026-10-08T04:24:01.479Z · user

ok now create the first handoff for this session

- 2026-10-08T04:24:01.478Z · `attachment` record

-  · `file-history-snapshot` record

### 2026-10-08T04:25:23.615Z · assistant

**Thinking**



### 2026-10-08T04:25:24.366Z · assistant

I'll load the handoff skill and gather the few timestamps and version numbers the file needs, then write `handoffs/handoff-1.md`.

### 2026-10-08T04:25:24.718Z · assistant

**Tool call: Skill**

```json
{
  "skill": "handoff"
}
```

### 2026-10-08T04:25:24.742Z · user

**Tool result**

```
Launching skill: handoff
```

### 2026-10-08T04:25:24.739Z · user

Base directory for this skill: /Users/tom/park-finder/.claude/skills/handoff

Create a structured handoff file that lets a fresh agent (or future you) pick up exactly where this session left off, with zero ambiguity and no wasted re-exploration.

Save it in the handoffs folder at the repo root as handoffs/handoff-N.md, where N is one more than the highest number already there (handoffs/handoff-1.md, handoffs/handoff-2.md, ...). Create the folder if it does not exist. Never overwrite an earlier handoff.


- 2026-10-08T04:25:24.739Z · `attachment` record

- 2026-10-08T04:25:24.739Z · `attachment` record

### 2026-10-08T04:25:28.201Z · assistant

**Tool call: Bash**

```json
{
  "command": "echo \"--- now ---\"; date '+%Y-%m-%d %H:%M %Z'; echo \"--- commit time ---\"; git log -1 --format='%h %ci %s'; echo \"--- handoffs folder? ---\"; ls handoffs 2>&1; echo \"--- session transcript files (birth, modified) ---\"; for f in ~/.claude/projects/-Users-tom-park-finder/*.jsonl; do stat -f '%SB  %Sm  %N' -t '%Y-%m-%d %H:%M' \"$f\"; done 2>&1; echo \"--- exact versions ---\"; npm ls prettier typescript 2>/dev/null | grep -E 'prettier|typescript'; echo \"--- git status ---\"; git status --short",
  "description": "Collect timestamps, transcript locations, and versions for the handoff"
}
```

### 2026-10-08T04:25:29.315Z · user

**Tool result**

```
--- now ---
2026-10-08 00:25 EDT
--- commit time ---
ad8dcb5 2026-10-07 23:55:43 -0400 chore: scaffold Angular 22 app with Leaflet and Vitest
--- handoffs folder? ---
ls: handoffs: No such file or directory
--- session transcript files (birth, modified) ---
2026-10-07 23:45  2026-10-08 00:24  /Users/tom/.claude/projects/-Users-tom-park-finder/89b775c1-f4be-4150-8226-c47dfdd97844.jsonl
--- exact versions ---
│ └── typescript@6.0.3 deduped
│   └── typescript@6.0.3 deduped
│ └── typescript@6.0.3 deduped
├── prettier@3.9.9
└── typescript@6.0.3
--- git status ---
 M .claude/skills/grill/SKILL.md
 M angular.json
?? .claude/skills/handoff/
```

- 2026-10-08T04:25:29.362Z · `attachment` record

- 2026-10-08T04:25:29.365Z · `attachment` record

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

- 2026-10-08T04:25:38.471Z · `attachment` record

### 2026-10-08T04:25:38.471Z · assistant

**Thinking**



### 2026-10-08T04:25:39.727Z · assistant

**Tool call: Bash**

```json
{
  "command": "stat -f 'modified: %Sm  %N' -t '%Y-%m-%d %H:%M:%S' angular.json && git diff angular.json",
  "description": "Show the unexpected uncommitted change to angular.json"
}
```

### 2026-10-08T04:25:39.823Z · user

**Tool result**

```
modified: 2026-10-08 00:24:55  angular.json
diff --git a/angular.json b/angular.json
index d9eb8ac..37cb023 100644
--- a/angular.json
+++ b/angular.json
@@ -2,7 +2,8 @@
   "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
   "version": 1,
   "cli": {
-    "packageManager": "npm"
+    "packageManager": "npm",
+    "analytics": "7d4d5032-05c7-4214-9433-9a0ae2ca5a2f"
   },
   "newProjectRoot": "projects",
   "projects": {
```

- 2026-10-08T04:25:39.828Z · `attachment` record

- 2026-10-08T04:25:39.830Z · `attachment` record

- 2026-10-08T04:27:21.787Z · `attachment` record

### 2026-10-08T04:27:21.786Z · assistant

**Thinking**



### 2026-10-08T04:27:21.793Z · assistant

**Thinking**

The angular.json change is just the Angular CLI's analytics opt-in UUID, not something I made, so I'll note it as a decision in the handoff rather than revert it. Since the handoffs folder doesn't exist yet, I'm creating handoff-1 now.



### 2026-10-08T04:28:14.230Z · assistant

**Tool call: Bash**

````json
{
  "command": "export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm use 24.21.0 >/dev/null; cd /Users/tom/park-finder && test ! -e handoffs/handoff-1.md && mkdir -p handoffs && cat > handoffs/handoff-1.md <<'EOF'\n# Handoff 1: setup session\n\nWritten 2026-10-08 00:30 EDT at the end of session 1. The next handoff is handoffs/handoff-2.md.\n\nRead in this order before doing anything: this file, CLAUDE.md (the contract; it wins over this file), docs/local-parks-candidate.pdf (the brief, 3 pages), public/assets/parks.sample.json (the data, 12 parks). PLAN.md does not exist yet. CLAUDE.md expects it, and producing it is the next piece of work.\n\n## 1. The project in four lines\n\n- Granicus \"Find a Park\" take-home. Hard cap of 2 hours total including tests and README; stop at 2 h and list what is unfinished. Core loop only: a list of parks, a details view, a map with markers. Selecting from the list, the map, or the URL opens the same details.\n- Submission is a zip: source, README (run steps, what works, what was left out, decisions, known issues, how it was checked, time spent, next steps before public use), and the full unredacted AI logs from every tool used.\n- Stack is fixed by CLAUDE.md: Angular 22 standalone, zoneless, signals, inject(), built-in control flow, OnPush, plain CSS with custom properties, Leaflet, Vitest with TestBed, Prettier, conventional commits with the Co-Authored-By trailer.\n- Working agreement: work on main, one commit per slice, show the diff and test output and wait for Tom to say \"commit\", ask before building anything unclear, no features Tom did not ask for, no new dependencies without asking.\n\n## 2. Repo state at handoff\n\n- Remote: https://github.com/tomdriver123/park-finder (private). Branch main tracks origin/main.\n- Only commit: ad8dcb5, 2026-10-07 23:55 EDT, \"chore: scaffold Angular 22 app with Leaflet and Vitest\", 32 files, pushed.\n- Uncommitted, awaiting Tom's \"commit\":\n  - .claude/skills/grill/SKILL.md, rewritten to Tom's dictated text (numbered rounds).\n  - .claude/skills/handoff/SKILL.md, new.\n  - angular.json: a `cli.analytics` line with a pseudonymous UUID appeared at 00:24 on 2026-10-08. The agent did not make it; the Angular CLI writes it when its usage-analytics prompt is accepted, probably from an ng command in Tom's terminal. Tom decides: commit it, or revert with `git checkout angular.json` and set `\"analytics\": false` so the prompt does not return.\n  - handoffs/handoff-1.md, this file.\n- Verified at commit time: `npx ng build` passes (styles bundle 11 kB includes the Leaflet CSS; assets/parks.sample.json is copied into dist), `npx ng test --watch=false` passes 2 of 2 scaffold tests, `npx prettier --check .` is clean. The skill files were Prettier-checked after their edits.\n- No app code exists. src/app holds only the scaffold: app.ts (App, a title signal), app.html (the 20 kB Angular placeholder), app.css (empty), app.spec.ts (2 tests, one expects an h1 containing \"Hello, park-finder\"), app.config.ts (provideBrowserGlobalErrorListeners, provideRouter), app.routes.ts (empty routes array), plus empty data/, map/, panel/ folders holding .gitkeep. src/styles.css is a single comment. The placeholder template and its test get replaced in the first UI slice.\n\n## 3. Verified facts, do not re-derive\n\n| Item       | Fact                                                                                                                                                                                                                                                       |\n| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |\n| Angular    | core 22.2.1, cli 22.2.2, build 22.2.2; standalone; zoneless (no zone.js dependency, no zone provider); routing on; CSS; no SSR; strict; 2025 file naming (app.ts, not app.component.ts)                                                                       |\n| Tests      | angular.json test target is @angular/build:unit-test with the default runner, Vitest 5.0.3 on jsdom 30.1.2; tsconfig.spec.json has types vitest/globals; run `npx ng test --watch=false`                                                                   |\n| Leaflet    | leaflet 1.9.4 in dependencies, @types/leaflet 1.9.22 in devDependencies; CSS is loaded through the angular.json `styles` array ahead of src/styles.css, not an @import, so styles.css stays tokens, focus ring, and reduced motion only                       |\n| Prettier   | 3.9.9, came with the scaffold; .prettierrc sets printWidth 100, singleQuote, and the angular parser for html; .prettierignore excludes CLAUDE.md, public/assets/parks.sample.json, and docs/ so both source documents stay byte-identical to what was supplied |\n| TypeScript | 6.0.3; strict flags on (noImplicitOverride, noPropertyAccessFromIndexSignature, noImplicitReturns, noFallthroughCasesInSwitch)                                                                                                                             |\n| Budgets    | production build: initial 500 kB warn / 1 MB error; anyComponentStyle 4 kB warn / 8 kB error                                                                                                                                                                 |\n| Data URL   | public/ is served at the root, so the file is fetched at /assets/parks.sample.json, matching CLAUDE.md                                                                                                                                                       |\n| Node       | .nvmrc pins 24.21.0; the Angular 22.2 CLI refuses anything below 24.15.0                                                                                                                                                                                     |\n\n## 4. Environment gotchas\n\n- The tool shell's first `node` is Homebrew 24.14.1 and nvm is not auto-sourced there; nvm's default alias is 18. Prefix every shell command with `export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm use 24.21.0 >/dev/null;`. In Tom's own terminal, `nvm use` inside the repo reads .nvmrc.\n- A global `ng` v18.2 is on PATH. Never run bare `ng`; use `npx ng ...` or `npm run ...`.\n- Git identity exists only in this repo's config (Tom Driver, thomas.andrew.driver@gmail.com); nothing global. Tom may want a different name.\n- No GitHub credential helper is configured globally, only osxkeychain. Push with `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push`. gh is logged in as tomdriver123.\n- This session's transcript, required in the submission, is ~/.claude/projects/-Users-tom-park-finder/89b775c1-f4be-4150-8226-c47dfdd97844.jsonl (started 23:45 on 2026-10-07). Each later session adds another .jsonl to that folder. Export all of them, unredacted, before zipping.\n- Skills added mid-session may be missing from the loaded skill list until a restart; both skill files can be read and followed directly.\n\n## 5. Decisions made so far\n\n| Decision                                                                                                                                                                             | By    | Status                         |\n| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ------------------------------ |\n| Angular 22 + Leaflet + Vitest, zoneless, routing, CSS, no SSR                                                                                                                        | Tom   | fixed                          |\n| Leaflet CSS via the angular.json styles array                                                                                                                                        | agent | Tom informed, no objection     |\n| Keep the scaffold's .prettierrc although CLAUDE.md says \"Prettier defaults\"                                                                                                          | agent | flagged, Tom has not decided   |\n| .prettierignore for CLAUDE.md, the sample JSON, and docs/                                                                                                                            | agent | Tom informed                   |\n| .nvmrc = 24.21.0, Node installed through nvm, default alias untouched                                                                                                                | agent | Tom informed                   |\n| Repo-local git author \"Tom Driver\"                                                                                                                                                   | agent | Tom informed, may rename       |\n| First commit includes .claude/skills, the generated README, and .vscode/                                                                                                             | agent | Tom informed                   |\n| grill skill: every settled question in one numbered round, a recommended answer each, \"yes\" accepts it, facts looked up by the agent, decisions by Tom, nothing built until confirmed | Tom   | done, uncommitted              |\n| handoff files: handoffs/handoff-N.md, never overwrite an earlier one                                                                                                                  | Tom   | done, uncommitted              |\n\n## 6. Data holes, analysed, decisions pending\n\nDelivered to Tom on 2026-10-07. \"Sample\" means present in the file; \"brief\" means allowed by the brief's missing-or-null clause but absent from the sample. Rows marked DECIDE are the first grill round. The rest apply as proposed unless Tom objects.\n\n| #   | Hole                                                                          | Where                                                  | CLAUDE.md                                 | Verdict                                                                                                                                        |\n| --- | ----------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |\n| 1   | description null                                                              | sample: old-mill-botanical-garden                      | \"No description available.\"               | covered                                                                                                                                        |\n| 2   | location.address absent                                                       | sample: highland-dog-park                              | show coordinates                          | covered; format unstated, propose \"40.6789, -73.9442\"                                                                                          |\n| 3   | images []                                                                     | sample: cedar-hill-nature-preserve, east-ridge-trailhead | placeholder                               | covered                                                                                                                                        |\n| 4   | rating null                                                                   | sample: cedar-hill-nature-preserve                     | hide the rating row                       | covered; use a null check so a rating of 0 still shows                                                                                         |\n| 5   | every image URL is on images.example.com and never loads                      | sample: all 10 parks with images                       | only empty arrays covered                 | DECIDE; propose real src, swap to the placeholder on the img error event                                                                       |\n| 6   | street-only addresses, no city or zip (\"Shore Pkwy\", \"44th St & 7th Ave\")     | sample: 8 of 11 addresses                              | never invent values                       | covered; show verbatim, never append a city                                                                                                    |\n| 7   | hours is free text: \"6:00 AM - 1:00 AM\", \"Dawn to dusk\", \"24 hours\"           | sample: all                                            | no hours rule                             | DECIDE; propose verbatim, never parse, hide the row when missing                                                                                |\n| 8   | name missing, null, or \"\"                                                     | brief                                                  | no rule; inventing forbidden              | DECIDE; propose falling back to the id text; affects list label, heading, marker alt                                                           |\n| 9   | id missing, null, or duplicate                                                | brief                                                  | no rule                                   | DECIDE; id drives the route, @for track, and focus return; propose normalize drops the row and the service counts drops                        |\n| 10  | location missing, or lat/lng null, non-numeric, out of range                  | brief                                                  | no rule; rule 2 assumes coordinates exist | DECIDE; propose keeping the park in list and details with \"Location not available\", no marker, bounds from the rest; Leaflet throws on NaN     |\n| 11  | amenities missing, null, [], or null/\"\" entries                               | brief                                                  | no rule                                   | DECIDE; propose hiding the section when empty; also decide raw slugs vs humanized (\"dog-run\" vs \"Dog run\")                                     |\n| 12  | images null, or with null/\"\" entries                                          | brief                                                  | \"missing, null, or empty arrays\" + rule 3 | covered if normalize coalesces to [] and filters bad entries                                                                                   |\n| 13  | acreage missing or null                                                       | brief                                                  | no rule; the brief does not list acreage  | propose hiding the row, unit \"acres\" when shown                                                                                                |\n| 14  | wrong types (rating \"4.7\" as a string, amenities as a string)                 | brief                                                  | never invent values                       | propose treating the field as missing, never coercing                                                                                          |\n| 15  | empty or whitespace strings for description, address, hours                   | brief                                                  | empty strings not listed                  | propose trim, treat \"\" as missing                                                                                                              |\n| 16  | fetch fails, malformed JSON, top level not an array                           | brief                                                  | loading and error signals                 | covered; an empty array has no rule, propose \"No parks to show\"                                                                                |\n| 17  | unknown id in the URL                                                         | CLAUDE.md URL path                                     | no rule                                   | propose \"Park not found\" with a link back to the list                                                                                          |\n| 18  | no alt text or captions for any image                                         | sample: all                                            | alt and title for markers only            | DECIDE; propose alt \"Photo 1 of 2, Prospect Park\", or decorative alt \"\"                                                                        |\n| 19  | rating scale not stated; sample max is 4.9                                    | sample                                                 | nothing on display format                 | propose the bare number, no \"/ 5\"                                                                                                              |\n| 20  | cedar-hill-nature-preserve sits at 40.7128, -74.006, the generic NYC point    | sample                                                 | not actionable                            | README data-quality note only                                                                                                                  |\n\n## 7. Open questions for Tom\n\n1. Data holes 5, 7, 8, 9, 10, 11, and 18.\n2. Keep or drop .prettierrc.\n3. Git author name.\n4. The angular.json analytics line: commit or revert.\n5. Commit the two skill files and this handoff, and with what message. Proposed: `chore: add grill and handoff skills and first handoff`.\n6. Municipality framing for the title and README. The brief says to choose a real or fictional one; the data mixes a real place (Prospect Park) with fictional ones at New York City coordinates.\n7. Time accounting. Session 1 ran from 23:45 on 2026-10-07 to about 00:30 on 2026-10-08: planning and setup, no app code. Tom's own prep before that (CLAUDE.md was written about 22:53) is not counted here. Tom decides what counts toward the 2 h.\n\n## 8. Next steps, in order\n\n1. Tom reviews the uncommitted files. On \"commit\": run Prettier, commit, push.\n2. Run /grill on the build plan, starting with the DECIDE rows and the open questions above. Write PLAN.md from the answers. CLAUDE.md requires it, and optional brief items are in scope only if PLAN.md lists them.\n3. Proposed slices, pending grill:\n   - Slice 1, data: src/app/data with a Park type, normalize.ts (pure, the only place raw JSON is shaped), parks.service.ts (HttpClient; signals parks, loading, error; sole caller of normalize). Tests use the real sample plus hand-written edge rows, with expected values taken from CLAUDE.md's rules.\n   - Slice 2, panel: list and details in src/app/panel, routes / and /parks/:id in app.routes.ts, keyboard path with a visible focus ring, focus into details on open and back to the list item on close, landmarks nav/main/aside, one h1.\n   - Slice 3, map: Leaflet in src/app/map, markers with alt and title, every Leaflet callback writes a signal (zoneless), fitBounds from the data, marker click opens the same details route.\n   - Then the README (the brief's required sections), export the AI logs, zip. Stop at 2 h and record what is unfinished.\n4. After each slice: show the diff and the test output, then wait for \"commit\".\n\n## 9. Commands\n\n```sh\nexport NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; nvm use 24.21.0 >/dev/null\nnpx ng serve                 # dev server at http://localhost:4200\nnpx ng build                 # production build to dist/park-finder/browser\nnpx ng test --watch=false    # Vitest, single run\nnpx prettier --write .       # before every commit\ngit -c credential.helper= -c 'credential.helper=!gh auth git-credential' push\n```\nEOF\nnpx prettier --write handoffs/handoff-1.md >/dev/null && npx prettier --check handoffs/handoff-1.md 2>&1 | tail -1\necho \"--- file ---\"; wc -l handoffs/handoff-1.md; grep -n '^## ' handoffs/handoff-1.md\necho \"--- git status ---\"; git status --short",
  "description": "Write handoffs/handoff-1.md, format it with Prettier, and show the outline"
}
````

-  · `last-prompt` record

-  · `ai-title` record

-  · `atis-latch` record

### 2026-10-08T04:28:17.913Z · user

**Tool result**

```
All matched files use Prettier code style!
--- file ---
     119 handoffs/handoff-1.md
7:## 1. The project in four lines
14:## 2. Repo state at handoff
26:## 3. Verified facts, do not re-derive
39:## 4. Environment gotchas
48:## 5. Decisions made so far
62:## 6. Data holes, analysed, decisions pending
89:## 7. Open questions for Tom
99:## 8. Next steps, in order
110:## 9. Commands
--- git status ---
 M .claude/skills/grill/SKILL.md
 M angular.json
?? .claude/skills/handoff/
?? handoffs/
```

- 2026-10-08T04:28:17.918Z · `attachment` record

- 2026-10-08T04:28:17.921Z · `attachment` record

### 2026-10-08T04:28:25.477Z · assistant

**Thinking**



### 2026-10-08T04:28:25.536Z · assistant

Written for: a fresh agent, or a future session of me, resuming this project with no prior context.

The handoff is at [handoffs/handoff-1.md](handoffs/handoff-1.md), 119 lines, Prettier-clean, uncommitted. It carries the project in four lines, the exact repo state, verified stack facts and versions, the environment gotchas (nvm Node 24.21.0, global ng v18, repo-local git identity, the gh push command, the transcript file path for the submission), every decision made so far and who made it, the full 20-row data-hole table with the seven DECIDE rows marked as the first grill round, seven open questions for you, the proposed slice order pending `/grill`, and the commands to run.

One new finding went into it. Your angular.json picked up an uncommitted `cli.analytics` UUID at 00:24, which the Angular CLI writes when its usage-analytics prompt is accepted, most likely from an ng command in your terminal. I left it alone and listed it as a decision: commit it, or revert and set analytics to false.

Uncommitted and waiting on your "commit": the grill rewrite, the new handoff skill, that angular.json line, and the handoff file itself.

### 2026-10-08T04:28:25.577Z · system (stop_hook_summary)

```json
{
  "parentUuid": "85f352b6-aa25-4f55-8aab-c1765dadfd51",
  "isSidechain": false,
  "type": "system",
  "subtype": "stop_hook_summary",
  "hookCount": 1,
  "hookInfos": [
    {
      "command": "bash ~/.claude/hooks/stop-episodic-append.sh",
      "durationMs": 22
    }
  ],
  "hookErrors": [],
  "hookAdditionalContext": [],
  "preventedContinuation": false,
  "stopReason": "",
  "hasOutput": false,
  "level": "suggestion",
  "timestamp": "2026-10-08T04:28:25.577Z",
  "uuid": "783aa21d-b24e-49b3-81e7-b9526ab45620",
  "toolUseID": "5978d295-7a30-40cb-880a-de5e816b6144",
  "userType": "external",
  "entrypoint": "claude-vscode",
  "cwd": "/Users/tom/park-finder",
  "sessionId": "89b775c1-f4be-4150-8226-c47dfdd97844",
  "version": "2.1.289",
  "gitBranch": "HEAD",
  "slug": "snoopy-whistling-cerf"
}
```

-  · `last-prompt` record

-  · `cost-state` record
