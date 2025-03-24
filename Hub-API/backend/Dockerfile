FROM node:18-alpine

WORKDIR /app

# Installation des dépendances globales
RUN npm install -g typescript ts-node

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Build de l'application TypeScript
RUN npm run build

# Exposition du port
EXPOSE 5000

# Commande de démarrage
CMD ["node", "dist/index.js"] 