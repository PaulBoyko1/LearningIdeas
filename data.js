export const concepts = Object.freeze([
  {
    id: "boundaries",
    label: "Boundaries",
    summary: "Name the system edge: what is known, allowed, measured, and deliberately excluded.",
    color: "#d85c39",
    position: [0.16, 0.27]
  },
  {
    id: "feedback",
    label: "Feedback loops",
    summary: "Use the result of an action to improve the next action instead of repeating a fixed plan.",
    color: "#008a8d",
    position: [0.42, 0.18]
  },
  {
    id: "state",
    label: "State and memory",
    summary: "Make the current situation explicit so future behavior is understandable and recoverable.",
    color: "#4b73c2",
    position: [0.72, 0.23]
  },
  {
    id: "causality",
    label: "Causality and time",
    summary: "Protect the direction of time: decisions must not learn from information that arrives later.",
    color: "#b55b96",
    position: [0.24, 0.62]
  },
  {
    id: "uncertainty",
    label: "Uncertainty",
    summary: "Represent alternatives, confidence, and the conditions that would change a conclusion.",
    color: "#c08013",
    position: [0.51, 0.5]
  },
  {
    id: "validation",
    label: "Validation",
    summary: "Ask a model to earn trust through a deliberate test, baseline, or independent check.",
    color: "#248055",
    position: [0.8, 0.58]
  },
  {
    id: "shift",
    label: "Change and shift",
    summary: "Expect the environment to move, then measure whether a system still works under new conditions.",
    color: "#7b5cc7",
    position: [0.33, 0.86]
  },
  {
    id: "reproducibility",
    label: "Reproducibility",
    summary: "Make a result rerunnable through explicit data contracts, versions, seeds, and tests.",
    color: "#4e687f",
    position: [0.7, 0.83]
  }
]);

export const projects = Object.freeze([
  {
    id: "flightstack",
    title: "FlightStack",
    category: "Control and simulation",
    tagline: "A simulation-first attitude-control laboratory.",
    work: "It combines quaternion attitude math, a cascaded controller, rigid-body dynamics, sensors, estimation, HIL framing, and a C++ control core.",
    idea: "Correct frame conventions and feedback behavior must be verified before a control loop reaches hardware.",
    use: "Use it to explore a closed control loop, compare estimator behavior, or create golden tests before embedded implementation.",
    helps: "It catches frame mistakes, unstable gain choices, saturation problems, and unsafe assumptions while the experiment is still simulated.",
    evidence: "Non-identity attitude targets, Python/C++ parity tests, deterministic sensors, and explicit safety documentation.",
    conceptIds: ["boundaries", "feedback", "state", "validation", "reproducibility"],
    link: "https://github.com/PaulBoyko1/FlightStack/tree/codex/flightstack-safety-hardening"
  },
  {
    id: "forgesight",
    title: "ForgeSight",
    category: "Industrial vision",
    tagline: "Normal-only visual anomaly detection with shift in view.",
    work: "It creates a transparent PatchMemory baseline from defect-free images, calibrates on validation data, reports image and pixel metrics, and exposes portable inference.",
    idea: "A detector is only useful when its threshold, latency, memory use, and robustness under acquisition change are made visible.",
    use: "Use it as a research starting point for inspection systems, a benchmark harness, or a case study in normal-only anomaly detection.",
    helps: "It separates threshold selection from testing and makes distribution shift an explicit deployment question.",
    evidence: "Manifest discovery, validation-only calibration, shift-group helpers, checkpoints, API contracts, and systems benchmarks.",
    conceptIds: ["boundaries", "state", "validation", "shift", "reproducibility"],
    link: "https://github.com/PaulBoyko1/ForgeSight/tree/codex/forgesight-hardening"
  },
  {
    id: "microalpha",
    title: "MicroAlpha",
    category: "Market microstructure research",
    tagline: "Causal order-book research with leakage-aware evaluation.",
    work: "It validates LOBSTER-format events, builds causal order-book features, creates forward labels, and evaluates baselines using purged chronological walk-forward splits.",
    idea: "A predictive result is not credible unless the feature timeline, label horizon, and execution assumptions are separated and inspectable.",
    use: "Use it to study event data, construct rigorous time-series baselines, or teach why a promising backtest can disappear after leakage is removed.",
    helps: "It protects against future information entering features, train/test overlap, and confusing predictive metrics with economic outcomes.",
    evidence: "Session-aware state resets, label purges, logistic and majority baselines, and explicit research contracts.",
    conceptIds: ["boundaries", "causality", "uncertainty", "validation", "reproducibility"],
    link: "https://github.com/PaulBoyko1/MicroAlpha/tree/codex/microalpha-hardening"
  },
  {
    id: "jobos",
    title: "JobOS",
    category: "Personal operations",
    tagline: "A local-first operating system for a job search.",
    work: "It stores applications, priorities, next actions, and append-only events in one SQLite database with an explicit workflow.",
    idea: "A recurring decision process improves when state, valid transitions, and the next concrete action are all visible.",
    use: "Use it to manage a thoughtful job search, or as a small reference for domain modeling, SQLite design, and optimistic concurrency.",
    helps: "It prevents forgotten follow-ups, illegal workflow jumps, stale updates, and the quiet loss of context across scattered tools.",
    evidence: "State transitions, due-action rules, version checks, activity history, daily dashboard, and focused tests.",
    conceptIds: ["boundaries", "feedback", "state", "validation", "reproducibility"],
    link: "https://github.com/PaulBoyko1/JobOS/tree/codex/jobos-foundation"
  },
  {
    id: "marketglass",
    title: "MarketGlass",
    category: "Research reasoning",
    tagline: "An offline workbench for evidence-first market research.",
    work: "It models scenarios, weighted returns, supporting and challenging evidence, confidence, and concrete falsifiers in local browser storage.",
    idea: "A thesis should show its uncertainty and opposing evidence instead of hiding them behind one compelling story.",
    use: "Use it to structure a research note, practice scenario thinking, or learn how evidence type changes the strength of a conclusion.",
    helps: "It reduces overconfidence, makes assumptions inspectable, and creates visible conditions for revising a view.",
    evidence: "Probability checks, an evidence ledger, falsifiers, local persistence, and pure tested reasoning logic.",
    conceptIds: ["state", "uncertainty", "validation", "reproducibility"],
    link: "https://github.com/PaulBoyko1/MarketGlass/tree/codex/marketglass-foundation"
  },
  {
    id: "physicalalpha",
    title: "PhysicalAlpha",
    category: "Physics-informed modeling",
    tagline: "A leakage-aware damped-oscillator modeling lab.",
    work: "It simulates a physical oscillator with RK4, makes seeded observations, fits an interpretable parameter grid, and evaluates against a later holdout window.",
    idea: "A model earns trust when its assumptions are explicit and it beats a simpler baseline on data it did not select against.",
    use: "Use it to learn numerical integration, physics-informed modeling, chronological evaluation, and baseline comparison.",
    helps: "It prevents future observations from tuning the fit and makes a numerical result reproducible instead of merely impressive.",
    evidence: "Typed parameter validation, full timestamp-order checks, seeded noise, holdout RMSE, CLI output, and strict CI.",
    conceptIds: ["feedback", "causality", "uncertainty", "validation", "reproducibility"],
    link: "https://github.com/PaulBoyko1/PhysicalAlpha/tree/codex/physicalalpha-foundation"
  }
]);

