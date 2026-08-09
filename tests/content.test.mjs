import assert from "node:assert/strict";
import test from "node:test";

import { TRACKS, getTrack, progressFor, validateTrack } from "../content.mjs";

test("the MarketGlass track has a complete, internally linked curriculum", () => {
  const track = getTrack("marketglass");
  const validation = validateTrack(track);

  assert.equal(validation.valid, true, validation.errors.join("\n"));
  assert.equal(track.modules.length, 4);
  assert.ok(track.concepts.length >= 10);
  assert.ok(track.scenarios.every((scenario) => scenario.choices.some((choice) => choice.tone === "good")));
  assert.equal(TRACKS[0].id, "marketglass");
});

test("learning progress ignores ids not owned by the selected project track", () => {
  const track = getTrack();
  const summary = progressFor(track, {
    modules: [track.modules[0].id, "unknown-module"],
    concepts: [track.concepts[0].id, "unknown-concept"]
  });

  assert.deepEqual(summary, {
    modules: 1,
    moduleTotal: track.modules.length,
    concepts: 1,
    conceptTotal: track.concepts.length
  });
});
