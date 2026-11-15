// ------------------------------------------------------------
// app.js – Root-Komponente: Laden der Fragen, Filter-Zustand,
// Start-Screen, Übergänge zwischen den Phasen.
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

function StartScreen({
  data,
  filter,
  onFilterChange,
  levels,
  modules,
  counts,
  filteredCount,
  onStart,
}) {
  return (
    <section className="card start-card">
      <h2>Session zusammenstellen</h2>
      <p className="start-help">
        Wähle Niveau und Module. Danach werden die Fragen gemischt und
        nacheinander gestellt – mit Sofort-Feedback und Erklärung.
      </p>
      <FilterPanel
        filter={filter}
        onChange={onFilterChange}
        levels={levels}
        modules={modules}
        moduleIndex={data.moduleIndex}
        counts={counts}
      />
      <div className="start-actions">
        <p className={"start-count" + (filteredCount === 0 ? " is-empty" : "")}>
          {filteredCount > 0
            ? pluralQuestions(filteredCount) + " bereit"
            : "Keine Fragen für diese Auswahl"}
        </p>
        <button
          type="button"
          className="btn btn-primary btn-big"
          disabled={filteredCount === 0}
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

  React.useEffect(() => {
    loadAllQuestions()
      .then((loaded) => {
        // Default: alles Verfügbare aktiv
        const levels = {};
        const modules = {};
        loaded.questions.forEach((q) => {
          levels[q.level] = true;
          modules[q.module] = true;
        });
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

  const availableLevels = React.useMemo(() => {
    if (!data) return [];
    return LEVELS.filter((l) => data.questions.some((q) => q.level === l));
  }, [data]);

  const availableModules = React.useMemo(() => {
    if (!data) return [];
    return Object.keys(data.moduleIndex).filter(
      (id) => (counts.modules[id] || 0) > 0,
    );
  }, [data, counts]);

  function startSession() {
    setSession({ questions: prepareSession(filtered), results: null });
    setPhase("quiz");
  }

  function backToStart() {
    setPhase("start");
  }

  function finishSession(results) {
    setSession((prev) => ({ ...prev, results }));
    setPhase("summary");
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
            levels={availableLevels}
            modules={availableModules}
            counts={counts}
            filteredCount={filtered.length}
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