export const lessons = Object.freeze([
  {
    number: "01",
    title: "Start by drawing the boundary",
    premise: "Before you improve a system, say what belongs inside it, what stays outside it, and which assumptions need a test.",
    question: "What could quietly enter your decision even though it should be excluded?",
    practice: "Look for a boundary in the six projects: a coordinate frame, a normal-only training set, a legal workflow transition, or a protected holdout.",
    conceptIds: ["boundaries"],
    projectIds: ["flightstack", "forgesight", "microalpha", "jobos"]
  },
  {
    number: "02",
    title: "Make state visible",
    premise: "Systems become easier to trust when their current condition is explicit rather than buried in a person, a process, or a transient variable.",
    question: "If you returned tomorrow, what would you need to know before taking the next action?",
    practice: "Compare JobOS application states with the memory bank in ForgeSight and the evidence ledger in MarketGlass.",
    conceptIds: ["state", "reproducibility"],
    projectIds: ["jobos", "forgesight", "marketglass"]
  },
  {
    number: "03",
    title: "Protect the direction of time",
    premise: "A future outcome can be a label for evaluation, but it cannot be a hidden ingredient in a present decision.",
    question: "Which information is available at the moment a decision is actually made?",
    practice: "Trace MicroAlpha's forward labels and PhysicalAlpha's holdout window. Both make future information useful for testing, not for tuning.",
    conceptIds: ["causality", "reproducibility"],
    projectIds: ["microalpha", "physicalalpha"]
  },
  {
    number: "04",
    title: "Keep uncertainty on the page",
    premise: "Confidence is not certainty. A strong model records alternatives, contradictory evidence, and the observations that would require revision.",
    question: "What would have to be true for the opposite conclusion to win?",
    practice: "Use MarketGlass scenarios and falsifiers as a pattern for writing a claim that can be changed by new evidence.",
    conceptIds: ["uncertainty"],
    projectIds: ["marketglass", "microalpha", "physicalalpha"]
  },
  {
    number: "05",
    title: "Let a baseline challenge the story",
    premise: "Complexity is useful only when it performs better than a simpler alternative under the same honest evaluation.",
    question: "What is the simplest comparison that your proposed system should beat?",
    practice: "Compare PhysicalAlpha with persistence, MicroAlpha with majority prediction, and ForgeSight with transparent normal-memory scoring.",
    conceptIds: ["validation"],
    projectIds: ["forgesight", "microalpha", "physicalalpha"]
  },
  {
    number: "06",
    title: "Close the loop responsibly",
    premise: "A result becomes a system when it can observe, act, check the result, and adapt while honoring its constraints.",
    question: "Where does feedback improve the next decision, and where should a safety boundary stop it?",
    practice: "FlightStack makes the loop physical, JobOS makes it operational, and all six projects use tests to keep learning accountable.",
    conceptIds: ["feedback", "shift", "validation"],
    projectIds: ["flightstack", "jobos", "forgesight", "marketglass"]
  }
]);

