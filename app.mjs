import { getTrack, progressFor } from "./content.mjs";

const STORAGE_KEY = "learningideas-progress-v1";
const track = getTrack("marketglass");
const moduleById = new Map(track.modules.map((module) => [module.id, module]));
const conceptById = new Map(track.concepts.map((concept) => [concept.id, concept]));

const state = {
  activeModuleId: track.modules[0].id,
  activeConceptId: track.modules[0].concepts[0],
  activeScenarioId: track.scenarios[0].id,
  selectedChoiceId: null,
  progress: readProgress()
};

const elements = {
  projectList: document.querySelector("#project-list"),
  trackName: document.querySelector("#track-name"),
  trackKind: document.querySelector("#track-kind"),
  trackDescription: document.querySelector("#track-description"),
  progressSummary: document.querySelector("#progress-summary"),
  moduleTabs: document.querySelector("#module-tabs"),
  moduleNumber: document.querySelector("#module-number"),
  moduleTitle: document.querySelector("#module-title"),
  moduleSummary: document.querySelector("#module-summary"),
  moduleLesson: document.querySelector("#module-lesson"),
  moduleAction: document.querySelector("#module-action"),
  completeModule: document.querySelector("#complete-module"),
  loopCanvas: document.querySelector("#loop-canvas"),
  loopCaption: document.querySelector("#loop-caption"),
  conceptList: document.querySelector("#concept-list"),
  conceptDetail: document.querySelector("#concept-detail"),
  conceptCount: document.querySelector("#concept-count"),
  scenarioSelect: document.querySelector("#scenario-select"),
  scenarioTime: document.querySelector("#scenario-time"),
  scenarioLabel: document.querySelector("#scenario-label"),
  scenarioSignals: document.querySelector("#scenario-signals"),
  scenarioQuestion: document.querySelector("#scenario-question"),
  scenarioChoices: document.querySelector("#scenario-choices"),
  practiceFeedback: document.querySelector("#practice-feedback"),
  reflectionList: document.querySelector("#reflection-list")
};

let loopNodes = [];

function create(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return {
      modules: Array.isArray(saved.modules) ? saved.modules.filter((id) => moduleById.has(id)) : [],
      concepts: Array.isArray(saved.concepts) ? saved.concepts.filter((id) => conceptById.has(id)) : []
    };
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // A disabled storage area should not block the learning track.
    }
    return { modules: [], concepts: [] };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  } catch {
    elements.progressSummary.textContent = "Progress is temporary in this browser";
  }
}

function activeModule() {
  return moduleById.get(state.activeModuleId) ?? track.modules[0];
}

function activeConcept() {
  const fallback = conceptById.get(activeModule().concepts[0]);
  return conceptById.get(state.activeConceptId) ?? fallback;
}

function activeScenario() {
  return track.scenarios.find((scenario) => scenario.id === state.activeScenarioId) ?? track.scenarios[0];
}

function includes(list, value) {
  return list.includes(value);
}

function toggleProgress(kind, id) {
  const current = state.progress[kind];
  state.progress[kind] = includes(current, id) ? current.filter((item) => item !== id) : [...current, id];
  saveProgress();
  render();
}

function setModule(id) {
  const module = moduleById.get(id);
  if (!module) return;
  state.activeModuleId = id;
  if (!module.concepts.includes(state.activeConceptId)) state.activeConceptId = module.concepts[0];
  render();
}

function setConcept(id) {
  if (!conceptById.has(id)) return;
  state.activeConceptId = id;
  renderConcepts();
  drawLoop();
}

function renderHeader() {
  const summary = progressFor(track, state.progress);
  elements.trackName.textContent = track.name;
  elements.trackKind.textContent = track.kind;
  elements.trackDescription.textContent = track.description;
  elements.progressSummary.replaceChildren(
    create("span", "progress-label", "Progress"),
    create("strong", null, `${summary.modules}/${summary.moduleTotal} steps`),
    create("span", "progress-divider", ""),
    create("strong", null, `${summary.concepts}/${summary.conceptTotal} concepts`)
  );
}

function renderProjects() {
  elements.projectList.replaceChildren(...[track].map((item) => {
    const button = create("button", "project-button is-active");
    button.type = "button";
    button.setAttribute("aria-current", "page");
    button.append(
      create("span", `project-swatch ${item.accent}`, ""),
      create("span", "project-copy", item.name),
      create("small", null, item.status)
    );
    return button;
  }));
}

