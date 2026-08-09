# LearningIdeas

LearningIdeas is a project-separated interactive learning library for the flagship portfolio. Each project receives its own track so definitions, examples, cautions, and practice remain connected to the system that uses them.

## MarketGlass Track

The first completed track teaches the MarketGlass research loop in four deliberate stages:

1. **Observe the state**: read synchronized price, participation, concentration, sector, and volatility context without immediately turning it into a trade story.
2. **Name the uncertainty**: define implied volatility, surface quality, horizons, and gamma assumptions before interpreting an options view.
3. **Test an observation**: turn a replayed interval into conditions, a future target, a chronology-safe split, and an inspectable distribution.
4. **Record and revise**: preserve provenance, counterevidence, limitations, and falsifiers alongside the linked market state or experiment.

The Concept Atlas is deliberately project-specific. It explains the general idea, why it matters, how MarketGlass applies it, and a question to carry back into the app. The practice lab reinforces evidence-aware next moves rather than rewarding a directional answer. Progress is stored only in the current browser.

## Run Locally

Requires Node.js 20 or newer.

```bash
npm run dev
```

Open [http://127.0.0.1:4175](http://127.0.0.1:4175).

## Verify

```bash
npm run check
npm test
```

The tests validate that the curriculum has no orphaned concepts, each scenario provides a constructive response, and progress is calculated only from the selected project track.

## Structure

- `content.mjs`: project-scoped curriculum data and validation helpers.
- `app.mjs`: interaction, local progress, scenario practice, and the canvas research-loop map.
- `styles.css`: responsive learning-workspace interface.
- `server.mjs`: minimal local static server with safe paths and a restrictive content security policy.

Future projects can be added as their own objects in `content.mjs`, keeping their terminology and applications separate from MarketGlass rather than folding everything into one generic glossary.
