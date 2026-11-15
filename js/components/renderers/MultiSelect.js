// ------------------------------------------------------------
// MultiSelect – renderer for question type "multi": several
// answers are correct (e.g. "describe the picture"). Toggle the
// options, then submit once. Correct = exact same set as
// "answer" (array in the JSON).
// ------------------------------------------------------------

function MultiSelect({ question, selected, onSelect }) {
  const answered = selected !== null && selected !== undefined;
  const answers = getAnswers(question);
  const [chosen, setChosen] = React.useState([]);

  function toggle(option) {
    if (answered) return;
    setChosen((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  }

  return (
    <div className="options multi">
      {question.options.map((option, i) => {
        const isCorrect = answers.includes(option);
        const isChosen = answered
          ? selected.includes(option)
          : chosen.includes(option);
        let cls = "option-btn";
        if (answered) {
          if (isCorrect) cls += " is-correct";
          else if (isChosen) cls += " is-wrong";
          else cls += " is-muted";
        } else if (isChosen) {
          cls += " is-selected";
        }
        return (
          <button
            key={option}
            type="button"
            className={cls}
            onClick={() => toggle(option)}
            disabled={answered}
          >
            <span className="option-key">{String.fromCharCode(65 + i)}</span>
            <span className="option-text">{option}</span>
            <span className="option-mark">
              {answered
                ? isCorrect
                  ? "✓"
                  : isChosen
                    ? "✗"
                    : ""
                : isChosen
                  ? "✓"
                  : ""}
            </span>
          </button>
        );
      })}
      {!answered && (
        <button
          type="button"
          className="btn btn-primary multi-submit"
          disabled={chosen.length === 0}
          onClick={() => onSelect(chosen)}
        >
          Antwort abgeben
        </button>
      )}
    </div>
  );
}
