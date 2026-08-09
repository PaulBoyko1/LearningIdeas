export function clampIndex(index, length) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError("length must be a positive integer");
  }
  const numeric = Number.isFinite(Number(index)) ? Math.trunc(Number(index)) : 0;
  return Math.min(Math.max(numeric, 0), length - 1);
}

export function lessonProgress(index, length) {
  const safeIndex = clampIndex(index, length);
  return Math.round(((safeIndex + 1) / length) * 100);
}

export function normalizeQuery(value) {
  return typeof value === "string" ? value.trim().toLocaleLowerCase() : "";
}

export function filterProjects(projects, selectedConceptIds = [], query = "") {
  const selected = new Set(selectedConceptIds);
  const normalizedQuery = normalizeQuery(query);
  return projects.filter((project) => {
    const matchesConcept =
      selected.size === 0 || project.conceptIds.some((conceptId) => selected.has(conceptId));
    const searchable = [
      project.title,
      project.tagline,
      project.work,
      project.idea,
      project.use,
      project.helps
    ]
      .join(" ")
      .toLocaleLowerCase();
    return matchesConcept && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}

export function filterDefinitions(definitions, query = "") {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    return definitions;
  }
  return definitions.filter((definition) =>
    [definition.term, definition.definition, definition.applies]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery)
  );
}

export function relatedProjects(projects, identifiers) {
  const wanted = new Set(identifiers);
  return projects.filter((project) => wanted.has(project.id));
}

export function conceptCoverage(projects, conceptId) {
  return projects.filter((project) => project.conceptIds.includes(conceptId)).length;
}
