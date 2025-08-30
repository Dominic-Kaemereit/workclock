# WorkClock ⏰

Eine moderne Zeiterfassungsanwendung, entwickelt mit Next.js, React und TypeScript.

---

## 🌟 Funktionen

* **Intuitive Zeiterfassung:** Erfasse Arbeitszeiten einfach und übersichtlich.
* **Simple UI:** Eine benutzerfreundliche Oberfläche für schnelle Eingaben.
* **Containerisierung:** Einfache Bereitstellung via Docker & Docker Compose.

---

## 🚀 Erste Schritte

### Voraussetzungen

* Node.js (>= 20.x)
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
   Die App läuft dann unter [http://localhost:3000](http://localhost:3000).

---

## 🐳 Deployment mit Docker Compose

1. Um die Anwendung mit dem veröffentlichten Image aus der GitHub Container Registry zu starten, erstelle folgende `docker-compose.yml` Datei:
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

3. Die Anwendung ist unter [http://localhost:8080](http://localhost:8080) erreichbar (Port ggf. in `docker-compose.yml` anpassen).

4. **Container stoppen:**
    ```bash
    docker compose down
    ```