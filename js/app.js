// ------------------------------------------------------------
// app.js – root component: loads all questions, holds the filter
// state, the per-round limit, and switches between phases
// (start | quiz | summary).
// ------------------------------------------------------------

function Header() {
  return (
    <header className="site-header">
      <div className="logo">
        <span className="logo-disc" aria-hidden="true"></span>
        <span className="logo-text">
          日本語 <em>lernen</em>
        </span>
      </div>
      <p className="logo-sub">
        Interaktive Übungen – ohne Account, komplett im Browser.
      </p>
    </header>
  );
}

// ------------------------------------------------------------
// LimitPicker – "questions per round": 10 / 20 / all / custom.
// limit === null means "all questions". Invalid custom input
// disables the start button and shows a hint.
// ------------------------------------------------------------
function LimitPicker({ limit, onLimit, custom, onCustom }) {
  const presets = [10, 20];

  function pick(n) {
    onLimit(n);
    onCustom("");
  }

  function onInput(e) {
    const text = e.target.value;
    onCustom(text);
    const n = parseInt(text, 10);
    if (text !== "" && n >= 1) onLimit(n);
  }

  const allActive = custom === "" && limit === null;

  return (
    <div className="filter-group limit-picker">
      <p className="filter-label">Fragen pro Runde</p>
      <div className="chip-row limit-row">
        {presets.map((n) => (
          <button
            key={n}
            type="button"
            className={
              "chip" + (custom === "" && limit === n ? " is-active" : "")
            }
            onClick={() => pick(n)}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          className={"chip" + (allActive ? " is-active" : "")}
          onClick={() => pick(null)}
        >
          Alle
        </button>
        <input
          type="number"
          min="1"
          step="1"
          value={custom}
          onChange={onInput}
          placeholder="Eigene Zahl"
          aria-label="Eigene Anzahl Fragen pro Runde"
          className="limit-input"
        />
      </div>
      {custom !== "" && !(parseInt(custom, 10) >= 1) && (
        <p className="limit-hint">
          Bitte eine Zahl ab 1 eingeben – oder eine Voreinstellung wählen.
        </p>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// StartScreen – filters + limit + start button on the home page.
// ------------------------------------------------------------
function StartScreen({
  data,
  filter,
  onFilterChange,
  levels,
  modules,
  counts,
  filteredCount,
  roundCount,
  limit,
  onLimit,
  custom,
  onCustom,
  startDisabled,
  onStart,
}) {
  return (
    <section className="card start-card">
      <h2>Session zusammenstellen</h2>
      <p className="start-help">
        Wähle Niveau und Module und lege fest, wie viele Fragen pro Runde
        drankommen. Die Fragen werden gemischt und nacheinander gestellt – mit
        Sofort-Feedback und Erklärung.
      </p>
      <FilterPanel
        filter={filter}
        onChange={onFilterChange}
        levels={levels}
        modules={modules}
        moduleIndex={data.moduleIndex}
        counts={counts}
      />
      <LimitPicker
        limit={limit}
        onLimit={onLimit}
        custom={custom}
        onCustom={onCustom}
      />
      <div className="start-actions">
        <p className={"start-count" + (filteredCount === 0 ? " is-empty" : "")}>
          {filteredCount === 0
            ? "Keine Fragen für diese Auswahl"
            : "Runde: " +
              pluralQuestions(roundCount) +
              (roundCount < filteredCount
                ? " (aus " + filteredCount + " verfügbaren)"
                : "")}
        </p>
        <button
          type="button"
          className="btn btn-primary btn-big"
          disabled={startDisabled}
          onClick={onStart}
        >
          Session starten
        </button>
      </div>
    </section>
  );
}

function App() {
  const [data, setData] = React.useState(null); // { moduleIndex, questions }
  const [error, setError] = React.useState(null);
  const [filter, setFilter] = React.useState({ levels: {}, modules: {} });
  const [phase, setPhase] = React.useState("start"); // start | quiz | summary
  const [session, setSession] = React.useState(null); // { questions, results }
  const [limit, setLimit] = React.useState(10); // number or null = all
  const [custom, setCustom] = React.useState(""); // text in the custom input

  React.useEffect(() => {
    loadAllQuestions()
      .then((loaded) => {
        // Default: everything enabled. Levels without questions (N2/N1)
        // stay visible so future content only needs a JSON file.
        const levels = {};
        LEVELS.forEach((l) => (levels[l] = true));
        const modules = {};
        Object.keys(loaded.moduleIndex).forEach((m) => (modules[m] = true));
        setFilter({ levels, modules });
        setData(loaded);
      })
      .catch((err) => setError(err.message || String(err)));
  }, []);

  const filtered = React.useMemo(
    () => (data ? filterQuestions(data.questions, filter) : []),
    [data, filter],
  );

  const counts = React.useMemo(() => {
    const levels = {};
    const modules = {};
    (data ? data.questions : []).forEach((q) => {
      levels[q.level] = (levels[q.level] || 0) + 1;
      modules[q.module] = (modules[q.module] || 0) + 1;
    });
    return { levels, modules };
  }, [data]);

  // Show every level (even empty ones) and every module from the registry.
  const levels = LEVELS;
  const modules = React.useMemo(
    () => (data ? Object.keys(data.moduleIndex) : []),
    [data],
  );

  const customInvalid = custom !== "" && !(parseInt(custom, 10) >= 1);
  const roundCount = limit ? Math.min(limit, filtered.length) : filtered.length;
  const startDisabled = filtered.length === 0 || customInvalid;

  function startSession() {
    const pool = prepareSession(filtered); // shuffle first …
    const questions = limit ? pool.slice(0, limit) : pool; // … then cap
    setSession({ questions, results: null });
    setPhase("quiz");
  }

  function backToStart() {
    setPhase("start");
  }

  function finishSession(results) {
    setSession((prev) => ({ ...prev, results }));
    setPhase("summary");
  }
  // Start a "repeat mistakes" round: only the questions that were
  // answered wrong, shuffled again.
  function repeatMistakes(mistakeQuestions) {
    setSession({ questions: prepareSession(mistakeQuestions), results: null });
    setPhase("quiz");
  }

  return (
    <div className="app">
      <Header />
      <main>
        {error && (
          <div className="card error-card">
            <h2>Fragen konnten nicht geladen werden</h2>
            <p>{error}</p>
          </div>
        )}

        {!data && !error && <p className="loading">Fragen werden geladen …</p>}

        {data && phase === "start" && (
          <StartScreen
            data={data}
            filter={filter}
            onFilterChange={setFilter}
            levels={levels}
            modules={modules}
            counts={counts}
            filteredCount={filtered.length}
            roundCount={roundCount}
            limit={limit}
            onLimit={setLimit}
            custom={custom}
            onCustom={setCustom}
            startDisabled={startDisabled}
            onStart={startSession}
          />
        )}

        {data && phase === "quiz" && session && (
          <Quiz
            questions={session.questions}
            moduleIndex={data.moduleIndex}
            onFinish={finishSession}
            onQuit={backToStart}
          />
        )}

        {data && phase === "summary" && session && session.results && (
          <Summary
            results={session.results}
            moduleIndex={data.moduleIndex}
            onRepeatMistakes={repeatMistakes}
            onRestart={startSession}
            onHome={backToStart}
          />
        )}
      </main>
      <footer className="site-footer">
        <p>
          Läuft komplett im Browser – kein Account, keine Datenbank, kein
          Tracking.
        </p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
