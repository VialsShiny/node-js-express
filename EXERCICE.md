# Exercice – Authentification et Autorisation par JWT

## Objectifs

L’objectif de cet exercice est de mettre en place un système d’authentification et d’autorisation basé sur des **JSON Web Tokens (JWT)** et des **scopes**.

### 1. API d’authentification
Créer une API d’authentification exposant la route suivante :

- **POST `/v2/login`**

Cette route devra :
- Authentifier un utilisateur
- Générer un **JWT**
- Inclure dans le token un **scope** représentant les droits de l’utilisateur (lecture, écriture, etc.)

### 2. API de service protégée
Créer une seconde API correspondant à un service de votre choix (ex : paiements, commandes, produits, etc.).

Cette API devra :
- Exposer au moins une route protégée
- Restreindre l’accès à cette route uniquement aux requêtes contenant un **JWT valide**
- Vérifier que le **scope** présent dans le JWT autorise l’accès à la ressource (lecture ou écriture)

## Exemple d’architecture

### API d’authentification
- **Route** : `/v2/login`
- **Résultat** : JWT contenant le scope suivant :
  - `payments:rw`

### API Payments
- **Route protégée** : `/payments`
- **Règles d’accès** :
  - Accès autorisé si le JWT contient :
    - `payments:rw` (lecture et écriture)
    - ou `payments:r` (lecture seule)

Tout JWT ne contenant pas l’un de ces scopes devra être refusé.
