const MARKETGLASS_CONCEPTS = Object.freeze([
  {
    id: "market-state",
    title: "Market state",
    category: "Observe",
    color: "teal",
    definition: "A market state is a time-stamped description of conditions, not a prediction. It combines price movement with participation, volatility, concentration, volume, and what is known about the data.",
    why: "The same price move can mean different things when breadth, equal weight, or volatility tell a different story.",
    application: "MarketGlass locks SPY, RSP, breadth, sector behavior, volatility context, and the options snapshot to one replay cursor so comparison starts from the same moment.",
    prompt: "At a selected timestamp, ask what is moving with price and what is failing to confirm it."
  },
  {
    id: "breadth",
    title: "Breadth and participation",
    category: "Observe",
    color: "coral",
    definition: "Breadth describes how widely a move is shared. It can be expressed with advancing versus declining constituents, positive breadth, equal-weight relative performance, or up/down volume.",
    why: "Breadth is descriptive. It can reveal a narrow move without proving that a reversal will follow.",
    application: "The MarketGlass demo places SPY beside RSP and a clearly labeled synthetic participation proxy. The source label prevents a learner from mistaking it for an official exchange internal.",
    prompt: "Compare the cap-weighted return with equal weight and positive breadth before attaching a narrative."
  },
  {
    id: "concentration",
    title: "Concentration",
    category: "Observe",
    color: "gold",
    definition: "Concentration asks how much of an index move comes from a small set of names or sectors. It is a lens on composition, not a universal risk score.",
    why: "An index can rise while leadership becomes less broad. That distinction matters for describing the state honestly.",
    application: "MarketGlass shows top-10 contribution and sector dispersion beside the replayed price path, while marking the demo membership inputs as synthetic.",
    prompt: "Notice whether a price move is shared broadly or increasingly dependent on a small leadership group."
  },
  {
    id: "horizon",
    title: "Volatility has a horizon",
    category: "Name",
    color: "blue",
    definition: "Realized volatility summarizes observed return dispersion over a chosen window. Implied volatility is inferred from option prices for a stated expiry. VIX-family measures have their own construction and horizon.",
    why: "Numbers that share the word volatility are not automatically comparable. Their window, inputs, and model all matter.",
    application: "MarketGlass presents 15-minute realized volatility, VIX context, VIX9D context, and ATM IV together while explicitly warning that their horizons differ.",
    prompt: "Name the horizon and construction before comparing two volatility numbers."
  },
  {
    id: "implied-volatility",
    title: "Implied volatility",
    category: "Name",
    color: "blue",
    definition: "Implied volatility is the volatility input that makes a chosen option-pricing model match an observed option price, subject to its assumptions and numerical limits.",
    why: "It is not a directional forecast or a universal fear meter. Near expiry and near intrinsic bounds can make the inversion unstable.",
    application: "MarketGlass validates basic no-arbitrage bounds, marks unstable IV as unavailable, and distinguishes synthetic, vendor, and model provenance.",
    prompt: "Before reading an IV change as a message, inspect quote quality, expiry, model assumptions, and source."
  },
  {
    id: "surface-quality",
    title: "Surface quality",
    category: "Name",
    color: "gold",
    definition: "A volatility surface is a view of option values across strike and expiry. A mesh is a visual aid unless its raw quotes, gaps, calendar behavior, and interpolation method are understood.",
    why: "A smooth picture can create unjustified confidence when wings are sparse or bid-ask spreads are wide.",
    application: "MarketGlass shows raw contract points, excludes non-valid quotes from the mesh, reports coverage and calendar-total-variance flags, and does not claim an arbitrage-free SVI fit.",
    prompt: "Ask which points actually shape the mesh and which points are only visible as warnings."
  },
  {
    id: "gamma-ambiguity",
    title: "Gamma is assumption-sensitive",
    category: "Name",
    color: "coral",
    definition: "Open interest and option gamma can produce a magnitude by strike, but open interest does not disclose who owns the contract or the dealer's hedge direction.",
    why: "A signed dealer-gamma story cannot be observed from open interest alone.",
    application: "MarketGlass provides unsigned magnitude and alternate sign scenarios, with the assumption written beside every result rather than hidden in a headline.",
    prompt: "Separate what the chain reports from the position-sign convention a calculation assumes."
  },
  {
    id: "hypothesis",
    title: "A hypothesis is testable language",
    category: "Test",
    color: "teal",
    definition: "A testable market hypothesis states observable conditions, a future target, a horizon, and the data used to evaluate it. It is more specific than a feeling about a chart.",
    why: "Writing the rule before looking at the answer makes the selection and target available for critique.",
    application: "MarketGlass turns a selected replay interval into editable conditions, then displays the compiled logic before the chronological experiment runs.",
    prompt: "Describe what would have been observable at the decision time and what will be measured afterward."
  },
  {
    id: "holdout",
    title: "Chronology, leakage, and holdout",
    category: "Test",
    color: "teal",
    definition: "A time-series test must respect order. Leakage occurs when information from the future influences the rule, the target, the split, or the interpretation.",
    why: "A shuffled or repeatedly tuned result can look stronger than it would have been in real time.",
    application: "MarketGlass uses chronological train/holdout partitions, purges the forward horizon before holdout, spaces events, keeps analogues past-only, and shows a related-test warning.",
    prompt: "Ask where the future could have entered the workflow, including through repeated exploration."
  },
  {
    id: "provenance",
    title: "Provenance",
    category: "Record",
    color: "blue",
    definition: "Provenance records where a value came from, when it was retrieved, which market time it represents, what calculation changed it, and whether it is synthetic, recorded, or provider data.",
    why: "A chart without source and freshness context can invite accidental comparison of incompatible values.",
    application: "Every MarketGlass session carries provenance and a content hash. Demo and Recorded are usable now; Free and Premium remain visibly unavailable instead of being simulated as live feeds.",
    prompt: "Before reusing a number, write down its source, timestamp, license boundary, and calculation path."
  },
  {
    id: "falsifier",
    title: "Falsifier",
    category: "Record",
    color: "coral",
    definition: "A falsifier is a condition that would weaken a note, model, or interpretation. It makes revision part of the research process rather than an afterthought.",
    why: "A one-sided notebook can preserve reasons to believe while losing the conditions that should change the view.",
    application: "MarketGlass keeps the original evidence ledger and adds optional structured monitors tied to the current market state or experiment.",
    prompt: "Write one observable condition that would make you revisit the current interpretation."
  }
]);

