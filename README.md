# Escape-Welten

Ein Escape-Spiel mit Rätseln für Kinder – erfunden auf einem Blatt Papier, gebaut als Web-App fürs iPad.

- 3 Welten: **Nordpol**, **Ägypten**, **Waldraum**
- in jeder Welt 3 Abenteuer
- Gegenstände finden, Rätsel lösen, entkommen!

**Spielen:** https://mschneider85.github.io/escape/

Auf dem iPad in Safari öffnen → Teilen → „Zum Home-Bildschirm“. Danach läuft das Spiel im Vollbild und auch offline.

## Eigene Abenteuer bauen

Alle Inhalte stehen in `data.js`. Ein Abenteuer besteht aus Objekten (Emoji + Position), die Gegenstände geben,
Gegenstände brauchen oder ein Rätsel stellen (`code`, `choice`, `sequence`). Kein Build-Schritt nötig.
Nach Änderungen in `sw.js` die `VERSION` erhöhen.
