## Étape 2 – API Payments protégée par JWT

Dans cette étape, vous allez créer une API **Payments** avec des routes sécurisées selon le **scope** présent dans le JWT.

### 1. Préparer le tableau global des payments
```js
/** @type {Payment[]} */
const payments = [];
````

---

### 2. Créer un Payment – POST `/payments`

* **Description** : Permet de créer un nouveau paiement.
* **Condition d’accès** : le JWT doit contenir le **scope `payments:rw`**.
* **Exemple de payload** :

```json
{
  "userId": 4,
  "price": 300.00,
  "date": "2026-01-15T12:00:00Z"
}
```

* **Comportement** :

  * Vérifier le JWT et son scope.
  * Ajouter le Payment dans le tableau `payments`.
  * Retourner le Payment créé avec un `id` unique.

---

### 3. Supprimer un Payment – DELETE `/payments/:paymentid`

* **Description** : Supprime un paiement existant par son `id`.
* **Condition d’accès** : le JWT doit contenir le **scope `payments:rw`**.
* **Comportement** :

  * Vérifier le JWT et son scope.
  * Chercher le paiement correspondant dans le tableau.
  * Le supprimer si trouvé.
  * Retourner un message de confirmation ou une erreur si le paiement n’existe pas.

---

### 4. Obtenir un Payment – GET `/payments/:paymentid`

* **Description** : Récupère un paiement par son `id`.
* **Condition d’accès** : le JWT doit contenir le **scope `payments:r` ou `payments:rw`**.
* **Comportement** :

  * Vérifier le JWT et son scope.
  * Retourner le Payment correspondant si trouvé.
  * Sinon, retourner une erreur 404.

---

### 5. Résumé des routes et scopes

| Méthode | Route                | Scope requis              | Action                        |
| ------- | -------------------- | ------------------------- | ----------------------------- |
| POST    | /payments            | payments:rw               | Créer un nouveau payment      |
| DELETE  | /payments/:paymentid | payments:rw               | Supprimer un payment existant |
| GET     | /payments/:paymentid | payments:r ou payments:rw | Obtenir un payment par id     |

---

💡 **Conseil pratique** :

* Créez un **middleware** pour valider le JWT et les scopes afin de ne pas répéter le code sur chaque route.
* Vérifiez toujours que le `paymentid` existe avant toute modification ou suppression.
* Utilisez des IDs uniques pour chaque Payment (ex : incrément ou UUID).
