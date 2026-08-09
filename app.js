import { concepts, definitions, lessons, projects } from "./data.js";
import {
  clampIndex,
  conceptCoverage,
  filterDefinitions,
  filterProjects,
  lessonProgress,
  relatedProjects
} from "./logic.mjs";

const STORAGE_KEY = "learningideas-progress-v1";
const canvas = document.querySelector("#concept-canvas");
const mapProjectList = document.querySelector("#map-projects");
const projectSearch = document.querySelector("#project-search");
const definitionSearch = document.querySelector("#definition-search");

let state = readState();
let mapHitRegions = [];

function readState() {
  const fallback = {
    lessonIndex: 0,
    selectedConceptId: null,
    projectId: "flightstack",
    projectQuery: "",
    definitionQuery: ""
  };

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") {
      return fallback;
    }
    const projectId = projects.some((project) => project.id === saved.projectId)
      ? saved.projectId
      : fallback.projectId;
    const selectedConceptId = concepts.some((concept) => concept.id === saved.selectedConceptId)
      ? saved.selectedConceptId
      : null;
    return {
      ...fallback,
      lessonIndex: clampIndex(saved.lessonIndex, lessons.length),
      selectedConceptId,
      projectId
    };
  } catch {
    return fallback;
  }
}

function saveProgress(message) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lessonIndex: state.lessonIndex,
        selectedConceptId: state.selectedConceptId,
        projectId: state.projectId
      })
    );
    document.querySelector("#progress-status").textContent = message;
  } catch {
    document.querySelector("#progress-status").textContent = "Progress remains in this browser session.";
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}

function conceptById(identifier) {
  return concepts.find((concept) => concept.id === identifier) || null;
}

function projectById(identifier) {
  return projects.find((project) => project.id === identifier) || projects[0];
}

function projectColor(project) {
  const concept = conceptById(project.conceptIds[0]);
  return concept ? concept.color : "#008a8d";
}

function renderStart() {
  const lesson = lessons[state.lessonIndex];
  const percent = lessonProgress(state.lessonIndex, lessons.length);
  const related = relatedProjects(projects, lesson.projectIds);

  document.querySelector("#lesson-number").textContent = lesson.number;
  document.querySelector("#lesson-title").textContent = lesson.title;
  document.querySelector("#lesson-premise").textContent = lesson.premise;
  document.querySelector("#lesson-question").textContent = lesson.question;
  document.querySelector("#lesson-practice").textContent = lesson.practice;
  document.querySelector("#lesson-label").textContent =
    "Chapter " + String(state.lessonIndex + 1) + " of " + String(lessons.length);
  document.querySelector("#lesson-percent").textContent = String(percent) + "%";
  document.querySelector("#lesson-progress-bar").style.width = String(percent) + "%";

  document.querySelector("#lesson-concepts").innerHTML = lesson.conceptIds
    .map((identifier) => {
      const concept = conceptById(identifier);
      if (!concept) {
        return "";
      }
      return [
        '<button class="inline-tag" type="button" data-concept-id="' + escapeHtml(concept.id) + '"',
        ' style="color: ' + escapeHtml(concept.color) + '">',
        escapeHtml(concept.label),
        "</button>"
      ].join("");
    })
    .join("");

  document.querySelector("#lesson-projects").innerHTML = related
    .map((project) => {
      return [
        '<button class="inline-tag is-project" type="button" data-project-id="' +
          escapeHtml(project.id) +
          '">',
        escapeHtml(project.title),
        "</button>"
      ].join("");
    })
    .join("");

  const previous = document.querySelector("[data-action='previous-lesson']");
  const next = document.querySelector("[data-action='next-lesson']");
  previous.disabled = state.lessonIndex === 0;
  previous.setAttribute("aria-disabled", String(previous.disabled));
  next.textContent =
    state.lessonIndex === lessons.length - 1 ? "Review from start" : "Continue";
}

function renderMap() {
  const selectedConcept = conceptById(state.selectedConceptId);
  const selectedIds = selectedConcept ? [selectedConcept.id] : [];
  const filtered = filterProjects(projects, selectedIds, state.projectQuery);

  document.querySelector("#map-summary").textContent = selectedConcept
    ? selectedConcept.label + " in " + String(conceptCoverage(projects, selectedConcept.id)) + " projects"
    : "All six projects";
  document.querySelector("#selected-concept-copy").textContent = selectedConcept
    ? selectedConcept.summary
    : "Start with any idea. The project list below will reveal where it becomes concrete.";

  document.querySelector("#concept-chips").innerHTML = concepts
    .map((concept) => {
      const active = concept.id === state.selectedConceptId;
      return [
        '<button class="concept-chip ' + (active ? "is-active" : "") + '" type="button"',
        ' data-concept-id="' + escapeHtml(concept.id) + '"',
        ' style="color: ' + escapeHtml(concept.color) + '">',
        escapeHtml(concept.label),
        "</button>"
      ].join("");
    })
    .join("");

  mapProjectList.innerHTML = filtered.length
    ? filtered.map(renderProjectCard).join("")
    : '<p class="empty-state">No project matches this lens and search phrase.</p>';

  drawConceptMap();
}

