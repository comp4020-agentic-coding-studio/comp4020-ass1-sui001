# Process overview

## What I built

A single-page "scale of time" prototype: a click-the-dot reaction-time test
that measures your own reflexes, followed by a Powers-of-Ten-style scrolling
timeline that places your reaction time among real, researched biological and
computational timescales — from a Venus flytrap snap down to a single CPU
cycle.

## The moments that mattered

1. **Turning the spec into failing tests before building anything.** The
   starter repo shipped with a worked-example test file that didn't test my
   prototype at all. Instead of writing the reaction-time and timeline
   features first and testing after, I replaced the starter test with contract
   tests for both — deliberately red, since neither feature existed yet — so
   the two features had a fixed target instead of "does this look done to me."
   [`aebf8c7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-sui001/commit/aebf8c731c8f05d76f40af6d092887ded1b73a3c)

2. **Building the reaction-time test against those tests, not against my own
   eyeballing of the page.** The dot spawns at random positions, speeds up
   over eight rounds, and stores the average to `localStorage` for the
   timeline to consume later. I knew it was right when the first two
   assertions in `spec/assignment-1.test.ts` flipped from red to green rather
   than because the page looked plausible.
   [`e4d31a1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-sui001/commit/e4d31a109f5b0d61475c1a9480a057f1b508e4e8)

3. **Wiring the timeline to insert the visitor's own result and complete the
   spec.** Static ordered stages from deep time down to computing, with
   scroll-driven active-stage highlighting, and the visitor's own reaction
   average inserted at the correct point in the sequence. This is what took
   the suite from 2/4 to 19/19 passing.
   [`d297694`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-sui001/commit/d2976946757e73b1bb38dea86ceb624d45f6d376)

4. **Replacing guessed timescale numbers with real, cited research instead of
   shipping plausible-looking placeholders.** The first pass at the timeline
   used rough, made-up figures for things like a Venus flytrap's snap speed. I
   didn't accept that as done just because the page rendered — I went back and
   replaced every guessed figure with a real cited value (Venus flytrap 100ms,
   Forterre et al. *Nature* 2005; mantis shrimp strike 2.7ms; trap-jaw ant bite
   0.13ms), and turned the static list into a continuous scroll-zoom closer to
   the Eames reference, so scale is felt rather than just read.
   [`018d34a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-sui001/commit/018d34a9eff7d8e9b4d96cef0400568f0faa3151)

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file. It checks that your map is
traceable, not that it is good: the marker judges whether your small,
deliberately chosen set of moments shows real judgement and reflection. A green
check is not a substitute for that curation.

Images are deliberately not checked, because whether one renders is visible the
moment you look. Open this file on GitHub and look at it before you ship.
