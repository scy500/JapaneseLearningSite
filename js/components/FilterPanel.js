// ------------------------------------------------------------
// FilterPanel – level and module filters (toggleable chips).
// Categories with zero questions render half-transparent.
// ------------------------------------------------------------

function FilterPanel({
  filter,
  onChange,
  levels,
  modules,
  moduleIndex,
  counts,
}) {
  function toggle(kind, id) {
    onChange({
      ...filter,
      [kind]: { ...filter[kind], [id]: !filter[kind][id] },
    });
  }

  function chipClass(kind, id, count) {
    return (
      "chip" +
      (filter[kind][id] ? " is-active" : "") +
      (count === 0 ? " is-empty" : "")
    );
  }

  return (
    <div className="filter">
      <div className="filter-group">
        <p className="filter-label">Niveau</p>
        <div className="chip-row">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              className={chipClass("levels", level, counts.levels[level] || 0)}
              onClick={() => toggle("levels", level)}
            >
              {level}
              <span className="chip-count">{counts.levels[level] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <p className="filter-label">Modul</p>
        <div className="chip-row">
          {modules.map((id) => (
            <button
              key={id}
              type="button"
              className={chipClass("modules", id, counts.modules[id] || 0)}
              onClick={() => toggle("modules", id)}
            >
              {moduleLabel(moduleIndex, id)}
              <span className="chip-count">{counts.modules[id] || 0}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
