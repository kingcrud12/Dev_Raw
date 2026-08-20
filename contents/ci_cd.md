# Le Guide Ultime de CI/CD avec GitHub Actions

Si vous êtes développeur, vous connaissez ce sentiment angoissant au moment de mettre en ligne une nouvelle fonctionnalité : *"Est-ce que ça va casser la production ?"*. 

Pendant des années, le déploiement était un processus manuel, lent et sujet à l'erreur humaine. Aujourd'hui, avec l'avènement du **CI/CD** (Continuous Integration / Continuous Deployment), les équipes déploient plusieurs dizaines de fois par jour, en toute sérénité.

Dans ce guide, nous allons démystifier le CI/CD et apprendre à automatiser vos workflows avec l'outil le plus populaire du marché : **GitHub Actions**.

---

## Qu'est-ce que le CI/CD ?

L'acronyme CI/CD désigne deux phases distinctes mais complémentaires :

1. **L'Intégration Continue (CI)** : C'est la phase de vérification. À chaque fois qu'un développeur pousse son code sur GitHub (git push), un serveur distant se réveille. Il va compiler le code, vérifier la syntaxe (Linter) et lancer tous les tests unitaires. Si tout est vert, le code est valide. S'il y a une erreur, le code est bloqué.
2. **Le Déploiement Continu (CD)** : Une fois le code validé par la phase CI, la phase CD prend le relais. Elle va automatiquement packager l'application (ex: création d'une image Docker) et la déployer sur vos serveurs de production ou de pré-production (Vercel, AWS, serveur Linux, etc.).

L'objectif final ? Vous tapez `git push`, vous allez prendre un café, et votre application est en ligne.

---

## 1. Créer son premier Workflow GitHub Actions (La CI)

GitHub Actions utilise des fichiers de configuration au format **YAML**. Ces fichiers doivent être placés à la racine de votre projet, dans un dossier bien spécifique : `.github/workflows/`.

Créons un fichier `.github/workflows/ci.yml` pour une application Node.js (React, Express...) :

```yaml
# Le nom de notre workflow, visible sur l'interface GitHub
name: Intégration Continue (CI)

# 1. QUAND est-ce que ce workflow doit se déclencher ?
on:
  push:
    branches:
      - main # À chaque push sur la branche main
  pull_request:
    branches:
      - main # Ou lors d'une Pull Request vers main

# 2. QUE doit-il faire ? (Les Jobs)
jobs:
  test-and-lint:
    name: Tests & Linter
    # On précise sur quel type de machine virtuelle le code va tourner
    runs-on: ubuntu-latest

    # 3. QUELLES sont les étapes à suivre ? (Les Steps)
    steps:
      # Étape 1 : Récupérer notre code source depuis le dépôt
      - name: 📥 Checkout du code
        uses: actions/checkout@v4

      # Étape 2 : Installer Node.js sur la machine
      - name: ⚙️ Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm' # Active le cache pour accélérer les futurs déploiements

      # Étape 3 : Installer les dépendances (node_modules)
      - name: 📦 Installation des dépendances
        run: npm ci # 'npm ci' est préféré à 'npm install' pour la CI

      # Étape 4 : Lancer le linter (Vérification de la syntaxe)
      - name: 🔎 Lancement du Linter
        run: npm run lint

      # Étape 5 : Lancer les tests
      - name: 🧪 Lancement des Tests
        run: npm run test
```

### Explication de l'anatomie :
- **`on`** : Les "Triggers". Cela définit quels événements réveillent le workflow.
- **`jobs`** : Un job est une tâche globale (ex: Tester le code). Les jobs tournent en *parallèle* par défaut.
- **`steps`** : C'est la liste d'instructions séquentielle exécutée au sein d'un Job. Un `uses` fait appel à une Action pré-fabriquée par la communauté (comme `actions/checkout`), tandis qu'un `run` permet de lancer une simple commande Bash.

---

## 2. Pousser en production (Le CD)

Maintenant que nous sommes sûrs que notre code est parfait grâce à la CI, nous voulons le déployer. 

Imaginons que nous voulons nous connecter en SSH à notre serveur (VPS) pour tirer la nouvelle version du code et relancer notre application Docker.

Créons le fichier `.github/workflows/cd.yml` :

```yaml
name: Déploiement Continu (CD)

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Déploiement sur le serveur de Production
    runs-on: ubuntu-latest
    
    steps:
      - name: 🚀 Déploiement via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/mon-projet
            git pull origin main
            docker-compose up -d --build
            echo "Déploiement terminé avec succès !"
```

> [!WARNING]
> Vous remarquez la syntaxe `${{ secrets.xxx }}` ? Il est formellement interdit de mettre des mots de passe, des IP ou des clés privées en clair dans un fichier de code !

---

## 3. Sécurité : Gérer ses Secrets

Pour que l'exemple ci-dessus fonctionne, vous devez dire à GitHub quelles sont les vraies valeurs de vos secrets.

1. Allez sur la page de votre dépôt GitHub sur internet.
2. Cliquez sur l'onglet **Settings**.
3. Dans le menu de gauche, allez dans **Secrets and variables** > **Actions**.
4. Cliquez sur le bouton vert **New repository secret**.
5. Créez les secrets `SERVER_HOST` (l'IP de votre serveur), `SERVER_USER` (ex: root ou ubuntu), et `SSH_PRIVATE_KEY` (votre clé privée).

Pendant l'exécution, GitHub masquera automatiquement la valeur de ces secrets dans les logs (ils apparaîtront sous la forme `***`).

---

## 4. Les Bonnes Pratiques du CI/CD

Pour que votre CI/CD soit un outil puissant et non un frein, voici quelques règles d'or :

- **Fail Fast (Échouer vite)** : Placez les étapes les plus rapides au début. Si votre Linter prend 3 secondes et vos tests End-to-End prennent 10 minutes, lancez le Linter d'abord. Si le code est mal formaté, la CI s'arrêtera immédiatement au bout de 3 secondes sans gâcher 10 minutes d'attente.
- **Utilisez le Cache** : L'installation des dépendances (`npm install`, téléchargement des modules Go, etc.) est ce qui prend le plus de temps. Utilisez les fonctionnalités de cache de GitHub Actions (comme montré dans l'étape `setup-node`) pour diviser le temps de vos déploiements par deux.
- **Ne déployez pas sur une PR** : La règle d'or est simple : La CI tourne sur toutes les branches (pour valider la Pull Request). La CD ne tourne **QUE** sur la branche `main` (ou `master`).

## Conclusion

Le CI/CD n'est pas qu'un outil technique, c'est un filet de sécurité psychologique. 
Grâce à lui, vous n'aurez plus peur de faire une mise en production le vendredi soir. GitHub Actions s'occupe de la vérification et des tâches répétitives, vous laissant vous concentrer sur ce que vous faites de mieux : concevoir de belles fonctionnalités.
