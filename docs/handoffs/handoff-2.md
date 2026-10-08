# Handoff 2: planning session

Written 2026-10-08 01:45 EDT at the end of session 2. The next handoff is handoffs/handoff-3.md.

Read in this order before doing anything: this file, CLAUDE.md (the contract, edited this session), PLAN.md (the build plan: decisions, four slices, model routing, time log), docs/local-parks-candidate.pdf, public/assets/parks.sample.json. Everything decided is in PLAN.md. Do not re-derive it and do not re-ask it; this file only adds what PLAN.md does not say.

## 1. What session 2 did

- Wrote PLAN.md from Tom's four dictated slices after two grill rounds. Every open question from handoff-1 (sections 6 and 7) is settled under PLAN.md "Decisions"; handoff-1 is history now.
- Edited four sentences in CLAUDE.md so it stops contradicting the plan (palette and the one accent, ParkMap encapsulation exception, folder list with parks-page.ts, marker aria-label, Prettier config). CLAUDE.md stays in .prettierignore and is hand-edited only.
- Reverted the angular.json analytics UUID to `"analytics": false`.
- No app code was written. The scaffold is untouched.

## 2. Repo state at handoff

Run `git log --oneline` and `git status --short` first. At the time of writing, main still has the single scaffold commit and these files are uncommitted, waiting for Tom's "commit" in two commits (messages in the plan file's session steps; the second is `docs: add build plan with model routing and align CLAUDE.md`):

- session 1: .claude/skills/grill/SKILL.md, .claude/skills/handoff/SKILL.md, handoffs/handoff-1.md, angular.json
- session 2: PLAN.md, CLAUDE.md, handoffs/handoff-2.md

If those commits exist when you start, skip to section 3.

## 3. Your job: slice 1

You are the [fable] overseer. Follow PLAN.md "Session protocol" and "Model routing" exactly; the slice itself is PLAN.md "Slice 1" plus the "Data" and "Styling" decisions. In short:

1. Launch one subagent with `model: "sonnet"` passed explicitly. Give it CLAUDE.md, PLAN.md, and a prompt that names the slice ("Slice 1: data and tokens") and the protocol steps it runs (tests first, failing run captured, implement, passing run, Prettier, build). Tell it to stop and report instead of guessing when anything is unclear; it cannot ask Tom.
2. When it returns, run `git diff` and `npx ng test --watch=false` yourself and show Tom the real output. Never relay the subagent's summary as the review.
3. Wait for "commit". Commit message is in PLAN.md Slice 1. Push with the credential command in PLAN.md step 6.
4. Fill the slice 1 row of the PLAN.md time log, then write handoffs/handoff-3.md.

## 4. Gotchas for slice 1 that PLAN.md does not state

- app.spec.ts (scaffold) still expects an h1 containing "Hello, park-finder". Slice 1 must leave app.html and app.spec.ts untouched so the 2 scaffold tests keep passing alongside the new ones; slice 2 replaces them.
- Importing public/assets/parks.sample.json in a spec type-checks with the current tsconfig (verified in session 2); do not add resolveJsonModule or any config.
- jsdom has no matchMedia or ResizeObserver. Irrelevant to slice 1, relevant to slices 3 and 4; it is already in the plan.
- The shell prefix for nvm, the bare-`ng` trap, and the push command are in PLAN.md "Session protocol". Git author and credential details are in handoff-1 section 4 if something fails.
- Prettier ignores CLAUDE.md, the sample JSON, and docs/ on purpose.
- The Angular test target is Vitest 5 on jsdom via @angular/build:unit-test; `npx ng test --watch=false` is the single-run command.

## 5. Transcripts for the submission

Every session adds a .jsonl under ~/.claude/projects/-Users-tom-park-finder/. Session 1 is 89b775c1-f4be-4150-8226-c47dfdd97844.jsonl. Export all of them, unredacted, at wrap-up (PLAN.md "Wrap-up" step 5).

## 6. Time

Session 2 ran from about 00:35 to 01:45 EDT on 2026-10-08, planning only. Already entered in the PLAN.md time log as ~60 minutes; correct it if Tom counts differently.
