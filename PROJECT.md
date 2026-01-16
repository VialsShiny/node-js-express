# Projet : API Authentification et Services avec JWT

## Étape 1 : Authentification et accès restreint

1. Créer une **API d’authentification** qui génère un **JWT** sur la route `/v2/login`.

   * Le token doit contenir les **droits de l’utilisateur** dans le champ `scope`.

2. Créer une **API de service** de votre choix (ex: paiements, blog, réseau social) avec au moins **une route restreinte**.

   * Seuls les utilisateurs dont le **JWT contient le scope nécessaire** peuvent accéder à cette route.

**Exemple :**

```
API Authentification -> /v2/login -> JWT avec scope "payments:rw"
API Paiements       -> /payments -> Autorise uniquement les JWT avec scope "payments:rw" ou "payments:r"
```

---

## Étape 2 : Gestion des ressources

1. Ajouter une route `POST /payments` pour **créer un Payment** dans un tableau global.

   * L’utilisateur doit avoir le **scope `payments:rw`** pour pouvoir créer un Payment.

2. Ajouter une route `DELETE /payments/:paymentid` pour **supprimer un Payment** par ID.

   * L’utilisateur doit avoir le **scope `payments:rw`**.

3. Modifier la route `GET /payments/:paymentid` pour **obtenir un Payment** par ID.

   * Accessible uniquement si le JWT contient **`payments:r` ou `payments:rw`**.

---

## Projet : Développement complet

### Objectif principal

Développer une API complète comprenant :

1. **API d’authentification**

   * Génère des tokens JWT pour les utilisateurs.
   * Contient au minimum **2 utilisateurs** avec **2 rôles différents** (ex: administrateur et utilisateur standard).
   * Les données utilisateurs et rôles sont **stockées dans une base SQLite**.
   * Lors du login, l’API renvoie un **token JWT signé**.

2. **API de services** sur un thème de votre choix (blog, banque, réseau social…)

   * Doit contenir **4 routes** pour **lire, écrire, modifier et supprimer** la ressource.
   * Chaque route **autorise ou restreint l’accès** en fonction du **scope présent dans le JWT**.

     * Ex: pour écrire une ressource, le JWT doit contenir `votreressource:rw`.

---

### Exemple d’organisation des rôles et scopes

| Utilisateur                                       | Rôle      | Scopes                             |
| ------------------------------------------------- | --------- | ---------------------------------- |
| [admin@email.fr](mailto:admin@email.fr)           | admin     | payments:rw, invoices:rw, users:rw |
| [accountant@email.fr](mailto:accountant@email.fr) | comptable | payments:r, invoices:rw            |
| [support@email.fr](mailto:support@email.fr)       | support   | payments:r, invoices:r             |
| [customer@email.fr](mailto:customer@email.fr)     | client    | payments:r                         |

> Ces scopes définissent quels JWT peuvent accéder à quelles routes dans l’API service.

---

### Bonnes pratiques

* **Hasher les mots de passe** avant stockage (ex: bcrypt).
* **Activer les foreign keys** dans SQLite (`PRAGMA foreign_keys = ON`).
* Respecter la **structure des JWT** : inclure `id`, `email` et `scope` dans le payload.
* Toujours **vérifier le scope** avant d’exécuter les opérations sensibles.
