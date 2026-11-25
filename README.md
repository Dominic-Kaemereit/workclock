# WorkClock ⏰

Eine moderne Webanwendung zur einfachen Berechnung und Live-Verfolgung der täglichen Arbeitszeit, Pausen und Überstunden – entwickelt mit Next.js, React, TypeScript und Tailwind CSS.

---

## 🌟 Funktionen

* **Arbeitszeit- & Feierabendberechnung:** Individuelle Eingabe von benötigten Arbeitsstunden, Pausenzeit (in Minuten) und Startzeit.
* **Live-Countdown & Überstunden-Tracker:** Sekundengenaue Anzeige der verbleibenden Arbeitszeit sowie automatische Berechnung von Überstunden nach Feierabend – inklusive Live-Status im Browser-Tab-Titel.
* **Persistente Sitzung (`localStorage`):** Eingegebene Standardwerte und laufende Timer bleiben auch nach dem Schließen oder Neuladen des Browsers erhalten.
* **Konfigurierbare Auto-Resets:**
  * *Automatischer Reset am nächsten Tag:* Setzt einen Timer vom Vortag beim Öffnen automatisch zurück.
  * *Reset bei Reload in Überstunden:* Optionaler automatischer Reset beim Neuladen der Seite, sobald die reguläre Arbeitszeit erreicht wurde.
* **Modernes UI & Dark Mode:** Responsives Design mit Tailwind CSS und Unterstützung für Hell-/Dunkelmodus.
* **Containerisierung:** Schlankes Multi-Stage Docker-Image (Next.js Standalone-Output auf `node:26-alpine`) für einfaches Deployment via Docker & Docker Compose.

---

## 🛠️ Tech-Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Standalone Build)
* **UI:** [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
* **Sprache:** [TypeScript](https://www.typescriptlang.org/)
* **Qualitätssicherung:** [Vitest 5](https://vitest.dev/), [React Testing Library](https://testing-library.com/), [ESLint 10](https://eslint.org/)

---

## 🚀 Erste Schritte

### Voraussetzungen

* Node.js (>= 24.x)
* npm
* git

### Lokale Entwicklung

1. **Repository klonen:**
   ```bash
   git clone https://github.com/Dominic-Kaemereit/workclock.git
   cd workclock
   ```

2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```
   Die App läuft anschließend unter [http://localhost:3000](http://localhost:3000).

### Verfügbare NPM-Skripte

| Befehl | Beschreibung |
| :--- | :--- |
| `npm run dev` | Startet den Next.js-Entwicklungsserver auf Port `3000` |
| `npm run build` | Erstellt den optimierten Produktions-Build (`.next/standalone`) |
| `npm start` | Startet den Produktionsserver nach einem Build |
| `npm run lint` | Prüft den Code mit ESLint |
| `npm test` | Führt alle Unit- und Komponenten-Tests einmalig mit Vitest aus |
| `npm run test:watch` | Startet Vitest im interaktiven Watch-Modus |

---

## 🐳 Deployment mit Docker Compose

1. Verwende die enthaltene `docker-compose.yml` oder erstelle eine neue Datei mit folgendem Inhalt, um das veröffentlichte Image aus der GitHub Container Registry zu nutzen:
   ```yaml
   services:
     workclock:
       image: ghcr.io/dominic-kaemereit/workclock:main
       restart: unless-stopped
       ports:
         - "3000:3000"
   #       <host_port>:<container_port>
   ```

2. **Container starten:**
   ```bash
   docker compose up -d
   ```

3. Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) erreichbar (Host-Port ggf. in `docker-compose.yml` anpassen).

4. **Container stoppen:**
   ```bash
   docker compose down
   ```
