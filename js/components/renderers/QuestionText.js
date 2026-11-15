// ------------------------------------------------------------
// QuestionText – renders the question prompt. "___" becomes a
// visible blank; once answered, the chosen option is filled in
// (green/red) instead.
// ------------------------------------------------------------

function QuestionText({ question, selected }) {
  const parts = String(question.question).split("___");
  const answered = selected !== null && selected !== undefined;
  const filledOk = answered && isCorrectAnswer(question, selected);

  return (
    <p className="question-text">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 &&
            (answered ? (
              <span
                className={"blank is-filled " + (filledOk ? "is-ok" : "is-bad")}
              >
                {selected}
              </span>
            ) : (
              <span className="blank" aria-label="Lücke">
                ＿＿
              </span>
            ))}
        </React.Fragment>
      ))}
    </p>
  );
}
