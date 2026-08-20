# Le Guide Ultime : Comprendre le Binaire de A à Z

Lorsque vous regardez un film en 4K, que vous écoutez de la musique ou que vous lisez ce texte, votre ordinateur ne voit absolument rien de tout cela. Pour lui, tout n'est qu'une suite infinie de **0** et de **1**.

Mais pourquoi ce choix étrange ? Comment une simple suite de zéros et de uns peut-elle représenter des couleurs, des lettres ou des sons ? C'est ce que nous allons démystifier dans ce guide, avec des exercices pratiques pour apprendre à "parler" binaire.

---

## Sommaire

1. [Pourquoi les ordinateurs utilisent-ils le binaire ?](#1-pourquoi-les-ordinateurs-utilisent-ils-le-binaire-)
2. [Compter en binaire : Le système de base 2](#2-compter-en-binaire--le-système-de-base-2)
3. [Comment traduire du Texte en Binaire ? (Le code ASCII)](#3-comment-traduire-du-texte-en-binaire--le-code-ascii)
4. [Comment les images et les sons sont-ils traduits ?](#4-comment-les-images-et-les-sons-sont-ils-traduits-)
5. [Exercices Pratiques (Avec Corrections)](#5-exercices-pratiques)

---

## 1. Pourquoi les ordinateurs utilisent-ils le binaire ?

Le cerveau humain compte en **base 10** (le système décimal) car nous avons 10 doigts. Nous utilisons 10 symboles : `0, 1, 2, 3, 4, 5, 6, 7, 8, 9`.

Un ordinateur, lui, n'a pas de doigts. Son "cerveau" (le processeur) est composé de milliards de minuscules interrupteurs électroniques appelés **transistors**.
Un interrupteur ne connaît que deux états :
- **Allumé** (Le courant passe) = **1**
- **Éteint** (Le courant ne passe pas) = **0**

C'est ce qu'on appelle le système **Binaire** (Base 2). Chaque `0` ou `1` est appelé un **Bit** (Binary Digit). Huit bits regroupés forment un **Octet** (Byte en anglais).

---

## 2. Compter en binaire : Le système de base 2

En base 10, chaque position d'un chiffre représente une puissance de 10 (Unités, Dizaines, Centaines, Milliers...).
En binaire (base 2), chaque position représente une **puissance de 2**, en doublant de valeur de droite à gauche : `1, 2, 4, 8, 16, 32, 64, 128...`

### De Binaire à Décimal
Prenons l'octet binaire : **`01001011`**.
Pour trouver sa valeur, on pose nos puissances de 2 au-dessus de chaque chiffre (de droite à gauche) :

| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 | (Puissances de 2) |
|---|---|---|---|---|---|---|---|---|
| 0 | 1 | 0 | 0 | 1 | 0 | 1 | 1 | (Notre Binaire) |

Il suffit d'additionner les valeurs où il y a un `1` :
`64 + 8 + 2 + 1 = 75`.
Donc, **`01001011`** en binaire vaut **`75`** en décimal.

### De Décimal à Binaire
Comment écrire **`42`** en binaire ? On cherche les plus grandes puissances de 2 qui rentrent dedans.
1. Est-ce que 128 rentre dans 42 ? Non -> `0`
2. Est-ce que 64 rentre dans 42 ? Non -> `0`
3. Est-ce que 32 rentre dans 42 ? **Oui** -> `1` *(Il reste 42 - 32 = 10)*
4. Est-ce que 16 rentre dans 10 ? Non -> `0`
5. Est-ce que 8 rentre dans 10 ? **Oui** -> `1` *(Il reste 10 - 8 = 2)*
6. Est-ce que 4 rentre dans 2 ? Non -> `0`
7. Est-ce que 2 rentre dans 2 ? **Oui** -> `1` *(Il reste 2 - 2 = 0)*
8. Est-ce que 1 rentre dans 0 ? Non -> `0`

Le résultat pour 42 est donc : **`00101010`**.

---

## 3. Comment traduire du Texte en Binaire ? (Le code ASCII)

Qui se charge de traduire le texte que vous tapez au clavier ? C'est le système d'exploitation et les logiciels, grâce à une table de traduction standardisée appelée **ASCII** (American Standard Code for Information Interchange).

Dans la table ASCII, chaque caractère (lettre, chiffre, symbole) correspond à un nombre décimal :
- La lettre **A** majuscule = 65
- La lettre **B** majuscule = 66
- La lettre **a** minuscule = 97
- L'espace = 32

### Traduire le mot "CAB" en binaire :
1. On prend chaque lettre : **C**, **A**, **B**.
2. On cherche leur valeur dans la table ASCII :
   - C = 67
   - A = 65
   - B = 66
3. On traduit ces nombres en binaire :
   - 67 = 64 + 2 + 1 = **`01000011`**
   - 65 = 64 + 1 = **`01000001`**
   - 66 = 64 + 2 = **`01000010`**
4. Le mot "CAB" écrit sur un disque dur ressemble donc exactement à cela :
   **`01000011 01000001 01000010`**

---

## 4. Comment les images et les sons sont-ils traduits ?

Puisque tout doit finir en 0 et en 1, comment fait-on pour une photo ou une chanson ? 

### Les images (Les Pixels)
Une image est découpée en une grille de milliers de petits carrés appelés **Pixels**. Chaque pixel a une couleur unique.
Pour définir une couleur, l'ordinateur utilise le système **RGB** (Red, Green, Blue). Il mélange du Rouge, du Vert et du Bleu avec une intensité allant de 0 à 255 (ce qui correspond exactement à la valeur maximum d'un octet de 8 bits !).

- Un pixel rouge pur sera : `Rouge: 255, Vert: 0, Bleu: 0`.
- En binaire, ce pixel s'écrira : **`11111111 00000000 00000000`**.
Une image 4K contient 8 millions de pixels. Multipliez cela par 3 octets par pixel, et vous obtenez le fichier binaire de votre image !

### Qui traduit tout ça ?
- **Les développeurs** écrivent du code dans des langages lisibles par l'humain (Python, Javascript, Go).
- **Le Compilateur** (ou l'interpréteur) est un programme qui traduit ce code source en langage machine (des instructions binaires).
- **Le Processeur (CPU)** lit ces instructions binaires et ouvre/ferme ses transistors pour exécuter les calculs.

---

## 5. Exercices Pratiques

Sortez une feuille de papier, et testez votre compréhension !

### Exercice 1 : Binaire vers Décimal
Traduisez ces suites binaires en nombres classiques (Base 10) :
1. `00001001`
2. `00010110`
3. `11111111`

### Exercice 2 : Décimal vers Binaire
Traduisez ces nombres en binaire sur 8 bits (un octet) :
1. `13`
2. `50`
3. `100`

### Exercice 3 : Déchiffrer le message secret (ASCII)
Un hacker vous a laissé ce message binaire. Déchiffrez-le en le convertissant d'abord en décimal, puis en trouvant la lettre correspondante (A=65, B=66, C=67, D=68, E=69...) :
**`01000010  01000001  01000100`**

---

### 🟢 Corrections des exercices

> [!TIP]
> Ne lisez les corrections qu'après avoir cherché !

**Correction Exercice 1 :**
1. `00001001` : Il y a un 1 sur la position du 8 et du 1. -> **9**.
2. `00010110` : Il y a un 1 sur le 16, le 4 et le 2. -> **22**.
3. `11111111` : 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = **255** (C'est la valeur maximale d'un octet).

**Correction Exercice 2 :**
1. `13` = 8 + 4 + 1. En binaire : **`00001101`**.
2. `50` = 32 + 16 + 2. En binaire : **`00110010`**.
3. `100` = 64 + 32 + 4. En binaire : **`01100100`**.

**Correction Exercice 3 :**
1. `01000010` = 64 + 2 = 66. Lettre **B**.
2. `01000001` = 64 + 1 = 65. Lettre **A**.
3. `01000100` = 64 + 4 = 68. Lettre **D**.
Le mot secret était : **BAD**.
