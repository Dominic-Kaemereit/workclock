# Schritt 1: Basisimage
FROM node:20-alpine

# Schritt 2: Arbeitsverzeichnis erstellen
WORKDIR /app

# Schritt 3: Kopiere die package.json und package-lock.json (oder yarn.lock)
COPY package*.json ./

# Schritt 4: Installiere Abhängigkeiten
RUN npm install

# Schritt 5: Kopiere den Rest des Projekts
COPY . .

# Schritt 6: Baue das Projekt
RUN npm run build

# Schritt 7: Exponiere den Port, auf dem Next.js läuft
EXPOSE 3000

# Schritt 8: Starte die Anwendung
CMD ["npm", "run", "start"]