function renderProjectCard(project) {
  return [
    '<button class="project-card" type="button" data-project-id="' + escapeHtml(project.id) + '"',
    ' style="--project-color: ' + escapeHtml(projectColor(project)) + '">',
    '<p class="project-category">' + escapeHtml(project.category) + "</p>",
    "<h3>" + escapeHtml(project.title) + "</h3>",
    "<p>" + escapeHtml(project.tagline) + "</p>",
    '<span class="card-action">Open project translation</span>',
    "</button>"
  ].join("");
}

function renderDefinitions() {
  const filtered = filterDefinitions(definitions, state.definitionQuery);
  document.querySelector("#definition-count").textContent =
    String(filtered.length) + (filtered.length === 1 ? " definition" : " definitions");

  document.querySelector("#definition-list").innerHTML = filtered
    .map((definition) => {
      const related = relatedProjects(projects, definition.projectIds);
      return [
        '<article class="definition-card">',
        "<h2>" + escapeHtml(definition.term) + "</h2>",
        "<p>" + escapeHtml(definition.definition) + "</p>",
        "<p>" + escapeHtml(definition.applies) + "</p>",
        '<div class="inline-list">',
        related
          .map((project) => {
            return [
              '<button class="inline-tag is-project" type="button" data-project-id="' +
                escapeHtml(project.id) +
                '">',
              escapeHtml(project.title),
              "</button>"
            ].join("");
          })
          .join(""),
        "</div>",
        "</article>"
      ].join("");
    })
    .join("");
}

function renderProjects() {
  const selected = projectById(state.projectId);
  document.querySelector("#project-tabs").innerHTML = projects
    .map((project) => {
      const active = project.id === selected.id;
      return [
        '<button class="project-tab ' + (active ? "is-active" : "") + '" type="button"',
        ' data-project-id="' + escapeHtml(project.id) + '">',
        escapeHtml(project.title),
        "</button>"
      ].join("");
    })
    .join("");

  const projectConcepts = selected.conceptIds
    .map((identifier) => conceptById(identifier))
    .filter((concept) => concept !== null);

  document.querySelector("#project-detail").innerHTML = [
    '<div class="detail-topline">',
    "<div>",
    "<p>" + escapeHtml(selected.category) + "</p>",
    "<h2>" + escapeHtml(selected.title) + "</h2>",
    "</div>",
    '<a class="project-link" href="' +
      escapeHtml(selected.link) +
      '" target="_blank" rel="noreferrer">View repository</a>',
    "</div>",
    '<p class="detail-summary">' + escapeHtml(selected.work) + "</p>",
    '<div class="detail-grid">',
    "<section><h3>Central idea</h3><p>" + escapeHtml(selected.idea) + "</p></section>",
    "<section><h3>How to use it</h3><p>" + escapeHtml(selected.use) + "</p></section>",
    "<section><h3>How it helps</h3><p>" + escapeHtml(selected.helps) + "</p></section>",
    "<section><h3>Evidence in the build</h3><p>" + escapeHtml(selected.evidence) + "</p></section>",
    "</div>",
    '<div class="detail-concepts"><span>Ideas it puts into practice</span><div class="inline-list">',
    projectConcepts
      .map((concept) => {
        return [
          '<button class="inline-tag" type="button" data-concept-id="' + escapeHtml(concept.id) + '"',
          ' style="color: ' + escapeHtml(concept.color) + '">',
          escapeHtml(concept.label),
          "</button>"
        ].join("");
      })
      .join(""),
    "</div></div>"
  ].join("");
}

