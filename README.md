# JapaneseLearningSite

Vibe coded with AI

# 日本語 lernen – Japanisch-Lernseite

Interaktive Lern-Homepage für Japanisch (JLPT N5–N3): Multiple-Choice-Fragen
mit Sofort-Feedback, Filter nach Modul und Niveau. Läuft komplett im
Browser – ohne Backend, ohne Account, ohne Datenbank.

## Struktur

- `index.html` – Einstieg, lädt React + Babel vom CDN (kein Build-Step)
- `css/style.css` – komplettes Styling
- `js/utils.js` – Hilfsfunktionen (Laden, Mischen, Prüfen, Filtern)
- `js/app.js` – Root-Komponente, Start-Screen, Session-Steuerung
- `js/components/` – FilterPanel, Quiz, QuestionCard, Summary
- `js/components/renderers/` – ein Renderer pro Fragetyp
- `js/data/index.json` – Modul-Verzeichnis (Modul-ID → Anzeigename)
- `js/data/<modul>.json` – Fragen, pro Modul eine Datei

## Fragen ergänzen

Fragen stehen als JSON-Array in `js/data/<modul>.json`:

json
{
"id": "particles-n5-001",
"type": "mc",
"level": "N5",
"tags": ["thema"],
"question": "わたし \_\_\_ がくせい です。",
"translation": "Ich bin Student.",
"options": ["は", "を", "に", "で"],
"answer": "は",
"explanation": "は markiert das Thema des Satzes."
}

Copyright (c) 2026. All rights reserved.
No permission is granted to copy, modify or redistribute this project.