function renderModules() {
  const selectedId = activeModule().id;
  elements.moduleTabs.replaceChildren(...track.modules.map((module) => {
    const completed = includes(state.progress.modules, module.id);
    const button = create("button", `module-tab${module.id === selectedId ? " is-active" : ""}${completed ? " is-complete" : ""}`);
    button.type = "button";
    if (module.id === selectedId) button.setAttribute("aria-current", "step");
    button.append(create("span", "module-number", module.number), create("span", "module-tab-title", module.title));
    button.addEventListener("click", () => setModule(module.id));
    return button;
  }));
}

function renderLesson() {
  const module = activeModule();
  const completed = includes(state.progress.modules, module.id);
  elements.moduleNumber.textContent = `Step ${module.number}`;
  elements.moduleTitle.textContent = module.title;
  elements.moduleSummary.textContent = module.summary;
  elements.moduleLesson.textContent = module.lesson;
  elements.moduleAction.textContent = module.action;
  elements.completeModule.textContent = completed ? "Step explored" : "Mark step explored";
  elements.completeModule.classList.toggle("is-complete", completed);
  elements.completeModule.onclick = () => toggleProgress("modules", module.id);
  elements.loopCaption.textContent = `${module.number} ${module.title}: ${module.summary}`;
}

function renderConcepts() {
  const module = activeModule();
  const concept = activeConcept();
  const summary = progressFor(track, state.progress);
  elements.conceptCount.textContent = `${summary.concepts}/${summary.conceptTotal} explored`;
  elements.conceptList.replaceChildren(...module.concepts.map((conceptId) => {
    const item = conceptById.get(conceptId);
    const explored = includes(state.progress.concepts, item.id);
    const button = create("button", `concept-button ${item.color}${item.id === concept.id ? " is-active" : ""}${explored ? " is-explored" : ""}`);
    button.type = "button";
    button.append(create("span", "concept-category", item.category), create("strong", null, item.title), create("small", null, explored ? "explored" : "open"));
    button.addEventListener("click", () => setConcept(item.id));
    return button;
  }));

  const explored = includes(state.progress.concepts, concept.id);
  const definition = create("section", "detail-block");
  definition.append(create("p", "detail-label", "Definition"), create("p", "detail-definition", concept.definition));
  const why = create("section", "detail-block");
  why.append(create("p", "detail-label", "Why it matters"), create("p", null, concept.why));
  const applied = create("section", "detail-block application");
  applied.append(create("p", "detail-label", "In MarketGlass"), create("p", null, concept.application));
  const prompt = create("section", "detail-block prompt");
  prompt.append(create("p", "detail-label", "Carry this question"), create("p", null, concept.prompt));
  const action = create("button", `concept-completion${explored ? " is-complete" : ""}`, explored ? "Concept explored" : "Mark concept explored");
  action.type = "button";
  action.addEventListener("click", () => toggleProgress("concepts", concept.id));
  elements.conceptDetail.replaceChildren(
    create("div", "detail-heading", concept.title),
    definition,
    why,
    applied,
    prompt,
    action
  );
}

function renderPractice() {
  const scenario = activeScenario();
  elements.scenarioSelect.replaceChildren(...track.scenarios.map((item) => new Option(item.label, item.id)));
  elements.scenarioSelect.value = scenario.id;
  elements.scenarioTime.textContent = scenario.timestamp;
  elements.scenarioLabel.textContent = scenario.label;
  elements.scenarioQuestion.textContent = scenario.question;
  elements.scenarioSignals.replaceChildren(...scenario.signals.map(([label, value, tone]) => {
    const signal = create("div", `signal ${tone}`);
    signal.append(create("span", null, label), create("strong", null, value));
    return signal;
  }));
  elements.scenarioChoices.replaceChildren(...scenario.choices.map((choice) => {
    const selected = choice.id === state.selectedChoiceId;
    const button = create("button", `choice-button${selected ? " is-selected" : ""}`);
    button.type = "button";
    button.textContent = choice.label;
    button.addEventListener("click", () => {
      state.selectedChoiceId = choice.id;
      renderPractice();
    });
    return button;
  }));
  const choice = scenario.choices.find((item) => item.id === state.selectedChoiceId);
  if (!choice) {
    elements.practiceFeedback.replaceChildren(
      create("p", "eyebrow", "Reasoning check"),
      create("h3", null, "Keep the next step proportional to the evidence."),
      create("p", null, "A responsible answer separates what the snapshot describes from what it cannot establish yet.")
    );
    elements.practiceFeedback.className = "practice-feedback";
    return;
  }
  elements.practiceFeedback.className = `practice-feedback ${choice.tone}`;
  elements.practiceFeedback.replaceChildren(
    create("p", "eyebrow", choice.tone === "good" ? "A useful next move" : "A caution"),
    create("h3", null, choice.tone === "good" ? "Keep the claim inspectable." : "Pause before collapsing uncertainty."),
    create("p", null, choice.feedback)
  );
}

