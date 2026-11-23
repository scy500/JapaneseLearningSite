// ------------------------------------------------------------
// Listening – renderer for question types "listen-order" and
// "listen-mc". The sentence/passage is spoken via the Web Speech
// API (TTS, no audio files). Playback always stays available,
// also after answering – listening again is part of learning.
// ------------------------------------------------------------

function Listening({ question, selected, onSelect }) {
  const [plays, setPlays] = React.useState(0);
  const answered = selected !== null && selected !== undefined;

  function play() {
    // Prefer the explicit speech text; fall back to the answer
    // (listen-order questions speak the sentence to rebuild).
    const text =
      question.speech ||
      (Array.isArray(question.answer) ? question.answer[0] : question.answer);
    if (!text) return;
    speakJapanese(text);
    setPlays((p) => p + 1);
  }

  return (
    <div className="listening">
      <div className="listening-controls">
        <button type="button" className="btn btn-primary" onClick={play}>
          ▶ Anhören
        </button>
        {plays > 0 && (
          <span className="listening-hint">
            {plays}× abgespielt – ruhig nochmal hören, wenn nötig
          </span>
        )}
      </div>

      {question.type === "listen-order" ? (
        <OrderInput
          question={question}
          selected={selected}
          onSelect={onSelect}
        />
      ) : (
        <MultipleChoice
          question={question}
          selected={selected}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
