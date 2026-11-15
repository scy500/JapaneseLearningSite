// ------------------------------------------------------------
// Summary – Ergebnis am Ende einer Session.
// Score gilt nur für die Session, nichts wird gespeichert.
// ------------------------------------------------------------

function Summary({ results, onRestart, onHome }) {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  const message =
    percent >= 80
      ? "すごい！ Sehr gut gemacht."
      : percent >= 50
        ? "いい調子！ Gut unterwegs – bei den Fehlern lohnt sich ein zweiter Blick."
        : "がんばって！ Jede Runde bringt dich weiter – versuch es gleich nochmal.";

  return (
    <section className="summary card">
      <h2>Session beendet</h2>
      <p className="summary-score">
        {correct} / {total}
      </p>
      <p className="summary-percent">{percent}%</p>
      <p className="summary-message">{message}</p>
      <div className="summary-actions">
        <button type="button" className="btn btn-primary" onClick={onRestart}>
          Nochmal üben
        </button>
        <button type="button" className="btn btn-ghost" onClick={onHome}>
          Filter ändern
        </button>
      </div>
      <p className="summary-note">
        Der Score gilt nur für diese Session – es wird nichts gespeichert.
      </p>
    </section>
  );
}
