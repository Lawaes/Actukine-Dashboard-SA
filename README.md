# Hub Social API

Application de gestion de publications sur les réseaux sociaux.

## Prérequis

- Docker et Docker Compose
- Node.js (pour le développement)
- MongoDB (pour le développement local sans Docker)

## Structure du projet

- `frontend/` : Application frontend en Next.js
- `backend/` : API backend en Node.js/Express/MongoDB

## Installation et démarrage avec Docker

1. Cloner le dépôt :

```bash
git clone <URL_DU_REPO>
cd Hub-API
```

2. Lancer l'application avec Docker Compose :

```bash
docker-compose up -d
```

3. Accéder à l'application :
   - Frontend: http://localhost:3000
   - API: http://localhost:5000/api

## Développement local (sans Docker)

### Backend

1. Installer les dépendances :

```bash
cd backend
npm install
```

2. Créer un fichier `.env` basé sur le modèle fourni :

3. Démarrer le serveur en mode développement :

```bash
npm run dev
```

### Frontend

1. Installer les dépendances :

```bash
cd frontend
npm install
```

2. Démarrer le serveur de développement :

```bash
npm run dev
```

## API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Obtenir l'utilisateur actuel
- `POST /api/auth/refresh-token` - Rafraîchir le token

### Utilisateurs

- `GET /api/users` - Obtenir tous les utilisateurs (admin)
- `GET /api/users/:id` - Obtenir un utilisateur par ID (admin)
- `POST /api/users` - Créer un utilisateur (admin)
- `PUT /api/users/:id` - Mettre à jour un utilisateur (admin)
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin)
- `GET /api/users/profile` - Obtenir le profil de l'utilisateur connecté
- `PUT /api/users/profile` - Mettre à jour le profil
- `PATCH /api/users/profile/password` - Mettre à jour le mot de passe

### Publications

- `GET /api/posts` - Obtenir toutes les publications (avec filtres)
- `GET /api/posts/:id` - Obtenir une publication par ID
- `POST /api/posts` - Créer une publication
- `PUT /api/posts/:id` - Mettre à jour une publication
- `DELETE /api/posts/:id` - Supprimer une publication
- `PATCH /api/posts/:id/status` - Mettre à jour le statut d'une publication
- `PATCH /api/posts/:id/validate` - Valider une tâche (visuelle ou relecture)

## Licence
Ce projet est sous licence ISC. 