const MARKETGLASS_MODULES = Object.freeze([
  {
    id: "observe",
    number: "01",
    title: "Observe the state",
    summary: "Start with a synchronized moment before assigning meaning to price.",
    lesson: "A chart becomes a market-state observation when its related evidence shares a clock. First inspect price, equal weight, breadth, concentration, sectors, volume, and volatility at the same recorded time.",
    concepts: ["market-state", "breadth", "concentration"],
    action: "Use Market state in MarketGlass. Replay to a moment, compare two timestamps, then write only what the panels show."
  },
  {
    id: "name",
    number: "02",
    title: "Name the uncertainty",
    summary: "Define the option and volatility inputs before interpreting a shape.",
    lesson: "The options chain is evidence, not a story generator. Quote status, expiry, midpoint, exercise style, volatility horizon, and the source of Greeks change what a surface can responsibly say.",
    concepts: ["horizon", "implied-volatility", "surface-quality", "gamma-ambiguity"],
    action: "Open Options lab. Inspect raw contracts first, then use the IV, 0DTE, Gamma, and P&L views with the assumptions visible."
  },
  {
    id: "test",
    number: "03",
    title: "Test an observation",
    summary: "Turn a visible pattern into a rule that keeps time facing forward.",
    lesson: "A visual observation is a starting point. Make conditions explicit, choose an outcome and horizon, protect the holdout, space overlapping events, and keep the whole distribution beside the mean.",
    concepts: ["hypothesis", "holdout"],
    action: "Select an interval in Market state, choose Formalize observation, inspect the compiled logic, and run the chronological test only after the wording is acceptable."
  },
  {
    id: "record",
    number: "04",
    title: "Record and revise",
    summary: "Keep the source, caveat, counterevidence, and condition for changing your mind.",
    lesson: "A research note is more useful when a later reader can find the linked market state, data source, experiment, supportive and challenging evidence, and falsifiers. Completion is not truth; it is a prompt to check what is missing.",
    concepts: ["provenance", "falsifier"],
    action: "Use Research notebook to link evidence and falsifiers to a selected moment or experiment. Keep Demo, Recorded, Free, and Premium labels intact."
  }
]);