function drawConceptMap() {
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 20 || rect.height < 20) {
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.floor(rect.width * pixelRatio);
  const height = Math.floor(rect.height * pixelRatio);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const cssWidth = rect.width;
  const cssHeight = rect.height;
  const padding = 48;
  const nodeRadius = Math.max(23, Math.min(34, cssWidth / 22));
  const nodes = concepts.map((concept) => ({
    concept,
    x: padding + concept.position[0] * (cssWidth - padding * 2),
    y: padding + concept.position[1] * (cssHeight - padding * 2)
  }));
  mapHitRegions = nodes.map((node) => ({ ...node, radius: nodeRadius + 8 }));

  context.fillStyle = "#f7f9fc";
  context.fillRect(0, 0, cssWidth, cssHeight);

  context.lineWidth = 1;
  for (let first = 0; first < nodes.length; first += 1) {
    for (let second = first + 1; second < nodes.length; second += 1) {
      const firstCoverage = new Set(
        projects.filter((project) => project.conceptIds.includes(nodes[first].concept.id)).map(
          (project) => project.id
        )
      );
      const shared = projects.filter(
        (project) =>
          firstCoverage.has(project.id) && project.conceptIds.includes(nodes[second].concept.id)
      ).length;
      if (shared < 2) {
        continue;
      }
      context.strokeStyle = "rgba(129, 149, 171, " + String(0.12 + shared * 0.06) + ")";
      context.beginPath();
      context.moveTo(nodes[first].x, nodes[first].y);
      context.lineTo(nodes[second].x, nodes[second].y);
      context.stroke();
    }
  }

  for (const node of nodes) {
    const active = node.concept.id === state.selectedConceptId;
    context.fillStyle = node.concept.color;
    context.beginPath();
    context.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    context.fill();

    if (active) {
      context.strokeStyle = "#182235";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(node.x, node.y, nodeRadius + 6, 0, Math.PI * 2);
      context.stroke();
    }

    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "800 11px ui-sans-serif, system-ui, sans-serif";
    const words = node.concept.label.split(" ");
    if (words.length > 1) {
      context.fillText(words[0], node.x, node.y - 6);
      context.fillText(words.slice(1).join(" "), node.x, node.y + 7);
    } else {
      context.fillText(node.concept.label, node.x, node.y);
    }
  }

  context.fillStyle = "#607086";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.font = "12px ui-sans-serif, system-ui, sans-serif";
  context.fillText("Shared project concepts", padding, cssHeight - 18);
}

function showView(viewName) {
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    const active = panel.dataset.viewPanel === viewName;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    const active = button.dataset.view === viewName;
    button.classList.toggle("is-active", active);
    if (active) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
  if (viewName === "map") {
    window.requestAnimationFrame(renderMap);
  }
}

function selectConcept(identifier) {
  if (!conceptById(identifier)) {
    return;
  }
  state.selectedConceptId = state.selectedConceptId === identifier ? null : identifier;
  state.projectQuery = "";
  projectSearch.value = "";
  saveProgress("Idea lens saved on this device.");
  renderMap();
}

function selectProject(identifier) {
  if (!projects.some((project) => project.id === identifier)) {
    return;
  }
  state.projectId = identifier;
  saveProgress("Project choice saved on this device.");
  renderProjects();
  showView("projects");
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const action = event.target.closest("[data-action]");
  if (action) {
    if (action.dataset.action === "previous-lesson" && state.lessonIndex > 0) {
      state.lessonIndex -= 1;
      saveProgress("Chapter " + String(state.lessonIndex + 1) + " saved on this device.");
      renderStart();
    }
    if (action.dataset.action === "next-lesson") {
      state.lessonIndex = state.lessonIndex === lessons.length - 1 ? 0 : state.lessonIndex + 1;
      saveProgress("Chapter " + String(state.lessonIndex + 1) + " saved on this device.");
      renderStart();
    }
    return;
  }

  const conceptButton = event.target.closest("[data-concept-id]");
  if (conceptButton) {
    selectConcept(conceptButton.dataset.conceptId);
    showView("map");
    return;
  }

  const projectButton = event.target.closest("[data-project-id]");
  if (projectButton) {
    selectProject(projectButton.dataset.projectId);
  }
});

projectSearch.addEventListener("input", (event) => {
  state.projectQuery = event.target.value;
  renderMap();
});

definitionSearch.addEventListener("input", (event) => {
  state.definitionQuery = event.target.value;
  renderDefinitions();
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const hit = mapHitRegions.find((node) => {
    const distance = Math.hypot(node.x - x, node.y - y);
    return distance <= node.radius;
  });
  if (hit) {
    selectConcept(hit.concept.id);
  }
});

window.addEventListener("resize", () => {
  const mapPanel = document.querySelector("[data-view-panel='map']");
  if (!mapPanel.hidden) {
    drawConceptMap();
  }
});

renderStart();
renderMap();
renderDefinitions();
renderProjects();
