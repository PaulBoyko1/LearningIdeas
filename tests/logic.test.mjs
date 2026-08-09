import assert from "node:assert/strict";
import test from "node:test";

import { definitions, lessons, projects } from "../data.js";
import {
  clampIndex,
  conceptCoverage,
  filterDefinitions,
  filterProjects,
  lessonProgress,
  relatedProjects
} from "../logic.mjs";

test("project filtering combines selected concepts with a readable query", () => {
  const filtered = filterProjects(projects, ["causality"], "holdout");

  assert.deepEqual(
    filtered.map((project) => project.id),
    ["physicalalpha"]
  );
});

test("empty filters retain the complete project map", () => {
  assert.equal(filterProjects(projects).length, 6);
  assert.equal(conceptCoverage(projects, "validation"), 6);
});

test("lesson position is bounded and progress is honest", () => {
  assert.equal(clampIndex(-3, lessons.length), 0);
  assert.equal(clampIndex(99, lessons.length), lessons.length - 1);
  assert.equal(lessonProgress(0, lessons.length), 17);
  assert.equal(lessonProgress(lessons.length - 1, lessons.length), 100);
});

test("definition search finds project-specific language", () => {
  const matches = filterDefinitions(definitions, "threshold calibration");

  assert.deepEqual(
    matches.map((definition) => definition.term),
    ["Calibration", "Validation set"]
  );
});

test("related project lookup preserves portfolio order", () => {
  const related = relatedProjects(projects, ["jobos", "flightstack"]);

  assert.deepEqual(
    related.map((project) => project.id),
    ["flightstack", "jobos"]
  );
});
