// ------------------------------------------------------------
// OrderInput – renderer for question type "order": build the
// translation by clicking word tiles in the correct sequence.
// Click a pool tile to append it, click a placed tile to put it
// back. No drag & drop. The tiles come from "answer" (split on
// spaces) plus optional "distractors".
// ------------------------------------------------------------

function OrderInput({ question, selected, onSelect }) {
  // Words of the correct sentence + optional distractors.
  const base = React.useMemo(() => {
    const words = getAnswers(question)[0].split(" ");
    return question.distractors ? words.concat(question.distractors) : words;
  }, [question]);

  // Shuffled once per question, so the pool stays stable while clicking.
  const pool = React.useMemo(() => shuffle(base), [question.id]);

  // Indexes into "pool", in click order.
  const [picked, setPicked] = React.useState([]);
  const answered = selected !== null && selected !== undefined;

  const remaining = pool
    .map((word, i) => ({ word, i }))
    .filter(({ i }) => !picked.includes(i));

  function pick(i) {
    if (answered) return;
    setPicked((prev) => [...prev, i]);
  }

  function unpick(i) {
    if (answered) return;
    setPicked((prev) => prev.filter((x) => x !== i));
  }

  const built = picked.map((i) => pool[i]).join(" ");

  return (
    <div className="order-input">
      <div className="order-slot">
        {picked.map((i, n) => (
          <button
            key={i}
            type="button"
            className="order-tile is-picked"
            onClick={() => unpick(i)}
            disabled={answered}
          >
            <span className="order-num">{n + 1}</span>
            {pool[i]}
          </button>
        ))}
        {picked.length === 0 && (
          <span className="order-empty">
            Klicke die Wörter in der richtigen Reihenfolge an
          </span>
        )}
      </div>

      <div className="order-pool">
        {remaining.map(({ word, i }) => (
          <button
            key={i}
            type="button"
            className="order-tile"
            onClick={() => pick(i)}
            disabled={answered}
          >
            {word}
          </button>
        ))}
      </div>

      {!answered && (
        <div className="order-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setPicked([])}
          >
            Zurücksetzen
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={picked.length === 0}
            onClick={() => onSelect(built)}
          >
            Prüfen
          </button>
        </div>
      )}
    </div>
  );
}
