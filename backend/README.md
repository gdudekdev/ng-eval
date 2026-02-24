# DFS Evaluation Backend

Serveur Node.js/Express pour l'application d'évaluation des prix.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Le serveur s'exécutera sur `http://localhost:3000`

## Production

```bash
npm start
```

## API Routes

### Santé de l'application
- `GET /api/health` - Vérifier l'état du serveur

### Sessions
- `GET /api/sessions` - Lister les sessions
- `POST /api/sessions` - Créer une session

### Produits
- `GET /api/products` - Lister les produits

### Utilisateurs
- `GET /api/users` - Lister les utilisateurs

## Configuration

Les variables d'environnement doivent être dans un fichier `.env`:

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eval_db
PORT=3000
```

## Base de Données

PostgreSQL est utilisée pour la persistance des données.

