// ------------------------------------------------------------
// Summary – end-of-session result: score, per-module statistics,
// an expandable mistake list (your answer vs. correct answer) and
// a "repeat mistakes" round. Everything lives in session state;
// nothing is stored anywhere.
// ------------------------------------------------------------

function Summary({
  results,
  moduleIndex,
  onRepeatMistakes,
  onRestart,
  onHome,
}) {
  const [showMistakes, setShowMistakes] = React.useState(false);

  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const mistakes = results.filter((r) => !r.correct);

  // Per-module statistics for this round (modules = categories).
  const stats = {};
  results.forEach((r) => {
    const m = r.question.module;
    if (!stats[m]) stats[m] = { total: 0, correct: 0 };
    stats[m].total += 1;
    if (r.correct) stats[m].correct += 1;
  });

  const message =
    percent >= 80
      ? "すごい！ Sehr gut gemacht."
      : percent >= 50
        ? "いい調子！ Gut unterwegs – bei den Fehlern lohnt sich ein zweiter Blick."
        : "がんばって！ Jede Runde bringt dich weiter – versuch es gleich nochmal.";

  // Display helper: arrays (multi questions) get joined with "・".
  function formatSelected(sel) {
    if (sel === null || sel === undefined) return "–";
    return Array.isArray(sel) ? sel.join(" ・ ") : sel;
  }

  // Display helper: make the "___" blank visible in the list.
  function questionText(q) {
    return String(q.question).split("___").join("＿＿");
  }

  return (
    <section className="summary card">
      <h2>Session beendet</h2>
      <p className="summary-score">
        {correct} / {total}
      </p>
      <p className="summary-percent">{percent}%</p>
      <p className="summary-message">{message}</p>

      {total > 0 && (
        <div className="summary-stats">
          <p className="summary-stats-title">Pro Modul in dieser Runde</p>
          {Object.keys(stats).map((m) => {
            const s = stats[m];
            const p = Math.round((s.correct / s.total) * 100);
            const barClass = p >= 80 ? "is-ok" : p >= 50 ? "is-mid" : "is-bad";
            return (
              <div className="stat-row" key={m}>
                <span className="stat-label">
                  {moduleLabel(moduleIndex, m)}
                </span>
                <span className="stat-bar-track">
                  <span
                    className={"stat-bar " + barClass}
                    style={{ width: p + "%" }}
                  ></span>
                </span>
                <span className="stat-count">
                  {s.correct} / {s.total}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="summary-actions">
        {mistakes.length > 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onRepeatMistakes(mistakes.map((r) => r.question))}
          >
            Fehler wiederholen ({mistakes.length})
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={onRestart}>
          Nochmal üben
        </button>
        <button type="button" className="btn btn-ghost" onClick={onHome}>
          Filter ändern
        </button>
        {mistakes.length > 0 && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowMistakes((v) => !v)}
          >
            {showMistakes
              ? "Fehler ausblenden"
              : "Fehler ansehen (" + mistakes.length + ")"}
          </button>
        )}
      </div>

      {showMistakes && (
        <div className="mistakes-list">
          {mistakes.map((r) => (
            <article className="mistake-item" key={r.id}>
              <div className="question-meta">
                <span className="badge badge-level">{r.question.level}</span>
                <span className="badge badge-module">
                  {moduleLabel(moduleIndex, r.question.module)}
                </span>
              </div>
              <p className="mistake-question">{questionText(r.question)}</p>
              <p className="mistake-line">
                Deine Antwort:{" "}
                <strong className="is-bad">{formatSelected(r.selected)}</strong>
              </p>
              <p className="mistake-line">
                Richtig:{" "}
                <strong className="is-ok">
                  {getAnswers(r.question).join(" ・ ")}
                </strong>
              </p>
              {r.question.translation && (
                <p className="mistake-translation">
                  Übersetzung: {r.question.translation}
                </p>
              )}
              {r.question.explanation && (
                <p className="mistake-explanation">{r.question.explanation}</p>
              )}
            </article>
          ))}
        </div>
      )}

      <p className="summary-note">
        Der Score gilt nur für diese Session – es wird nichts gespeichert.
      </p>
    </section>
  );
}