const MARKETGLASS_SCENARIOS = Object.freeze([
  {
    id: "narrow-rally",
    label: "Narrow rally with rising short-dated IV",
    timestamp: "13:30 ET",
    signals: [
      ["SPY", "+1.3%", "teal"],
      ["RSP minus SPY", "-0.7pp", "coral"],
      ["Positive breadth", "50.5%", "gold"],
      ["ATM IV", "+1.7pp", "blue"]
    ],
    question: "Which next step makes the observation more useful without pretending it is a signal?",
    choices: [
      { id: "price", label: "Call the move bullish because SPY is higher", feedback: "Price direction is one observation, but it leaves participation and uncertainty unexplained. This is a narrative, not a testable rule.", tone: "caution" },
      { id: "state", label: "Describe the participation and volatility divergence at this timestamp", feedback: "Good first move. The state can now be linked to raw data and compared with other moments without claiming a trade outcome.", tone: "good" },
      { id: "dealer", label: "Infer a dealer-gamma direction from open interest", feedback: "Open interest does not identify the holder or dealer side. Keep any sign convention as an explicit scenario instead.", tone: "caution" }
    ]
  },
  {
    id: "surface-gap",
    label: "Sparse wing and a wide bid-ask quote",
    timestamp: "14:00 ET",
    signals: [
      ["Raw contracts", "some wide", "coral"],
      ["Mesh coverage", "partial", "gold"],
      ["Calendar check", "review", "blue"],
      ["Model", "not SVI", "teal"]
    ],
    question: "What belongs in a responsible interpretation of the surface?",
    choices: [
      { id: "smooth", label: "Trust the smoothest part of the mesh as a precise forecast", feedback: "A smooth mesh can hide sparse or wide-quote inputs. A visual surface is not automatically a fitted or arbitrage-free model.", tone: "caution" },
      { id: "quality", label: "Inspect raw points, quote status, coverage, and calendar flags first", feedback: "Correct. The surface is most useful when its inputs and quality limits remain visible beside the shape.", tone: "good" },
      { id: "ignore", label: "Drop the non-valid contracts without mentioning them", feedback: "Filtering can be appropriate for a mesh, but the excluded quote states still matter to a reader judging confidence in the remaining shape.", tone: "caution" }
    ]
  }
]);

export const TRACKS = Object.freeze([
  Object.freeze({
    id: "marketglass",
    name: "MarketGlass",
    kind: "Quantitative market laboratory",
    status: "Available",
    description: "Learn how a synchronized market state becomes an explicit, provenance-aware research workflow.",
    accent: "teal",
    modules: MARKETGLASS_MODULES,
    concepts: MARKETGLASS_CONCEPTS,
    scenarios: MARKETGLASS_SCENARIOS
  })
]);

export function getTrack(id = "marketglass") {
  return TRACKS.find((track) => track.id === id) ?? TRACKS[0];
}

export function validateTrack(track) {
  const errors = [];
  const conceptIds = new Set();
  for (const concept of track?.concepts ?? []) {
    if (!concept.id || conceptIds.has(concept.id)) errors.push(`Invalid or duplicate concept id: ${concept.id ?? "missing"}`);
    conceptIds.add(concept.id);
    for (const field of ["title", "definition", "why", "application", "prompt"]) {
      if (typeof concept[field] !== "string" || !concept[field].trim()) errors.push(`Concept ${concept.id} is missing ${field}.`);
    }
  }
  const moduleIds = new Set();
  for (const module of track?.modules ?? []) {
    if (!module.id || moduleIds.has(module.id)) errors.push(`Invalid or duplicate module id: ${module.id ?? "missing"}`);
    moduleIds.add(module.id);
    for (const conceptId of module.concepts ?? []) {
      if (!conceptIds.has(conceptId)) errors.push(`Module ${module.id} references unknown concept ${conceptId}.`);
    }
  }
  for (const scenario of track?.scenarios ?? []) {
    if (!scenario.id || !Array.isArray(scenario.choices) || scenario.choices.length < 2) errors.push(`Scenario ${scenario.id ?? "missing"} needs choices.`);
    if (!(scenario.choices ?? []).some((choice) => choice.tone === "good")) errors.push(`Scenario ${scenario.id ?? "missing"} needs a constructive choice.`);
  }
  return { valid: errors.length === 0, errors };
}

export function progressFor(track, progress = {}) {
  const completedModules = new Set(progress.modules ?? []);
  const exploredConcepts = new Set(progress.concepts ?? []);
  return {
    modules: track.modules.filter((module) => completedModules.has(module.id)).length,
    moduleTotal: track.modules.length,
    concepts: track.concepts.filter((concept) => exploredConcepts.has(concept.id)).length,
    conceptTotal: track.concepts.length
  };
}
