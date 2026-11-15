// ------------------------------------------------------------
// utils.js – constants & helper functions.
// All functions are global (no module system): index.html loads
// the scripts in the correct order via Babel standalone.
// ------------------------------------------------------------

const LEVELS = ["N5", "N4", "N3", "N2", "N1"];
const DATA_DIR = "js/data";

// All accepted answers of a question.
// ("answer" may be a single string or an array of alternatives.)
function getAnswers(question) {
  return Array.isArray(question.answer) ? question.answer : [question.answer];
}

// Check a given answer (whitespace-tolerant).
function isCorrectAnswer(question, given) {
  const g = String(given).trim();
  return getAnswers(question).some((a) => String(a).trim() === g);
}
// "multi" questions: correct only if the chosen set exactly matches
// the accepted answers (no more, no less).
function isCorrectMulti(question, givenList) {
  const answers = getAnswers(question);
  const given = (givenList || []).map((s) => String(s).trim());
  return (
    given.length === answers.length &&
    answers.every((a) => given.includes(String(a).trim()))
  );
}
// Unified answer check: dispatches by question type.
// (mc / cloze / order compare strings, multi compares sets.)
function checkAnswer(question, given) {
  if (question.type === "multi") return isCorrectMulti(question, given);
  return isCorrectAnswer(question, given);
}
// Fisher–Yates shuffle – returns a shuffled copy of the array.
function shuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Validate a raw question object: incomplete questions are skipped
// with a console warning instead of breaking the session.
function sanitizeQuestion(raw, moduleId, index) {
  const where = moduleId + " #" + (index + 1);
  if (
    !raw ||
    typeof raw !== "object" ||
    !raw.type ||
    !raw.level ||
    !raw.question ||
    raw.answer === undefined
  ) {
    console.warn("Question skipped (" + where + "): incomplete.", raw);
    return null;
  }
  if (
    (raw.type === "mc" || raw.type === "cloze" || raw.type === "multi") &&
    !Array.isArray(raw.options)
  ) {
    {
      console.warn("Question skipped (" + where + "): missing options.", raw);
      return null;
    }
    const q = { ...raw, module: moduleId };
    if (!q.id) q.id = moduleId + "-" + String(index + 1).padStart(3, "0");
    return q;
  }

  // Load the module registry (js/data/index.json) plus every module file.
  // Missing module files are ignored on purpose: modules can be added
  // later without touching any loader logic.
  async function loadAllQuestions() {
    const indexRes = await fetch(DATA_DIR + "/index.json");
    if (!indexRes.ok) {
      throw new Error(
        "js/data/index.json could not be loaded (HTTP " + indexRes.status + ")",
      );
    }
    const moduleIndex = await indexRes.json();

    const ids = Object.keys(moduleIndex);
    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(DATA_DIR + "/" + id + ".json").then((res) => {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        }),
      ),
    );

    const questions = [];
    results.forEach((result, i) => {
      const id = ids[i];
      if (result.status === "fulfilled") {
        result.value.forEach((raw, n) => {
          const q = sanitizeQuestion(raw, id, n);
          if (q) questions.push(q);
        });
      } else {
        console.warn(
          "Module '" + id + "': file missing or broken – skipped.",
          result.reason && result.reason.message,
        );
      }
    });

    return { moduleIndex, questions };
  }

  // Apply the level + module filter.
  function filterQuestions(questions, filter) {
    return questions.filter(
      (q) => filter.levels[q.level] && filter.modules[q.module],
    );
  }

  // Prepare a session: shuffle the question order and, per question,
  // shuffle the answer options (copies, originals stay untouched).
  function prepareSession(questions) {
    return shuffle(questions).map((q) =>
      Array.isArray(q.options) ? { ...q, options: shuffle(q.options) } : q,
    );
  }

  // Display name of a module (falls back to its id).
  function moduleLabel(moduleIndex, id) {
    return (moduleIndex && moduleIndex[id]) || id;
  }

  // German plural for the start screen ("1 Frage" / "12 Fragen").
  function pluralQuestions(n) {
    return n === 1 ? "1 Frage" : n + " Fragen";
  }
}
