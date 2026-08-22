# Le Langage Immortel : Découvrez le COBOL

Quand on parle de programmation aujourd'hui, on entend partout les mots Python, JavaScript, Go ou Rust. Mais dans l'ombre, un titan vieux de plus de 60 ans fait tourner l'économie mondiale : le **COBOL**. 

Souvent moqué pour sa syntaxe à rallonge et considéré comme "mort", le COBOL est en réalité plus vivant que jamais. Découvrons pourquoi ce langage fascine tant et comment il fonctionne !

---

## Sommaire

1. [Qu'est-ce que le COBOL ?](#1-quest-ce-que-le-cobol-)
2. [À quoi sert-il ? Le secret des Banques](#2-à-quoi-sert-il--le-secret-des-banques)
3. [Apprends le COBOL : Les Bases](#3-apprends-le-cobol--les-bases)
4. [Pourquoi apprendre le COBOL aujourd'hui ?](#4-pourquoi-apprendre-le-cobol-aujourdhui-)

---

## 1. Qu'est-ce que le COBOL ?

**COBOL** signifie *COmmon Business-Oriented Language*. 
Créé en 1959 (notamment par la pionnière de l'informatique Grace Hopper), il a été conçu avec un objectif très précis : **être lisible par des humains, même non-programmeurs.**

Contrairement aux langages modernes qui utilisent beaucoup de symboles (`{}`, `()`, `=>`), le COBOL se lit presque comme de l'anglais basique. Il n'a pas été pensé pour créer des jeux vidéos ou des interfaces web, mais pour manipuler des chiffres, générer des rapports financiers et gérer d'immenses bases de données.

---

## 2. À quoi sert-il ? Le secret des Banques

Si vous retirez de l'argent à un distributeur, si vous achetez un billet d'avion ou si vous payez vos impôts, il y a plus de 80% de chances qu'un programme COBOL se soit exécuté en arrière-plan.

**Mais pourquoi les banques ne le remplacent-elles pas par du Java ou du Python ?**

1. **La Stabilité absolue :** Un programme COBOL écrit en 1980 fonctionne toujours parfaitement aujourd'hui sur les Mainframes (supercalculateurs) d'IBM. Les banques ne veulent pas risquer de "casser" un système qui fonctionne sans bug depuis 40 ans.
2. **La Puissance de calcul :** Le COBOL excelle dans le *Batch Processing* (traitement par lots). Il est capable de lire, calculer et mettre à jour des millions de transactions bancaires en quelques secondes, chaque nuit, avec une précision mathématique inégalée (pas de problèmes d'arrondis de virgules flottantes comme on peut en voir dans d'autres langages).
3. **Le Coût du risque :** Réécrire des milliards de lignes de code COBOL existantes coûterait des centaines de millions d'euros aux grandes institutions, avec un risque critique de perte de données.

---

## 3. Apprends le COBOL : Les Bases

Le COBOL est très structuré. Un programme est toujours divisé en 4 **Divisions** obligatoires.

1. **IDENTIFICATION DIVISION** : Donne le nom du programme.
2. **ENVIRONMENT DIVISION** : Décrit l'ordinateur et les fichiers nécessaires.
3. **DATA DIVISION** : C'est ici qu'on déclare toutes les variables.
4. **PROCEDURE DIVISION** : C'est ici qu'on écrit la logique, le code qui s'exécute.

### Le fameux "Hello World" en COBOL

Voici à quoi ressemble un programme simple qui affiche "Hello World" :

```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO-WORLD.

       ENVIRONMENT DIVISION.

       DATA DIVISION.

       PROCEDURE DIVISION.
           DISPLAY 'Hello World!'.
           STOP RUN.
```
*(Remarque historique : Dans le temps, le code était écrit sur des cartes perforées. C'est pourquoi en COBOL, le code ne commence qu'à partir de la 8ème colonne ! Les 7 premiers espaces servaient à numéroter les lignes).*

### Les Variables (DATA DIVISION)

La déclaration des variables est très particulière. On utilise des numéros de "niveau" (souvent `01` pour la variable principale) et des clauses `PIC` (Picture) pour décrire le format de la donnée.

```cobol
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 NOM-UTILISATEUR  PIC X(20).  *> X signifie Alphanumérique (Texte), max 20 caractères
       01 AGE              PIC 9(2).   *> 9 signifie Numérique, max 2 chiffres
       01 SOLDE-BANCAIRE   PIC 9(5)V99. *> V représente la virgule (ex: 12345,67)
```

### La Logique (PROCEDURE DIVISION)

Rappelez-vous, le COBOL se lit comme de l'anglais :

```cobol
       PROCEDURE DIVISION.
           MOVE 'Alice' TO NOM-UTILISATEUR.
           MOVE 25 TO AGE.
           
           IF AGE > 18
               DISPLAY 'Accès autorisé pour ' NOM-UTILISATEUR
           ELSE
               DISPLAY 'Accès refusé'
           END-IF.

           COMPUTE SOLDE-BANCAIRE = SOLDE-BANCAIRE + 100.50.
           
           STOP RUN.
```

---

## 4. Pourquoi apprendre le COBOL aujourd'hui ?

On pourrait croire qu'apprendre un langage de 1959 est inutile. Pourtant, c'est l'un des métiers les plus lucratifs de l'informatique moderne !

La génération de programmeurs qui a écrit ces systèmes bancaires dans les années 70 et 80 part massivement à la retraite. Les banques, assurances et gouvernements font face à une pénurie critique de développeurs capables de maintenir (et moderniser) ces systèmes historiques.

Résultat : un développeur COBOL aujourd'hui est une perle rare très recherchée sur le marché du travail !

> [!TIP]
> Si ce guide vous a rendu curieux, vous pouvez essayer de compiler du COBOL gratuitement dans votre navigateur avec des outils comme **GnuCOBOL** ou via des plateformes d'apprentissage comme IBM Z Xplore.
