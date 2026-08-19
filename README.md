<div align="center">
  <h1>Devraw Blog & CMS</h1>
  <p>Plateforme de blogging au design néo-brutaliste et son outil de gestion de contenu (CMS).</p>
</div>

---

## 1. Qu'est-ce que Devraw Blog ?

**Devraw Blog** est un projet Fullstack composé de deux applications front-end distinctes servies par une API unique. Le projet adopte une identité visuelle très marquée (le style **Néo-brutaliste** : ombres dures, bordures épaisses, couleurs vives). 

Il offre :
- Aux **lecteurs** : Un blog en ligne rapide avec plusieurs sections (Articles, Guides, Tutoriels, Newsletter).
- Aux **éditeurs** : Un tableau de bord (CMS) sécurisé pour gérer et publier les contenus avec upload d'images.

### Stack Technique
- **Backend :** Golang (Gin, Gorm), base de données SQLite, authentification par JWT (via cookies HttpOnly), upload d'images avec Cloudinary.
- **Frontend Blog (`client_web`) :** React, TypeScript, Vite, Tailwind CSS.
- **Frontend CMS (`cms`) :** React, TypeScript, Vite, Tailwind CSS, Axios avec reverse proxy pour la sécurité.

---

## 2. Comment récupérer le projet ?

### Prérequis
- [Git](https://git-scm.com/)
- [Go](https://golang.org/) (Version 1.20+)
- [Node.js](https://nodejs.org/) (Version 18+)
- [pnpm](https://pnpm.io/) (Gestionnaire de paquets recommandé)

### Installation locale

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/votre-nom/devraw-blog.git
   cd devraw-blog
   ```

2. **Lancer l'API Golang :**
   Assurez-vous d'avoir le fichier `api/.env` contenant les clés JWT, Cloudinary et le FRONTEND_URL.
   ```bash
   cd api
   go mod tidy
   go run main.go
   ```
   *L'API sera disponible sur http://localhost:8080*

3. **Lancer le Blog (Côté Lecteur) :**
   Depuis la racine du projet :
   ```bash
   cd client_web
   pnpm install
   pnpm dev
   ```

4. **Lancer le CMS (Côté Éditeur) :**
   Depuis la racine du projet :
   ```bash
   cd crm
   pnpm install
   pnpm dev
   ```

---

## 3. Comment y contribuer ?

Nous travaillons en méthodologie Agile et utilisons le Feature Branch Workflow. Afin de garder un historique propre, merci de respecter les conventions suivantes.

### Conventions de branches
Le nom de vos branches doit indiquer le type de modification :
- `feature/nom-de-la-fonctionnalite` : Pour l'ajout d'une nouvelle fonctionnalité.
- `fix/nom-du-bug` : Pour la résolution d'un bug.
- `docs/mise-a-jour-readme` : Pour les modifications de la documentation.
- `refactor/nom-du-composant` : Pour l'optimisation ou la restructuration du code existant.

### Conventions de Commits
Veuillez utiliser les **Conventional Commits** pour vos messages :
- `feat: ajouter la page newsletter` (Nouvelle fonctionnalité)
- `fix: corriger l'upload cloudinary` (Correction de bug)
- `docs: mettre à jour le README` (Documentation)
- `chore: mettre à jour les dépendances pnpm` (Tâches de maintenance)
- `style: ajouter l'ombre neo-brutaliste` (Mise en forme)

### Processus de Pull Request (PR)
1. Créez votre branche depuis `main`.
2. Développez et commitez vos changements.
3. Poussez votre branche (`git push origin feature/votre-fonctionnalite`).
4. Ouvrez une PR sur GitHub et demandez une relecture avant la fusion.
