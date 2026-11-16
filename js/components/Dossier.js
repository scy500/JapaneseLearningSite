// ------------------------------------------------------------
// Dossier – full list of all grammar points, reachable from the
// start screen ("Grammatik-Dossier"). One card per point:
// title, short explanation, two examples. A chip row on top
// filters the list by level (N5–N1).
// ------------------------------------------------------------

function Dossier({ points, onBack }) {
  // null = show all levels.
  const [levelFilter, setLevelFilter] = React.useState(null);

  // Levels that actually exist in the dossier, in LEVELS order.
  const availableLevels = React.useMemo(() => {
    const present = {};
    points.forEach((p) => (present[p.level] = true));
    return LEVELS.filter((l) => present[l]);
  }, [points]);

  const levelCount = React.useMemo(() => {
    const counts = {};
    points.forEach((p) => (counts[p.level] = (counts[p.level] || 0) + 1));
    return counts;
  }, [points]);

  const visible =
    levelFilter === null
      ? points
      : points.filter((p) => p.level === levelFilter);

  return (
    <section className="dossier">
      <div className="dossier-header">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Zurück
        </button>
        <h2>Grammatik-Dossier</h2>
      </div>

      {availableLevels.length > 0 && (
        <div className="dossier-filter">
          <div className="chip-row">
            <button
              type="button"
              className={"chip" + (levelFilter === null ? " is-active" : "")}
              onClick={() => setLevelFilter(null)}
            >
              Alle
              <span className="chip-count">{points.length}</span>
            </button>
            {availableLevels.map((level) => (
              <button
                key={level}
                type="button"
                className={"chip" + (levelFilter === level ? " is-active" : "")}
                onClick={() => setLevelFilter(level)}
              >
                {level}
                <span className="chip-count">{levelCount[level] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {visible.length === 0 && (
        <p className="hint">Keine Grammatikpunkte für dieses Niveau.</p>
      )}

      {visible.map((p) => (
        <article className="card dossier-card" key={p.id}>
          <div className="question-meta">
            <span className="badge badge-level">{p.level}</span>
          </div>
          <h3 className="dossier-title">{p.title}</h3>
          <p className="dossier-short">{p.short}</p>
          <div className="dossier-examples">
            {p.examples.map((ex, i) => (
              <div className="dossier-example" key={i}>
                <p className="dossier-example-ja">{ex.ja}</p>
                <p className="dossier-example-de">{ex.de}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
