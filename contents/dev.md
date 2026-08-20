# Le Cycle de Vie d'une Fonctionnalité : De l'Idée à la Production

Dans le monde professionnel, on ne code jamais "au hasard" directement sur la branche principale d'un projet. Le développement logiciel suit un flux de travail (Workflow) très structuré pour garantir la stabilité de l'application et faciliter le travail en équipe.

Pour illustrer ce processus de bout en bout, nous allons prendre un exemple très concret tiré de ce projet (Blog + CRM + API) : **La mise en place du Drag & Drop dans le CRM.**

Voici comment un développeur professionnel traiterait cette fonctionnalité, de la lecture du ticket Jira jusqu'à la mise en production.

---

## Étape 1 : La lecture du Ticket (Le Besoin)

Tout commence toujours par un ticket de gestion de projet (sur Jira, Trello ou Linear). Le ticket décrit le besoin utilisateur (souvent appelé *User Story*).

> **Ticket : CMS-42**
> **Titre :** Réorganisation manuelle des contenus (Drag & Drop)
> **Description :** *En tant qu'administrateur, je veux pouvoir réorganiser l'ordre de mes articles, guides et tutoriels dans le CRM par un simple glisser-déposer, afin que cet ordre soit respecté sur le blog public.*
> **Critères d'acceptation :** 
> - L'UI doit permettre le drag & drop visuel.
> - L'ordre doit être sauvegardé en base de données.
> - Le blog public doit afficher les éléments dans ce nouvel ordre.

---

## Étape 2 : Le Découpage Technique

Avant d'écrire la moindre ligne de code, le développeur "découpe" le ticket métier en **sous-tâches techniques** (Sub-tasks). C'est l'étape la plus importante : 

1. **Backend (Base de données)** : Ajouter un champ `order_position` (entier) dans la table `Contents` (GORM).
2. **Backend (API)** : Modifier les routes `GET` pour inclure `ORDER BY order_position ASC`.
3. **Backend (API)** : Créer une nouvelle route `PUT /api/crm/contents/reorder` qui reçoit un tableau d'IDs et met à jour leurs positions.
4. **Frontend (CRM)** : Créer un composant ou un Hook React pour gérer le Drag & Drop HTML5.
5. **Frontend (CRM)** : Lier le relachement de la souris (Drop) à l'appel de la nouvelle route API.

---

## Étape 3 : Git et la création de la branche de travail

Il est formellement interdit de coder directement sur la branche `main` (qui représente la production). Nous utilisons une méthode appelée **GitFlow** ou **GitHub Flow**.

Le développeur met à jour son code local et crée une branche temporaire isolée pour travailler sur sa fonctionnalité (*Feature branch*) :

```bash
# 1. Je m'assure d'être sur la branche principale et d'être à jour
git checkout main
git pull origin main

# 2. Je crée ma branche temporaire et je bascule dessus
# Convention de nommage : type/nom-du-ticket-ou-feature
git checkout -b feat/cms-42-drag-and-drop
```
*(Désormais, tout ce que je code n'impactera que cette branche).*

---

## Étape 4 : Le Développement et les Tests

Le développeur exécute ses sous-tâches une par une.

1. **Il modifie le modèle Go :**
```go
type Content struct {
	// ...
	OrderPosition int `json:"orderPosition"`
}
```

2. **Il implémente le Frontend React :**
Il crée son hook `useDragAndDrop` et modifie `Dashboard.tsx`.

3. **Les Tests Locaux :**
Avant d'envoyer son code, le développeur s'assure que tout fonctionne sur sa machine.
- Il lance le serveur Go (`go run main.go`).
- Il lance le CRM (`pnpm dev`).
- Il glisse une carte, vérifie que le visuel répond, et vérifie dans l'onglet *Network* de son navigateur que l'API renvoie bien un statut `200 OK`.

4. **Les Commits :**
Le code fonctionne ! Il "sauvegarde" son travail avec des messages clairs (souvent basés sur les *Conventional Commits*) :
```bash
git add .
git commit -m "feat(api): add order_position and reorder route"
git commit -m "feat(cms): implement drag and drop hook and UI"
```

---

## Étape 5 : La Pull Request (ou Merge Request)

Le code est prêt, mais il est toujours sur l'ordinateur du développeur. Il faut l'envoyer sur le serveur distant (GitHub/GitLab) :

```bash
git push origin feat/cms-42-drag-and-drop
```

À ce stade, le développeur va sur GitHub et clique sur **"Create Pull Request"** (PR).
Une Pull Request est une demande officielle : *"Voici mon code, puis-je l'intégrer à la branche principale ?"*.

### La Code Review (Revue de Code)
La PR ne se valide pas toute seule. Un autre développeur de l'équipe va être assigné pour faire une **Code Review**.
Il va lire les modifications de code (le fameux *Diff*) et chercher des failles :
- *"As-tu pensé à sécuriser la route `/reorder` pour que seuls les admins y accèdent ?"*
- *"Attention, cette boucle For pourrait être optimisée !"*

Si le relecteur demande des changements, le développeur corrige sur sa machine, refait un `git commit` et un `git push`. La PR se mettra à jour automatiquement.

---

## Étape 6 : Le Merge et la magie du CI/CD

Une fois que la Pull Request est approuvée par un pair (le fameux ou "LGTM" - Looks Good To Me) :

1. Le développeur clique sur le bouton **Merge Pull Request**.
2. GitHub prend tout le code de la branche `feat/crm-42-drag-and-drop` et le fusionne dans la branche `main`.
3. La branche temporaire est ensuite supprimée pour garder le projet propre.

**Et là, la magie opère !**
Si vous vous souvenez du tutoriel sur le CI/CD : un événement `push sur main` vient de se produire.
Le serveur GitHub Actions se réveille automatiquement, compile la nouvelle API avec la fonctionnalité Drag & Drop, et déploie le tout sur le serveur de production sans aucune action humaine supplémentaire.

Le ticket Jira peut enfin être glissé dans la colonne **"Done"**. Mission accomplie !
