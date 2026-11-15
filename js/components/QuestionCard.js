// ------------------------------------------------------------
// QuestionCard – frame around one question: meta badges (level,
// module), question text, the renderer chosen by "type", and the
// feedback box with explanation.
// ------------------------------------------------------------

function QuestionCard({ question, moduleIndex, selected, onSelect }) {
  const answered = selected !== null && selected !== undefined;
  const correct = answered && isCorrectAnswer(question, selected);

  // Pick the renderer by question type – future types plug in here.
  let body = null;
  if (question.type === "mc") {
    body = (
      <MultipleChoice
        question={question}
        selected={selected}
        onSelect={onSelect}
      />
    );
  } else {
    body = (
      <p className="hint">
        Unbekannter Fragetyp „{question.type}“ – Renderer fehlt noch.
      </p>
    );
  }

  return (
    <article className="card question-card">
      <div className="question-meta">
        <span className="badge badge-level">{question.level}</span>
        <span className="badge badge-module">
          {moduleLabel(moduleIndex, question.module)}
        </span>
      </div>

      <QuestionText question={question} selected={selected} />
      {body}

      {answered && (
        <div className={"feedback " + (correct ? "is-correct" : "is-wrong")}>
          <p className="feedback-title">
            {correct ? "せいかい！ Richtig" : "ざんねん… Leider falsch"}
          </p>
          {!correct && (
            <p className="feedback-answer">
              Richtige Antwort:{" "}
              <strong>{getAnswers(question).join(" ・ ")}</strong>
            </p>
          )}
          {question.translation && (
            <p className="feedback-translation">
              Übersetzung: {question.translation}
            </p>
          )}
          {question.explanation && (
            <p className="feedback-text">{question.explanation}</p>
          )}
        </div>
      )}
    </article>
  );
}
