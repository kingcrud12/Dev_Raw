# Git pour les Développeurs : Le Guide de Survie

Si vous codez sans Git, vous jouez avec le feu. Vous connaissez probablement les dossiers du type `projet_final`, `projet_final_v2`, `projet_final_VRAIMENT_FINAL`. Git est un logiciel de **contrôle de version** qui met fin à ce chaos. C'est une véritable machine à remonter le temps pour votre code.

Dans ce guide pratique, nous allons explorer les scénarios quotidiens d'un développeur avec Git, de l'initialisation jusqu'à la résolution des redoutables conflits de fusion.

---

## Sommaire

1. [Scénario 1 : Initialisation et premier commit](#1-scénario-1--initialisation-et-premier-commit)
2. [Scénario 2 : Inspecter ses modifications (Status & Diff)](#2-scénario-2--inspecter-ses-modifications-status--diff)
3. [Scénario 3 : Le plan de secours avec `git stash`](#3-scénario-3--le-plan-de-secours-avec-git-stash)
4. [Scénario 4 : Comprendre et résoudre les Conflits](#4-scénario-4--comprendre-et-résoudre-les-conflits)

---

## 1. Scénario 1 : Initialisation et premier commit

Vous venez de commencer un tout nouveau projet sur votre ordinateur. Pour l'instant, c'est juste un dossier normal. Vous voulez que Git commence à surveiller les fichiers.

**L'Initialisation :**
```bash
# Placez-vous dans votre dossier
cd mon_super_projet

# Demandez à Git de surveiller ce dossier
git init
```
*Git crée un dossier caché `.git` qui va stocker tout l'historique.*

**Le fichier `.gitignore` :**
Avant de faire quoi que ce soit, créez un fichier nommé `.gitignore`. Il indique à Git quels fichiers **ignorer** (par exemple, les mots de passe, ou les énormes dossiers `node_modules`).

**La Sauvegarde (Commit) :**
```bash
# 1. On prépare les fichiers (on les met dans l'ascenseur)
git add .

# 2. On prend la photo (on ferme les portes de l'ascenseur)
git commit -m "init: premier commit du projet"
```
Votre code est maintenant versionné.

---

## 2. Scénario 2 : Inspecter ses modifications (Status & Diff)

Vous travaillez depuis deux heures sur votre code, et vous ne vous souvenez plus exactement de ce que vous avez modifié avant de faire votre *commit*. 

**Voir l'état général :**
```bash
git status
```
Cette commande vous dira en rouge quels fichiers ont été modifiés, et en vert ceux qui sont prêts à être "commités" (staged).

**Voir les lignes de code exactes :**
```bash
git diff
```
Cette commande magique affiche votre code comme un document corrigé :
- Les lignes en **rouge** commençant par `-` sont les lignes que vous avez supprimées.
- Les lignes en **vert** commençant par `+` sont les lignes que vous avez ajoutées.
C'est indispensable pour relire son propre travail avant de l'envoyer !

---

## 3. Scénario 3 : Le plan de secours avec `git stash`

**La situation :** Vous êtes en train de coder une super fonctionnalité sur le fichier `App.js`. Votre code est à moitié cassé, il ne compile pas. Soudain, votre patron vous appelle : *"Il y a un bug critique en production, il faut le réparer tout de suite !"*

Vous ne pouvez pas faire un `commit` de votre code cassé. Vous ne voulez pas non plus supprimer votre travail. **La solution s'appelle le Stash (la cachette).**

```bash
# 1. Cachez votre travail en cours (votre dossier redevient propre)
git stash

# 2. Changez de branche pour aller réparer le bug de production
git checkout main
# ... Vous réparez le bug et faites votre commit ...

# 3. Revenez sur votre branche de fonctionnalité
git checkout ma-branche-feature

# 4. Ressortez votre travail de la cachette !
git stash pop
```
`git stash` prend tous vos fichiers modifiés non-commités, les met dans un tiroir virtuel temporaire, et vous redonne un dossier parfaitement propre. `git stash pop` ouvre le tiroir et remet vos fichiers exactement là où vous les aviez laissés.

---

## 4. Scénario 4 : Comprendre et résoudre les Conflits

C'est la bête noire des développeurs débutants : **le Conflit de Fusion (Merge Conflict)**.

### C'est quoi un conflit ?
Git est très intelligent. Si vous modifiez le haut du fichier `index.html` et que votre collègue modifie le bas du même fichier, Git fusionnera les deux sans rien dire.
**Mais**, si vous et votre collègue modifiez **exactement la même ligne** du même fichier, Git panique. Il ne sait pas qui a raison. Il arrête tout et crée un *conflit*.

### À quoi ça ressemble ?
Si vous ouvrez le fichier en conflit dans votre éditeur (VS Code), vous verrez ceci injecté par Git :

```html
<<<<<<< HEAD
<button class="btn-blue">Envoyer</button>
=======
<button class="btn-red">Valider</button>
>>>>>>> branche-de-mon-collegue
```

### Comment le régler ?
1. Git vous montre **votre** version (`HEAD`) en haut, et la **version entrante** (celle du collègue) en bas, séparées par `=======`.
2. Pour régler le conflit, vous devez **effacer manuellement** les balises moches (`<<<<<<<`, `=======`, `>>>>>>>`) et ne garder que le code final que vous souhaitez conserver.

Par exemple, vous supprimez tout pour ne garder que :
```html
<button class="btn-purple">Envoyer et Valider</button>
```

3. Une fois que le fichier est propre, vous dites à Git que le conflit est réglé :
```bash
# J'ajoute le fichier corrigé
git add index.html

# Je finalise la fusion
git commit -m "fix: résolution du conflit sur le bouton"
```

> [!TIP]
> Ne paniquez jamais face à un conflit. Lisez calmement les lignes encadrées par Git. De plus, les éditeurs modernes comme VS Code proposent des boutons cliquables au-dessus du conflit : *Accept Current Change*, *Accept Incoming Change*, ou *Accept Both Changes*.

---

## En Résumé

- **`git init`** : Je démarre un suivi.
- **`git status` & `git diff`** : Je regarde où j'en suis.
- **`git stash`** : Je mets mon code de côté pour une urgence.
- **Les conflits** : Je les règle calmement en choisissant quelle ligne de code doit survivre.
