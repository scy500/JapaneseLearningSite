// ------------------------------------------------------------
// GrammarModal – overlay that shows one dossier point: title,
// short explanation and two example sentences. Closes via
// backdrop click, the X button or the Escape key.
// ------------------------------------------------------------

function GrammarModal({ point, onClose }) {
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!point) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card card"
        role="dialog"
        aria-modal="true"
        aria-label={point.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Schließen"
        >
          ✕
        </button>
        <span className="badge badge-level">{point.level}</span>
        <h2 className="modal-title">{point.title}</h2>
        <p className="modal-short">{point.short}</p>
        <div className="modal-examples">
          {point.examples.map((ex, i) => (
            <div className="modal-example" key={i}>
              <p className="modal-example-ja">{ex.ja}</p>
              <p className="modal-example-de">{ex.de}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
