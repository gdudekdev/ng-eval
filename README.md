# DFS Evaluation - Price Estimation Game

Application web de jeu d'estimation de prix pour l'évaluation DFS 2025-2026.

## 📋 Table des matières

- [Stack Technique](#stack-technique)
- [Structure du Projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement du Projet](#lancement-du-projet)
- [Utilisation](#utilisation)
- [API](#api)

## 🛠 Stack Technique

### Frontend
- **Angular 21** - Framework frontend

### Backend
- **Node.js** - Runtime
- **Express** - Framework backend
- **PostgreSQL** - Base de données

### DevOps
- **Docker** - Containerisation de la base de données

## 📁 Structure du Projet

```
ng-eval/
├── backend/                    # Serveur Node.js/Express
│   ├── models/                # Modèles de données
│   │   ├── productModel.js
│   │   ├── sessionModel.js
│   │   └── userModel.js
│   ├── routes/                # Routes API
│   │   ├── products.js
│   │   ├── sessions.js
│   │   └── users.js
│   ├── utils/                 # Utilitaires
│   │   └── scoring.js
│   ├── db.js                  # Configuration DB
│   ├── server.js              # Point d'entrée
│   └── package.json
│
├── frontend/                  # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Composants
│   │   │   │   ├── dashboard/
│   │   │   │   ├── leaderboard/
│   │   │   │   ├── login/
│   │   │   │   └── session/
│   │   │   ├── models/       # Modèles TypeScript
│   │   │   ├── services/     # Services
│   │   │   └── app-routing.module.ts
│   │   ├── styles.css        # Styles globaux
│   │   └── main.ts
│   └── package.json
│
├── docker/                    # Configuration Docker
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── init.sql              # Script d'initialisation DB
│
├── Makefile                   # Commandes de build/run
└── README.md                  # Ce fichier
```

## 📦 Prérequis

- **Node.js** (v18 ou supérieur)
- **npm** (v9 ou supérieur)
- **Docker** et **Docker Compose**
- **Make** (optionnel, pour utiliser le Makefile)

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd ng-eval
```

### 2. Installer les dépendances

Avec Make :
```bash
make install
```

Ou manuellement :
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 🎮 Lancement du Projet

### Option 1 : Lancement complet (Recommandé)

**Avec Make** - En 3 terminaux séparés :

```bash
# Terminal 1 - Base de données
make start-db

# Terminal 2 - Backend (après que la DB soit prête)
make start-backend

# Terminal 3 - Frontend
make start-frontend
```

### Option 2 : Lancement manuel

```bash
# Terminal 1 - Base de données PostgreSQL
cd docker
docker-compose up -d

# Terminal 2 - Backend (http://localhost:3000)
cd backend
npm start

# Terminal 3 - Frontend (http://localhost:4200)
cd frontend
npm start
```

### Arrêter les services

```bash
# Arrêter la base de données
make stop-db
# ou
cd docker && docker-compose down

# Arrêter backend et frontend : Ctrl+C dans les terminaux respectifs
```

## 🌐 Accès à l'application

Une fois tous les services démarrés :

- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:3000/api
- **Base de données** : localhost:5432

## 👤 Utilisation

### Comptes de démonstration

L'application est pré-configurée avec 3 utilisateurs :

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| a@a.com | root | Admin | Peut créer et fermer des sessions |
| b@b.com | azerty | User | Peut rejoindre des sessions |
| c@c.com | qwerty | User | Peut rejoindre des sessions |

### Workflow typique

1. **Connexion** : Utilisez un des comptes ci-dessus
2. **Admin** : Créer une nouvelle session
3. **Users** : Rejoindre une session disponible
4. **Estimer** : Donner votre estimation pour chaque produit (4 produits par session)
5. **Score** : Voir votre score après chaque estimation (100 - différence de prix)
6. **Leaderboard** : Consulter le classement final

## 📡 API

### Endpoints principaux

**Users**
- `POST /api/users/login` - Connexion
- `GET /api/users` - Liste des utilisateurs

**Sessions**
- `GET /api/sessions` - Sessions actives
- `GET /api/sessions/closed/list` - Sessions fermées
- `GET /api/sessions/:id` - Détails d'une session
- `POST /api/sessions` - Créer une session (admin)
- `POST /api/sessions/:id/join` - Rejoindre une session
- `PUT /api/sessions/:id/responses` - Soumettre les réponses
- `PUT /api/sessions/:id/close` - Fermer une session (admin)
- `GET /api/sessions/:id/leaderboard` - Leaderboard

**Products**
- `GET /api/products` - Liste des produits

## 📝 Commandes Make disponibles

```bash
make install          # Installer toutes les dépendances
make setup-backend    # Installer les dépendances backend
make setup-frontend   # Installer les dépendances frontend
make start-db         # Démarrer PostgreSQL (Docker)
make stop-db          # Arrêter PostgreSQL
make start-backend    # Démarrer le serveur Node.js
make start-frontend   # Démarrer Angular
make clean            # Nettoyer node_modules et dist
```
