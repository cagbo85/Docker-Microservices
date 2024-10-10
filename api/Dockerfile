# Étape 1 : Construire l'application
FROM node:16 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tout le code source de l'application
COPY . .

# Compiler ou construire l'application si nécessaire (par exemple, TypeScript)
# RUN npm run build

# Étape 2 : Exécuter l'application avec une image plus légère
FROM node:16-slim

WORKDIR /app

# Copier les fichiers nécessaires à partir de l'étape de build
COPY --from=build /app /app

# Exposer le port sur lequel l'application s'exécute
EXPOSE 4000

# Démarrer l'application
CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl --fail http://localhost:4000/metrics || exit 1
