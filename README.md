# 日本語 – Japanese Learning Site

Interactive homepage for learning Japanese (JLPT N5–N1): multiple-choice
questions with instant feedback, filters by module and level, and a
configurable number of questions per round. Runs entirely in the
browser – no backend, no accounts, no database.

## Tech

- React 18 + Babel Standalone via CDN (no build step, no npm)
- Questions live in JSON files (one per module), fully separate from logic
- Hosting: GitHub Pages (Repo → Settings → Pages → Branch `main`)

## Project structure

- `index.html` – entry point, loads React + Babel from the CDN
- `css/style.css` – all styling
- `js/utils.js` – constants and helpers (loading, shuffling, checking, filtering)
- `js/app.js` – root component, start screen, session control
- `js/components/` – FilterPanel, Quiz, QuestionCard, Summary
- `js/components/renderers/` – one renderer per question type
- `js/data/index.json` – module registry (module id → display name)
- `js/data/<module>.json` – the questions, one file per module

## Adding questions

Questions are plain JSON arrays in `js/data/<module>.json`:

```json
{
  "id": "particles-n5-001",
  "type": "mc",
  "level": "N5",
  "tags": ["topic"],
  "question": "わたし ___ がくせい です。",
  "translation": "I am a student.",
  "options": ["は", "を", "に", "で"],
  "answer": "は",
  "explanation": "は marks the topic of the sentence."
}
```

- type decides which renderer displays the question (currently: mc)
- answer may be an array if several answers are acceptable
- translation is optional; \_\_\_ marks the blank in the prompt
- Required fields: type, level (N5–N1), question, answer, and options for mc/cloze
- To add a question: append an object to the array. To add a module: create the file and register it in js/data/index.json – that's it.
- Incomplete questions are skipped on load (warning in the console).
- Note: user-facing strings (prompts, options, explanations) are German by design – this is a - German-language learning site. All code comments and documentation are English.
