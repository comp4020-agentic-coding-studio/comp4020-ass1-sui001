import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Assignment 1's own spec, turned into tests. These assert the CONTRACT the
// published spec asks for — what the page must do — not how it's built, so
// they survive a change of approach. They start red: there's no prototype yet.
// See https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/assessments/assignment-1/

function distDoc(path = "dist/index.html") {
  const distPath = resolve(path);
  expect(existsSync(distPath), `${distPath} not found — build first`).toBe(
    true,
  );
  return new JSDOM(readFileSync(distPath, "utf8")).window.document;
}

describe("core interaction: click-the-dot reaction test", () => {
  it("has a dot for the visitor to click", () => {
    const doc = distDoc();
    expect(
      doc.querySelector('[data-testid="dot-target"]'),
      "the spec requires an interaction the visitor performs — the reaction-time dot is it",
    ).toBeTruthy();
  });

  it("has a readout that reports back what the visitor did", () => {
    const doc = distDoc();
    expect(
      doc.querySelector('[data-testid="reaction-readout"]'),
      "the visitor's click has to change what they see — this is where the reaction time/score shows up",
    ).toBeTruthy();
  });
});

describe("timeline: where the visitor sits against every scale of thought", () => {
  it("has more than one timescale stage to move through", () => {
    const doc = distDoc();
    const stages = doc.querySelectorAll("[data-stage]");
    expect(
      stages.length,
      "deep time, galactic, geological, plant life, slow/fast animals, computing — each needs its own stage",
    ).toBeGreaterThan(1);
  });

  it("marks where the visitor's own reaction time sits in the sequence", () => {
    const doc = distDoc();
    expect(
      doc.querySelector('[data-testid="visitor-marker"]'),
      "the point of the timeline is seeing yourself against the other scales — that needs a marker of its own",
    ).toBeTruthy();
  });
});