function renderReflection() {
  const module = activeModule();
  elements.reflectionList.replaceChildren(...module.concepts.map((conceptId) => {
    const concept = conceptById.get(conceptId);
    const row = create("article", "reflection-item");
    row.append(create("span", `reflection-marker ${concept.color}`, ""), create("strong", null, concept.title), create("p", null, concept.prompt));
    return row;
  }));
}

function drawLoop() {
  const canvas = elements.loopCanvas;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(280, Math.floor(rect.width * ratio));
  const height = Math.max(190, Math.floor(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const context = canvas.getContext("2d");
  if (!context) return;
  const cssWidth = width / ratio;
  const cssHeight = height / ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, cssWidth, cssHeight);
  context.fillStyle = "#10221c";
  context.fillRect(0, 0, cssWidth, cssHeight);
  const pad = Math.max(26, cssWidth * 0.07);
  const gap = (cssWidth - pad * 2) / (track.modules.length - 1);
  const y = cssHeight * 0.48;
  const activeIndex = track.modules.findIndex((module) => module.id === activeModule().id);
  context.strokeStyle = "#355c4f";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(pad, y);
  context.lineTo(cssWidth - pad, y);
  context.stroke();
  loopNodes = track.modules.map((module, index) => ({ module, x: pad + gap * index, y }));
  loopNodes.forEach(({ module, x, y: nodeY }, index) => {
    const isActive = index === activeIndex;
    const isComplete = includes(state.progress.modules, module.id);
    context.fillStyle = isActive ? "#64d6bd" : isComplete ? "#f3c76b" : "#d6e2db";
    context.beginPath();
    context.arc(x, nodeY, isActive ? 18 : 13, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#10221c";
    context.font = "700 11px ui-sans-serif, system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(module.number, x, nodeY + 0.5);
    context.fillStyle = isActive ? "#f3faf6" : "#aabbb2";
    context.font = "600 12px ui-sans-serif, system-ui, sans-serif";
    context.textBaseline = "alphabetic";
    const lines = module.title.replace(" the ", " ").split(" ");
    const firstLine = lines.slice(0, Math.ceil(lines.length / 2)).join(" ");
    const secondLine = lines.slice(Math.ceil(lines.length / 2)).join(" ");
    context.fillText(firstLine, x, nodeY + 47);
    if (secondLine) context.fillText(secondLine, x, nodeY + 63);
  });
  context.textAlign = "left";
  context.fillStyle = "#74bda9";
  context.font = "600 12px ui-sans-serif, system-ui, sans-serif";
  context.fillText("Evidence is carried forward; certainty is not.", pad, Math.max(24, y - 55));
}

function render() {
  renderHeader();
  renderProjects();
  renderModules();
  renderLesson();
  renderConcepts();
  renderPractice();
  renderReflection();
  requestAnimationFrame(drawLoop);
}

elements.scenarioSelect.addEventListener("change", (event) => {
  state.activeScenarioId = event.target.value;
  state.selectedChoiceId = null;
  renderPractice();
});

elements.loopCanvas.addEventListener("pointerdown", (event) => {
  const rect = elements.loopCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const selected = loopNodes.find((node) => Math.hypot(node.x - x, node.y - y) <= 28);
  if (selected) setModule(selected.module.id);
});

new ResizeObserver(() => drawLoop()).observe(elements.loopCanvas);
render();
