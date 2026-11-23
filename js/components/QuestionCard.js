// ------------------------------------------------------------
// QuestionCard – frame around one question: meta badges (level,
// module), optional image, question text, the renderer chosen
// by "type", and the feedback box with explanation.
//
// Spoiler policy: the grammar dossier link stays hidden until
// the question is answered – the point title would give away
// the answer (e.g. "は – Thema" before a は question).
// ------------------------------------------------------------

function QuestionCard({
  question,
  moduleIndex,
  selected,
  onSelect,
  grammarPoint,
  onShowGrammar,
}) {
  const answered = selected !== null && selected !== undefined;
  const correct = answered && checkAnswer(question, selected);

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
  } else if (question.type === "order") {
    body = (
      <OrderInput question={question} selected={selected} onSelect={onSelect} />
    );
  } else if (question.type === "multi") {
    body = (
      <MultiSelect
        question={question}
        selected={selected}
        onSelect={onSelect}
      />
    );
  } else if (
    question.type === "listen-order" ||
    question.type === "listen-mc"
  ) {
    body = (
      <Listening question={question} selected={selected} onSelect={onSelect} />
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
        {answered && grammarPoint && onShowGrammar && (
          <button
            type="button"
            className="grammar-link"
            onClick={() => onShowGrammar(grammarPoint)}
          >
            📖 {grammarPoint.title}
          </button>
        )}
      </div>

      {question.image && (
        <figure className="question-image">
          <img src={question.image} alt={question.alt || "Bild zur Frage"} />
        </figure>
      )}

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
          {question.speech && (
            <p className="feedback-translation">
              Gehörter Text: {question.speech}
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
