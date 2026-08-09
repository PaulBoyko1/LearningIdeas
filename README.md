# LearningIdeas

LearningIdeas is an interactive, local-first guide to the ideas shared by six flagship engineering projects:

- FlightStack
- ForgeSight
- MicroAlpha
- JobOS
- MarketGlass
- PhysicalAlpha

It is intentionally not a portfolio landing page. The first screen is a paced learning path: one idea at a time, then a visual connection map, a plain-language glossary, and project-specific explanations of how each idea is used and why it helps.

## Learning path

The guide slowly introduces six habits:

1. Draw the boundary before improving a system.
2. Make state visible.
3. Protect the direction of time.
4. Keep uncertainty on the page.
5. Let a baseline challenge the story.
6. Close the loop responsibly.

Each chapter includes a question, a practical application, the relevant concepts, and the projects where the idea becomes concrete.

## What is interactive

- Local-only lesson progress.
- A canvas concept field with keyboard-accessible idea chips.
- Project filtering through an active concept lens and text search.
- A searchable definition atlas.
- Detailed project translations: central idea, practical use, risk reduced, and evidence in the build.
- Direct links to each GitHub repository.

## Why this exists

Technical portfolios often show what was built without helping a reader understand the judgment behind it. LearningIdeas makes that judgment explicit:

- FlightStack connects feedback, frames, simulation, and safety.
- ForgeSight connects anomaly detection with calibration and distribution shift.
- MicroAlpha connects causal features with leakage-aware evaluation.
- JobOS connects state machines with operational accountability.
- MarketGlass connects evidence with uncertainty and falsifiers.
- PhysicalAlpha connects physical assumptions with chronological holdout evaluation.

## Run locally

No package installation is required. Serve the repository from a static HTTP server:

    python -m http.server 8080

Then visit http://localhost:8080.

## Engineering

The interaction helpers are separated into logic.mjs and covered by Node's built-in test runner. GitHub Actions runs syntax checks and behavior tests on Node 20 and Node 22.

## Project status

This foundation is on the codex/learningideas-foundation branch with a draft pull request for review.
