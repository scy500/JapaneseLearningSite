// ------------------------------------------------------------
// utils.js – Konstanten & Hilfsfunktionen
// (globale Funktionen, kein Modul-System – Babel lädt die
//  Dateien über index.html in der richtigen Reihenfolge)
// ------------------------------------------------------------

const LEVELS = ["N5", "N4", "N3"];
const DATA_DIR = "js/data";

// Alle akzeptierten Antworten einer Frage
// ("answer" darf ein String oder ein Array von Alternativen sein)
function getAnswers(question) {
  return Array.isArray(question.answer) ? question.answer : [question.answer];
}

// Antwort prüfen (Whitespace-tolerant)
function isCorrectAnswer(question, given) {
  const g = String(given).trim();
  return getAnswers(question).some((a) => String(a).trim() === g);
}

// Fisher-Yates – mischt eine Kopie des Arrays
function shuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Frage validieren: unvollständige Fragen werden übersprungen (Konsolen-Warnung)
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
    console.warn("Frage übersprungen (" + where + "): unvollständig.", raw);
    return null;
  }
  if (
    (raw.type === "mc" || raw.type === "cloze") &&
    !Array.isArray(raw.options)
  ) {
    console.warn("Frage übersprungen (" + where + "): options fehlt.", raw);
    return null;
  }
  const q = { ...raw, module: moduleId };
  if (!q.id) q.id = moduleId + "-" + String(index + 1).padStart(3, "0");
  return q;
}

// Modul-Verzeichnis (js/data/index.json) + alle Fragen laden.
// Fehlende Modul-Dateien werden ignoriert – so kann jedes Modul
// einfach "später dazugelegt" werden, ohne die Logik zu ändern.
async function loadAllQuestions() {
  const indexRes = await fetch(DATA_DIR + "/index.json");
  if (!indexRes.ok) {
    throw new Error(
      "js/data/index.json konnte nicht geladen werden (HTTP " +
        indexRes.status +
        ")",
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
        "Modul '" +
          id +
          "': Datei fehlt noch oder ist fehlerhaft – wird übersprungen.",
        result.reason && result.reason.message,
      );
    }
  });

  return { moduleIndex, questions };
}

// Fragen gemäß Filter (Niveau + Modul) auswählen
function filterQuestions(questions, filter) {
  return questions.filter(
    (q) => filter.levels[q.level] && filter.modules[q.module],
  );
}

// Session vorbereiten: Fragen-Reihenfolge mischen + Antwortoptionen mischen
function prepareSession(questions) {
  return shuffle(questions).map((q) =>
    Array.isArray(q.options) ? { ...q, options: shuffle(q.options) } : q,
  );
}

// Anzeigename eines Moduls
function moduleLabel(moduleIndex, id) {
  return (moduleIndex && moduleIndex[id]) || id;
}

// "1 Frage" / "12 Fragen"
function pluralQuestions(n) {
  return n === 1 ? "1 Frage" : n + " Fragen";
}
