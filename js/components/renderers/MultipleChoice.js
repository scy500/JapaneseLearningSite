// ------------------------------------------------------------
// MultipleChoice – renderer for question type "mc".
// Instant feedback: correct option = green, chosen-but-wrong =
// red, everything else dimmed. All buttons lock after answering.
// ------------------------------------------------------------

function MultipleChoice({ question, selected, onSelect }) {
  const answered = selected !== null && selected !== undefined;
  const answers = getAnswers(question);

  return (
    <div className="options">
      {question.options.map((option, i) => {
        const isCorrect = answers.includes(option);
        const isChosen = option === selected;
        let cls = "option-btn";
        if (answered) {
          if (isCorrect) cls += " is-correct";
          else if (isChosen) cls += " is-wrong";
          else cls += " is-muted";
        }
        return (
          <button
            key={i}
            type="button"
            className={cls}
            disabled={answered}
            onClick={() => onSelect(option)}
          >
            <span className="option-key">{String.fromCharCode(65 + i)}</span>
            <span className="option-text">{option}</span>
            <span className="option-mark">
              {answered ? (isCorrect ? "✓" : isChosen ? "✗" : "") : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}
