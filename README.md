# CESIZen — Back-office Web

> Interface d'administration du projet CESIZen — L'application de votre santé mentale  
> Bloc 2 — Titre Concepteur Développeur d'Applications (CESI)

## Stack technique

- **Framework** : React 19
- **Build** : Vite 8
- **Routing** : React Router DOM 7
- **Data fetching** : TanStack Query (React Query) 5
- **HTTP** : Axios
- **Langage** : TypeScript

## Prérequis

- Node.js >= 18
- npm
- L'API CESIZen doit tourner (voir [CESIZENAPI](https://github.com/Plabou102/CESIZENAPI))

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Plabou102/CESIZENReact
cd CESIZENReact

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs dans .env
```

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:3001
```

## Lancement

```bash
# Développement
npm run dev
```

L'application tourne sur **http://localhost:5173**

## Build production

```bash
npm run build
npm run preview
```

## Fonctionnalités

### Authentification
- Connexion sécurisée avec JWT
- Redirection automatique si non connecté
- Déconnexion avec invalidation du token

### Gestion des utilisateurs
- Liste de tous les comptes (utilisateurs et admins)
- Création, modification, désactivation et suppression
- Affichage du rôle et du statut de chaque compte

### Gestion des informations
- CRUD complet des pages d'information
- Activation / désactivation de la visibilité publique
- Filtrage par catégorie

### Gestion des exercices de respiration
- Création et configuration des exercices de cohérence cardiaque
- Paramétrage des durées : inspiration, apnée, expiration
- Activation / désactivation des exercices

## Structure du projet

```
src/
├── assets/             # Logos et images
├── components/
│   ├── auth/           # Routes protégées
│   └── layout/         # AdminLayout (sidebar + topbar)
├── hooks/
│   └── auth/           # useLogin, useLogout, useMe
├── pages/
│   ├── auth/           # LoginPage
│   ├── dashboard/      # DashboardPage
│   ├── users/          # UsersPage
│   ├── informations/   # InformationsPage
│   └── breathingExercises/ # BreathingExercisesPage
├── services/
│   └── api/            # Appels API (axios)
├── styles/
│   └── global.css      # Système de design CESIZen
└── types/              # Types TypeScript
```

## Auteur

Adame Boussaida — Projet CDA CESI 2025/2026
