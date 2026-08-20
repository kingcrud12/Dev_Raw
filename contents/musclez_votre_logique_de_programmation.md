# Musclez votre logique de programmation : De l'algorithmique à la réalisation d'un projet

La programmation n'est pas qu'une question de syntaxe ou de connaissance de langages. C'est avant tout un état d'esprit, une façon de penser et de résoudre des problèmes. Que vous soyez un développeur débutant ou confirmé, la capacité à découper la complexité et à apprendre efficacement est ce qui vous distinguera.

Dans ce guide, nous allons voir comment muscler cette logique, avec une méthode de décomposition, **40 exercices pratiques** classés par difficulté, et des exemples concrets de résolution pas-à-pas.

---

## Sommaire

1. [L'Art de l'Algorithmique : La méthode P.O.L.I.R](#1-lart-de-lalgorithmique--la-méthode-polir)
2. [Les 40 Exercices Pratiques (De facile à Difficile)](#2-les-40-exercices-pratiques-de-facile-à-difficile)
3. [Exemples de Résolution : Comment je décompose le problème](#3-exemples-de-résolution--comment-je-décompose-le-problème)
4. [Le découpage de projets (Approche Systémique)](#4-le-découpage-de-projets-approche-systémique)
5. [La réalisation : De l'idée au MVP](#5-la-réalisation--de-lidée-au-mvp)

---

## 1. L'Art de l'Algorithmique : La méthode P.O.L.I.R

Face à un problème complexe, la pire erreur est de foncer tête baissée dans le code. Pour structurer votre pensée, appliquez cette méthode :

- **Comprendre le Problème (P)** : Lisez l'énoncé 3 fois. Identifiez clairement les entrées (ce qu'on vous donne) et les sorties (ce que vous devez retourner).
- **Observer les cas particuliers (O)** : Que se passe-t-il si la liste est vide ? Si le nombre est négatif ? Ces "Edge Cases" font souvent planter les algorithmes.
- **Logique en français (L)** : Écrivez la solution sur un papier, en langage humain (le pseudo-code).
- **Implémenter (I)** : Traduisez votre pseudo-code dans votre langage de programmation.
- **Refactoriser (R)** : Votre code fonctionne ? Super. Demandez-vous maintenant : peut-on le rendre plus lisible ou plus rapide ?

---

## 2. Les 40 Exercices Pratiques (De facile à Difficile)

Voici une liste de 40 exercices classiques pour muscler votre cerveau, regroupés par niveaux de difficulté.

### Niveau 1 : Les Fondations (Logique de base, boucles, conditions)
1. Afficher "Bonjour le monde".
2. Inverser une chaîne de caractères.
3. Vérifier si un mot est un palindrome (se lit dans les deux sens).
4. Compter le nombre de voyelles dans une phrase.
5. Trouver le plus grand nombre dans une liste de nombres.
6. Calculer la factorielle d'un entier `N`.
7. **FizzBuzz** : Afficher les nombres de 1 à 100. Remplacer les multiples de 3 par "Fizz", de 5 par "Buzz", et de 3 et 5 par "FizzBuzz".
8. Calculer la somme des éléments d'un tableau.
9. Trouver le nombre minimum dans un tableau.
10. Convertir une température de degrés Celsius en Fahrenheit.

### Niveau 2 : Manipulation de Données (Tableaux, Objets, Strings)
11. Supprimer les doublons d'un tableau.
12. Trouver la fréquence d'apparition de chaque mot dans une phrase.
13. Fusionner deux tableaux déjà triés en un seul tableau trié.
14. **Anagrammes** : vérifier si deux mots utilisent exactement les mêmes lettres.
15. Trouver le premier caractère non répétitif dans une chaîne.
16. Inverser l'ordre des mots dans une phrase (sans inverser les lettres).
17. Vérifier l'équilibre des parenthèses dans une expression (ex: `(())` est valide, `(()` ne l'est pas).
18. Trouver l'intersection (les éléments communs) entre deux listes.
19. Convertir un chiffre romain (ex: "XIV") en nombre entier (14).
20. **Two Sum** : Trouver les deux nombres dans un tableau dont la somme est égale à une cible donnée.

### Niveau 3 : Algorithmes Intermédiaires (Tri, Recherche, Récursivité)
21. Implémenter une recherche dichotomique (Binary Search).
22. Trier un tableau manuellement avec le tri à bulles (Bubble Sort).
23. Trier un tableau avec l'algorithme de tri fusion (Merge Sort).
24. Générer les `N` premiers nombres de la suite de Fibonacci.
25. Trouver le plus long sous-tableau avec une somme spécifique.
26. Détecter la présence d'un cycle dans une liste chaînée.
27. Aplatir un tableau imbriqué à N dimensions (Flatten array).
28. Lister toutes les permutations (combinaisons possibles) d'une chaîne de caractères.
29. Le problème du sac à dos (Knapsack Problem) - version simple.
30. Trouver le plus long préfixe commun entre une liste de mots (ex: "pomme", "pommette" -> "pomme").

### Niveau 4 : Algorithmes Avancés (Graphes, Arbres, Programmation Dynamique)
31. Inverser (miroir) un arbre binaire.
32. Trouver le chemin le plus court dans un labyrinthe (Algorithme BFS).
33. Problème du voyageur de commerce (Trouver le chemin le plus court reliant plusieurs villes).
34. Trouver la profondeur maximale d'un arbre binaire.
35. Valider si un arbre est un Arbre Binaire de Recherche (BST) valide.
36. Parcours en profondeur d'un graphe (Algorithme DFS).
37. Créer un solveur de Sudoku utilisant le "Backtracking".
38. Trouver le sous-tableau contigu ayant la plus grande somme (Algorithme de Kadane).
39. **Nombre d'îles** : Compter le nombre de blocs de terre connectés dans une matrice de 0 (eau) et 1 (terre).
40. **L'escalier** : Combien de façons différentes de monter `N` marches si on peut faire des pas de 1 ou 2 marches à la fois ? (Programmation dynamique).

---

## 3. Exemples de Résolution : Comment je décompose le problème

Plutôt que de simplement vous donner la réponse, voici comment mon cerveau fonctionne (selon la méthode P.O.L.I.R) pour résoudre trois exercices de cette liste.

### Exemple 1 (Niveau 1) : Le Palindrome
*Sujet : Écrire une fonction qui vérifie si un mot est un palindrome (ex: "kayak").*

- **P (Problème)** : Entrée = une chaîne (String). Sortie = un booléen (Vrai ou Faux).
- **O (Observation)** : Attention aux majuscules ("Kayak") et aux espaces.
- **L (Logique en français)** :
  1. Je prends le mot d'origine.
  2. Je le transforme pour qu'il soit tout en minuscules (pour éviter les erreurs).
  3. Je crée une nouvelle version de ce mot, mais inversée.
  4. Je compare le mot d'origine (en minuscules) avec le mot inversé. S'ils sont identiques, c'est un palindrome.
- **I (Implémentation en JavaScript)** :
  ```javascript
  function isPalindrome(word) {
    const cleanWord = word.toLowerCase();
    // split('') coupe en lettres, reverse() inverse, join('') recolle
    const reversedWord = cleanWord.split('').reverse().join(''); 
    return cleanWord === reversedWord;
  }
  ```

### Exemple 2 (Niveau 2) : Two Sum (Somme de Deux)
*Sujet : Étant donné un tableau d'entiers et une cible, trouvez les DEUX nombres du tableau qui additionnés donnent la cible.*

- **P (Problème)** : Entrée = Tableau `[2, 7, 11, 15]`, Cible = `9`. Sortie = `[2, 7]`.
- **O (Observation)** : Un nombre ne peut pas être utilisé deux fois. La liste n'est pas forcément triée.
- **L (Logique en français)** :
  - *La version naïve (Brute Force)* : Je prends le premier nombre (2), et je l'additionne avec tous les suivants (7, puis 11, puis 15) pour voir si ça fait 9. Je recommence pour chaque nombre. C'est lent.
  - *La version intelligente (Mathématique)* : Si j'ai `2` et que ma cible est `9`, je sais que je cherche `7` (Cible - Actuel). Je peux utiliser un dictionnaire (Hashmap) pour me "souvenir" des nombres que j'ai déjà vus !
  1. Je crée un dictionnaire vide.
  2. Je parcours chaque nombre de la liste.
  3. Je calcule ce qui me manque : `manque = cible - nombre actuel`.
  4. Si ce qui me manque est déjà dans mon dictionnaire, bingo j'ai trouvé !
  5. Sinon, j'enregistre mon nombre actuel dans le dictionnaire et je passe au suivant.
- **I (Implémentation en Python)** :
  ```python
  def two_sum(nums, target):
      vus = {} # Mon dictionnaire
      for nombre in nums:
          manque = target - nombre
          if manque in vus:
              return [manque, nombre]
          vus[nombre] = True # Je me souviens l'avoir vu
      return []
  ```

### Exemple 3 (Niveau 4) : Nombre d'îles
*Sujet : Vous avez une grille 2D. "1" représente la terre, "0" représente l'eau. Comptez combien il y a d'îles (blocs de terre adjacents verticalement/horizontalement).*

- **P (Problème)** : Entrée = Tableau de tableaux de 1 et 0. Sortie = un Entier (le compte).
- **O (Observation)** : Si je vois un `1`, c'est une île. Mais comment ne pas recompter ce même `1` et tous ceux qui lui sont collés ?
- **L (Logique en français)** :
  - C'est un problème de parcours de Graphe (DFS - Depth First Search).
  1. Je vais parcourir chaque case de la carte, de haut en bas, de gauche à droite.
  2. Si je tombe sur de l'eau (`0`), je l'ignore.
  3. Si je tombe sur une terre (`1`), j'ai trouvé une nouvelle île ! J'augmente mon compteur de +1.
  4. MAIS, pour ne pas la recompter à la prochaine case, je dois "couler" cette île. J'appelle une fonction qui va transformer ce `1` en `0`, et qui va regarder en haut, en bas, à gauche, à droite pour faire la même chose sur les terres collées.
- **I (Implémentation en Java)** :
  ```java
  public int numIslands(char[][] grid) {
      int count = 0;
      for (int i = 0; i < grid.length; i++) {
          for (int j = 0; j < grid[0].length; j++) {
              if (grid[i][j] == '1') { // Terre trouvée !
                  count++;
                  sinkIsland(grid, i, j); // Je coule l'île entière
              }
          }
      }
      return count;
  }
  
  private void sinkIsland(char[][] grid, int i, int j) {
      // Si je sors de la carte ou que c'est de l'eau, j'arrête
      if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] == '0') return;
      
      grid[i][j] = '0'; // Je coule la terre actuelle
      // Je propage l'eau dans les 4 directions (La fameuse Récursivité !)
      sinkIsland(grid, i + 1, j); // Bas
      sinkIsland(grid, i - 1, j); // Haut
      sinkIsland(grid, i, j + 1); // Droite
      sinkIsland(grid, i, j - 1); // Gauche
  }
  ```

---

## 4. Le découpage de projets (Approche Systémique)

Une fois que l'algorithmique est maîtrisée pour les petits problèmes, il faut l'appliquer aux **gros projets**. C'est ici que la plupart des juniors échouent car la tâche semble monolithique. La clé de l'ingénierie logicielle est la **décomposition**.

### Étape 1 : Le "Macro" (Les Epics)
Quelles sont les grandes fonctionnalités de votre application ? (Exemple pour un Blog)
- L'Authentification des administrateurs.
- La gestion des articles (Créer, Éditer, Supprimer).
- L'affichage public.

### Étape 2 : Le "Micro" (Les User Stories)
Prenez le bloc "Gestion des articles" et découpez-le :
- *En tant qu'éditeur, je veux rédiger un article.*
- *En tant qu'éditeur, je veux glisser-déposer (Drag & Drop) mes articles pour changer leur ordre.*

### Étape 3 : La Technique (Les Tasks)
Prenez le ticket "Drag & Drop" et découpez-le techniquement :
1. *Base de données* : Ajouter une colonne `order_position` dans la table `Contents`.
2. *API Backend* : Créer la route `PUT /reorder` qui met à jour la base.
3. *Frontend* : Implémenter l'interface glisser-déposer en React.
4. *Liaison* : Appeler l'API lorsque la carte est relâchée.

> [!IMPORTANT]
> Ne commencez **jamais** à coder l'étape 3 avant d'avoir une vision claire et écrite de toutes les étapes. Utilisez un outil comme Trello ou Github Projects.

---

## 5. La réalisation : De l'idée au MVP

Maintenant que vous avez vos tickets techniques, il est temps de coder. 

### Coder le Minimum Viable Product (MVP)
Votre premier objectif n'est pas de faire le code le plus beau du monde. C'est de créer le MVP : la version la plus basique qui fonctionne.
- Oubliez l'optimisation extrême au début.
- L'objectif principal : **Que la donnée passe de l'utilisateur à la base de données sans erreur.**

### La règle du "Make it Work, Make it Right, Make it Fast"
1. **Make it Work (Faites que ça marche)** : Écrivez du code, même laid, pour que la fonctionnalité remplisse son rôle.
2. **Make it Right (Faites-le bien)** : Une fois que ça marche, nettoyez. Renommez vos variables, séparez les fonctions trop longues, appliquez les bonnes pratiques (Clean Code).
3. **Make it Fast (Rendez-le rapide)** : Seulement si vous avez des problèmes de performance, optimisez les algorithmes (ex: utiliser un dictionnaire au lieu d'une boucle imbriquée). *L'optimisation prématurée est la racine de tous les maux.*
