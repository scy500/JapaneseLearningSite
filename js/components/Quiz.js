// ------------------------------------------------------------
// Quiz – steuert eine Session: aktuelle Frage, Auswahl,
// Sofort-Feedback, Score-Zähler, Fortschritt, Weiter-Button.
// ------------------------------------------------------------

function Quiz({ questions, moduleIndex, onFinish, onQuit }) {
  const [current, setCurrent] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [results, setResults] = React.useState([]);

  const question = questions[current];
  const total = questions.length;
  const correctCount = results.filter((r) => r.correct).length;
  const answered = selected !== null;

  function handleSelect(option) {
    if (answered) return;
    const correct = isCorrectAnswer(question, option);
    setSelected(option);
    setResults((prev) => [...prev, { id: question.id, correct }]);
  }

  function next() {
    if (current + 1 >= total) {
      onFinish(results);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  }

  return (
    <section className="quiz">
      <header className="quiz-header">
        <div className="quiz-progress">
          <span>
            Frage {current + 1} / {total}
          </span>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: ((answered ? current + 1 : current) / total) * 100 + "%",
              }}
            />
          </div>
        </div>
        <div className="quiz-score">
          <span className="score-ok">✓ {correctCount}</span>
          <span className="score-bad">✗ {results.length - correctCount}</span>
        </div>
      </header>

      <QuestionCard
        question={question}
        moduleIndex={moduleIndex}
        selected={selected}
        onSelect={handleSelect}
      />

      <div className="quiz-actions">
        <button type="button" className="btn btn-ghost" onClick={onQuit}>
          Session beenden
        </button>
        {answered && (
          <button type="button" className="btn btn-primary" onClick={next}>
            {current + 1 >= total ? "Ergebnis ansehen" : "Weiter"}
          </button>
        )}
      </div>
    </section>
  );
}
