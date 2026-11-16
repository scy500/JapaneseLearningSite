// ------------------------------------------------------------
// Dossier – full list of all grammar points, reachable from the
// start screen ("Grammatik-Dossier"). One card per point:
// title, short explanation, two examples.
// ------------------------------------------------------------

function Dossier({ points, onBack }) {
  return (
    <section className="dossier">
      <div className="dossier-header">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Zurück
        </button>
        <h2>Grammatik-Dossier</h2>
      </div>

      {points.length === 0 && (
        <p className="hint">Noch keine Grammatikpunkte angelegt.</p>
      )}

      {points.map((p) => (
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