export const definitions = Object.freeze([
  {
    term: "Baseline",
    definition: "A simpler reference method used to test whether added complexity earns its keep.",
    applies: "PhysicalAlpha compares its fitted oscillator with persistence; MicroAlpha begins with majority prediction.",
    conceptIds: ["validation"],
    projectIds: ["physicalalpha", "microalpha"]
  },
  {
    term: "Calibration",
    definition: "Choosing how a score becomes a decision using data that is separate from final testing.",
    applies: "ForgeSight calibrates a threshold on normal validation images rather than test labels.",
    conceptIds: ["validation"],
    projectIds: ["forgesight"]
  },
  {
    term: "Causal feature",
    definition: "A feature computed only from information that existed at the decision time.",
    applies: "MicroAlpha builds order-book features before separate forward labels are created.",
    conceptIds: ["causality"],
    projectIds: ["microalpha"]
  },
  {
    term: "Distribution shift",
    definition: "A change in the data-generating environment that can make prior performance unreliable.",
    applies: "ForgeSight treats lighting and acquisition changes as a measurable inspection risk.",
    conceptIds: ["shift"],
    projectIds: ["forgesight"]
  },
  {
    term: "Evidence ledger",
    definition: "A record of claims with their source, type, direction, and confidence.",
    applies: "MarketGlass places supporting and challenging evidence beside each other.",
    conceptIds: ["state", "uncertainty"],
    projectIds: ["marketglass"]
  },
  {
    term: "Falsifier",
    definition: "An observation that would materially weaken or invalidate a working claim.",
    applies: "MarketGlass asks researchers to write observable conditions that would change their thesis.",
    conceptIds: ["uncertainty", "validation"],
    projectIds: ["marketglass"]
  },
  {
    term: "Feedback loop",
    definition: "A process where an output is measured and used to alter later behavior.",
    applies: "FlightStack compares target and measured attitude; JobOS surfaces overdue actions for the next decision.",
    conceptIds: ["feedback"],
    projectIds: ["flightstack", "jobos"]
  },
  {
    term: "Holdout",
    definition: "A later or separate set of observations kept out of fitting and selection until evaluation.",
    applies: "PhysicalAlpha fits only on its training window and reports error on untouched later observations.",
    conceptIds: ["causality", "validation"],
    projectIds: ["physicalalpha"]
  },
  {
    term: "Local-first",
    definition: "A design where the primary data and workflow remain on a device the user controls.",
    applies: "JobOS uses a portable SQLite database; MarketGlass persists its workspace in the browser.",
    conceptIds: ["state", "boundaries"],
    projectIds: ["jobos", "marketglass"]
  },
  {
    term: "Optimistic concurrency",
    definition: "A way to prevent a stale update from silently overwriting a newer one.",
    applies: "JobOS requires the current application version when a workflow update is made.",
    conceptIds: ["state", "validation"],
    projectIds: ["jobos"]
  },
  {
    term: "Purge window",
    definition: "A gap between training and test periods that prevents forward labels from overlapping across the split.",
    applies: "MicroAlpha requires a purge at least as long as its prediction horizon.",
    conceptIds: ["causality"],
    projectIds: ["microalpha"]
  },
  {
    term: "Quaternion",
    definition: "A compact representation of 3D orientation that avoids many issues of angle-based rotation composition.",
    applies: "FlightStack uses quaternion error and integration for attitude control.",
    conceptIds: ["boundaries", "feedback"],
    projectIds: ["flightstack"]
  },
  {
    term: "Reproducibility",
    definition: "The ability for someone to rerun a result using explicit inputs, versions, rules, and tests.",
    applies: "All six projects preserve this through contracts, deterministic paths, test suites, or local records.",
    conceptIds: ["reproducibility"],
    projectIds: ["flightstack", "forgesight", "microalpha", "jobos", "marketglass", "physicalalpha"]
  },
  {
    term: "State machine",
    definition: "A model that names valid states and the allowed transitions between them.",
    applies: "JobOS uses one to keep applications moving through a coherent workflow.",
    conceptIds: ["state", "boundaries"],
    projectIds: ["jobos"]
  },
  {
    term: "Validation set",
    definition: "A dataset used to calibrate or choose a method without consuming final test evidence.",
    applies: "ForgeSight uses normal validation images for threshold calibration.",
    conceptIds: ["validation", "boundaries"],
    projectIds: ["forgesight"]
  }
]);
