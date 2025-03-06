# ACTIVY APP

## Introduction

Ce projet est une application web construite avec Vue.js 3, TypeScript et Tailwind CSS. Il propose une interface pour gérer des activités, y compris l'ajout, la modification et la suppression d'activités. Le backend est construit avec Node.js, Express et MongoDB, fournissant une API RESTful pour la gestion des activités.

## 🚀 Démarrage Rapide

Pour démarrer rapidement l'application (frontend + backend) :

```sh
# Installation des dépendances frontend
npm install

# Installation des dépendances backend
cd backend && npm install && cd ..

# Démarrage des deux serveurs simultanément
npx concurrently "npm run dev" "cd backend && npm run server"
```

Une fois lancé, accédez à :

- Application : http://localhost:5173
- API Backend : http://localhost:3000
- Vue DevTools : http://localhost:5173/**devtools**

## Structure du Projet

### Frontend

- **Vue.js 3** : Le frontend est développé avec Vue.js 3, un framework JavaScript progressif pour construire des interfaces utilisateur.
- **TypeScript** : TypeScript est utilisé pour la sécurité des types et une meilleure maintenabilité du code.
- **Tailwind CSS** : Tailwind CSS est utilisé pour le style de l'application.
- **Pinia** : Pinia est utilisé pour la gestion de l'état.
- **Vuelidate** : Vuelidate est utilisé pour la validation des formulaires.
- **Firebase** : Firebase est utilisé pour l'authentification.

### Backend

- **Node.js** : Le backend est construit avec Node.js, un environnement d'exécution JavaScript.
- **Express** : Express est utilisé comme framework web.
- **MongoDB** : MongoDB est utilisé comme base de données.
- **Mongoose** : Mongoose est utilisé pour la modélisation des données (ODM).

## Aperçu de la Base de Code

### Frontend

- `src/components` : Contient les composants Vue tels que `ActivityCard.vue`, `AppHeader.vue` et les composants de formulaire.
- `src/views` : Contient les composants de vue comme `HomeView.vue`, `AdminView.vue` et `PanierView.vue`.
- `src/stores` : Contient les stores Pinia pour la gestion de l'état, tels que `auth.store.ts` et `activity.store.ts`.
- `src/composables` : Contient la logique réutilisable, comme `useFetch.ts`.
- `src/router` : Contient la configuration du routeur.
- `src/assets` : Contient les fichiers CSS et autres ressources statiques.
- `src/interface` : Contient les interfaces TypeScript pour les définitions de types.

### Backend

- `backend/src/models` : Contient les modèles Mongoose, tels que `activity.model.ts`.
- `backend/src/controllers` : Contient les contrôleurs pour gérer les requêtes API, tels que `activity.controller.ts`.
- `backend/src/routes` : Contient les définitions de routes, telles que `activity.routes.ts`.
- `backend/src/interfaces` : Contient les interfaces TypeScript pour le backend.

### Fichiers de Configuration

- `tsconfig.json` : Configuration de TypeScript.
- `vite.config.ts` : Configuration de Vite pour le frontend.
- `eslint.config.ts` : Configuration d'ESLint pour le linting.
- `package.json` : Contient les dépendances et les scripts pour le frontend et le backend.
- `.editorconfig` : Configuration de l'éditeur pour des styles de codage cohérents.
- `.gitignore` : Spécifie les fichiers à ignorer par Git.

## Pour Commencer

### Prérequis

- Node.js
- npm ou yarn

### Installation

1. Clonez le dépôt :
   ```sh
   git clone <repository-url>
   ```
2. Naviguez dans le répertoire du projet :
   ```sh
   cd vue-tp3
   ```
3. Installez les dépendances pour le frontend :
   ```sh
   npm install
   ```
4. Naviguez dans le répertoire backend et installez les dépendances :
   ```sh
   cd backend
   npm install
   ```

### Lancer l'Application

1. Démarrez le serveur backend :
   ```sh
   npm run server
   ```
2. Démarrez le serveur de développement frontend :
   ```sh
   cd ..
   npm run dev
   ```

### Construire pour la Production

1. Construisez le frontend :
   ```sh
   npm run build
   ```
2. Démarrez le serveur de production :
   ```sh
   npm start
   ```

### Démarrage Simultané des Serveurs (Frontend et Backend)

Pour démarrer les deux serveurs (frontend et backend) simultanément, vous pouvez utiliser l'une des méthodes suivantes :

#### Méthode 1 : Utilisation de `npx concurrently`

```sh
npx concurrently "npm run dev" "cd backend && npm run server"
```

Cette commande va :

- Démarrer le serveur frontend sur `http://localhost:5173`
- Démarrer le serveur backend sur le port configuré (généralement `3000`)

#### Méthode 2 : Utilisation de Deux Terminaux Séparés

Terminal 1 (Frontend) :

```sh
npm run dev
```

Terminal 2 (Backend) :

```sh
cd backend
npm run server
```

### Ports par Défaut

- Frontend : `http://localhost:5173`
- Backend : `http://localhost:3000`
- Vue DevTools : `http://localhost:5173/__devtools__/`

## Contribuer

Les contributions sont les bienvenues ! Veuillez forker le dépôt et soumettre une pull request.

## Licence

Ce projet est sous licence MIT.
