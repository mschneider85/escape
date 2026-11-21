# Escape-Welten

Ein Escape-Buch zum Spielen – erfunden auf einem Blatt Papier, gebaut als Web-App fürs iPad.
Alles ist von Hand gezeichnet (SVG), jedes Abenteuer hat mehrere Seiten, zwischen denen man hin- und herblättert.

- 3 Welten: **Nordpol**, **Ägypten**, **Weltraum** – mit je 3 Kapiteln
- Gegenstände finden und kombinieren, Hinweise im Notizbuch sammeln, Rätsel lösen, entkommen!
- Spielstand wird gespeichert, Vorlesen auf Deutsch, Tipps per Glühbirne

**Spielen:** https://mschneider85.github.io/escape/

Auf dem iPad in Safari öffnen → Teilen → „Zum Home-Bildschirm“. Danach läuft das Spiel im Vollbild und offline.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `engine/game.js` | Spiel-Engine: Seiten, Rucksack, Kombinieren, Notizbuch, Rätsel, Speichern |
| `engine/art-common.js` | Zeichen-Helfer und gemeinsame Bilder (Icons, Pfeile, Truhe …) |
| `worlds/*.js` | Je eine Welt: Zeichnungen + Kapitel + Rätsel |
| `tools/validate.js` | `node tools/validate.js` – prüft alle Welten und spielt jedes Kapitel automatisch durch |
| `tools/gallery.html` | Zeigt alle Seiten einer Welt auf einen Blick: `tools/gallery.html?w=nordpol` |
| `tools/autoplay.js` | Spielt Kapitel im Browser mit echten Klicks durch (`__autoplayAll()`) |

## Eigene Kapitel bauen

Ein Kapitel besteht aus Seiten (`pages`), jede Seite hat ein Hintergrundbild und Objekte.
Objekte können Hinweise geben (`say`, `note`), Gegenstände geben oder brauchen (`give`, `needs`),
Rätsel stellen (`puzzle`: `code`, `choice`, `sequence`, `wheels`), auf andere Seiten führen (`goto`)
oder das Kapitel gewinnen (`win`). Die genaue Liste steht oben in `tools/validate.js`.

Nach Änderungen: `node tools/validate.js` laufen lassen und in `sw.js` die `VERSION` erhöhen.
