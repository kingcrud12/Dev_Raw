# Coder avec l'Intelligence Artificielle : Les Bonnes Pratiques

L'Intelligence Artificielle (IA) comme ChatGPT, Claude, ou GitHub Copilot, a révolutionné la façon dont nous écrivons du code. Aujourd'hui, coder avec une IA est devenu une norme dans l'industrie. Cependant, l'IA est un outil, pas un ingénieur logiciel. Si vous la pilotez mal, elle peut générer du code lent, obsolète, ou pire : des failles de sécurité béantes.

Ce guide explore les meilleures pratiques pour faire de l'IA un véritable "Pair Programmer" (binôme) tout en restant l'architecte maître de votre projet.

---

## Sommaire

1. [L'Art du Prompt pour le Développement](#1-lart-du-prompt-pour-le-développement)
2. [L'Architecture : Découper pour mieux régner](#2-larchitecture--découper-pour-mieux-régner)
3. [Le danger de la confiance aveugle (Hallucinations)](#3-le-danger-de-la-confiance-aveugle-hallucinations)
4. [Sécurité Web : Les consignes vitales à rappeler à l'IA](#4-sécurité-web--les-consignes-vitales-à-rappeler-à-lia)

---

## 1. L'Art du Prompt pour le Développement

L'IA n'est pas omnisciente. Si vous lui demandez "Fais un bouton d'ajout", elle devinera le langage, le framework, et le style, et vous donnera souvent un résultat inutile. Un bon *Prompt* doit contenir **le contexte**.

### Mauvais Prompt :
> *"Fais une fonction qui sauvegarde un article."*

### Bon Prompt :
> *"Je travaille sur une API en **Golang** avec le framework **Gin** et l'ORM **GORM**. Voici mon modèle `Article` : [coller le code du modèle]. Écris le contrôleur qui sauvegarde un article en base de données. Renvoie un code HTTP 201 en cas de succès, et 400 si le JSON est invalide."*

**L'astuce pour progresser :**
Ne demandez jamais juste "corrige ça". Demandez : *"Voici mon erreur [Coller l'erreur]. Corrige le code **et explique-moi** pourquoi ça a planté pour que je comprenne mon erreur."*

---

## 2. L'Architecture : Découper pour mieux régner

L'IA excelle pour résoudre des algorithmes spécifiques ou écrire un composant isolé. Par contre, elle est (pour le moment) mauvaise pour générer l'architecture entière d'une application d'un seul coup. 

Si vous lui demandez de coder une page entière "Dashboard" d'un bloc, elle va vous pondre un "composant monstre" de 1000 lignes impossible à maintenir.

**La méthode de travail :**
1. Utilisez l'IA pour réfléchir avec vous : *"Aide-moi à lister les petits composants nécessaires pour construire une page Dashboard en React."*
2. Une fois la liste validée, demandez le code **composant par composant** (le Bouton, puis la Barre de recherche, puis la Carte...).

---

## 3. Le danger de la confiance aveugle (Hallucinations)

L'IA n'exécute pas le code, elle devine la suite logique des mots. Cela entraîne ce qu'on appelle des **hallucinations** :
- L'IA invente des fonctions de librairies qui n'existent pas.
- L'IA utilise du code obsolète (ex: des "Class Components" en React au lieu des "Hooks", car elle a été entraînée sur de vieux tutos datant de 2017).

> [!WARNING]
> **Ne copiez-collez jamais sans lire !** Vous restez l'ingénieur en chef. C'est à vous de relire le code généré, d'en comprendre chaque ligne, et de le tester. Si une ligne vous paraît étrange, demandez-lui : *"Es-tu sûr que cette fonction existe dans la dernière version ?"* (Souvent, elle s'excusera et corrigera son erreur).

---

## 4. Sécurité Web : Les consignes vitales à rappeler à l'IA

L'IA est programmée pour vous donner la réponse la plus rapide et la plus facile. Par conséquent, **l'IA ignore souvent la sécurité par défaut**. Elle écrira du code qui "fonctionne", mais qui peut être piraté en 3 minutes. C'est à vous de lui rappeler les règles strictes.

Voici les rappels à inclure dans vos prompts lorsque vous codez des fonctionnalités sensibles :

### A. L'Injection SQL et les Failles XSS (Inputs)
Si vous demandez à l'IA de coder une barre de recherche ou un formulaire de contact, elle pourrait utiliser les entrées de l'utilisateur directement dans la base de données.
- **Rappel à donner à l'IA :** *"Génère le code du formulaire, mais assure-toi de **nettoyer (sanitize)** toutes les entrées utilisateurs pour éviter les attaques XSS et les injections SQL."*

### B. La Gestion des Secrets
L'IA adore mettre des clés d'API directement dans le code source par simplicité.
- **Rappel à donner à l'IA :** *"N'écris aucune clé secrète ou mot de passe en dur (hardcoded) dans le code. Utilise toujours des variables d'environnement (ex: fichier `.env`) pour récupérer les identifiants de la base de données ou les tokens API."*

### C. Authentification et Rôles (Authorization)
L'IA peut créer une route API qui supprime un article, mais elle oubliera souvent de vérifier si l'utilisateur qui l'appelle a le droit de le faire !
- **Rappel à donner à l'IA :** *"Ajoute un Middleware de sécurité sur cette route. Assure-toi que seul un utilisateur connecté ayant le rôle 'admin' puisse exécuter cette action de suppression. Si ce n'est pas le cas, renvoie une erreur 403 Forbidden."*

### D. La gestion des Erreurs (Ne pas bavarder)
En cas d'erreur serveur, l'IA a tendance à renvoyer toute l'erreur technique (le stack trace) au client, ce qui donne des informations précieuses aux hackers sur la structure de votre base de données.
- **Rappel à donner à l'IA :** *"Dans le bloc Catch (gestion des erreurs), log l'erreur technique dans la console du serveur, mais renvoie un message générique propre (ex: 'Une erreur interne est survenue') à l'utilisateur final."*

---

## En Résumé

Coder avec l'IA est un superpouvoir. Elle tape plus vite, elle connaît la syntaxe par cœur, et elle ne fatigue pas. Mais **l'IA est l'ouvrier, et vous êtes l'architecte**. 

Donnez-lui des ordres précis (Prompt Engineering), faites-la travailler sur de petites tâches isolées, et soyez intraitable sur ses choix en matière de sécurité.
