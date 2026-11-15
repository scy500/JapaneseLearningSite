// ------------------------------------------------------------
// FilterPanel – Niveau- und Modul-Filter (umschaltbare Chips).
// Zeigt nur Level/Module, die tatsächlich Fragen haben.
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

  return (
    <div className="filter">
      <div className="filter-group">
        <p className="filter-label">Niveau</p>
        <div className="chip-row">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              className={"chip" + (filter.levels[level] ? " is-active" : "")}
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
              className={"chip" + (filter.modules[id] ? " is-active" : "")}
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
