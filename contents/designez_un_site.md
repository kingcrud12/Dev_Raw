# Du Brief au Code : Les Étapes pour Designer un Site Web

Le syndrome de la page blanche ne touche pas que les écrivains, il touche aussi les développeurs et les designers. Quand on vous donne une idée, comment passez-vous d'une simple phrase à un site web complet, ergonomique et visuellement époustouflant ?

Ce processus ne relève pas de la magie, mais d'une méthodologie précise. Découvrons ensemble comment transformer un brief client en un véritable Design System prêt à être codé.

---

## 1. Le Point de Départ : Le Brief Client

Tout projet commence par un besoin. Imaginons le brief fictif suivant :

> **Projet : "Café Connect"**
> **Objectif :** Créer une application web permettant aux travailleurs freelances de trouver les meilleurs cafés proposant du Wi-Fi rapide et des prises électriques dans leur ville.
> **Cible :** Jeunes actifs, développeurs, freelances (20-35 ans).
> **Fonctionnalités clés :** Une barre de recherche, une carte interactive, une liste de cafés sous forme de cartes (avec note et vitesse du Wi-Fi).
> **Tonalité souhaitée :** Moderne, dynamique, un peu décalé mais très lisible.

À partir de ce texte de 5 lignes, notre travail de concepteur commence.

---

## 2. Penser "UX" (Expérience Utilisateur) d'abord

Avant de choisir la couleur des boutons, il faut comprendre **comment** l'utilisateur va se servir du site. L'UX (User Experience) dicte la structure.

### Le User Flow (Parcours Utilisateur)
Quel est le chemin idéal que l'utilisateur doit emprunter ?
1. Il arrive sur la page d'accueil.
2. Il voit immédiatement la **proposition de valeur** (Trouver un café pour bosser).
3. Il tape sa ville dans une barre de recherche très visible.
4. Il atterrit sur une page de résultats avec les cafés triés par proximité.

**La règle d'or de l'UX :** L'action principale (ici, la recherche) doit être faisable en moins de 3 clics et visible sans avoir à "scroller" (Above the fold).

---

## 3. Le Wireframe (Zonage)

Le wireframe est le brouillon du site. C'est un schéma en noir et blanc, souvent dessiné au stylo ou avec des outils comme *Figma* ou *Balsamiq*.

### Les règles du Wireframe :
- **Pas de couleurs** (à part du gris).
- **Pas d'images** (juste des carrés barrés d'une croix).
- **Pas de polices fantaisistes**.

### Traduction de notre brief en Wireframe (Accueil) :
1. **En haut (Header) :** Logo à gauche, bouton "Se connecter" à droite.
2. **Au centre (Hero Section) :** Un gros titre H1 ("Trouvez votre bureau du jour").
3. **Juste en dessous :** Une très grosse barre de recherche avec un bouton "Chercher".
4. **En bas :** Une grille de 3 carrés représentant les "Cafés populaires de la semaine".

*Pourquoi cette étape est cruciale ?* Parce qu'elle permet de valider l'architecture de l'information avec le client sans qu'il ne se focalise sur le fait qu'il "n'aime pas cette nuance de bleu".

---

## 4. La Maquette UI et le choix du Style

Une fois la structure validée, on passe à l'UI (User Interface). C'est ici que l'on "habille" le wireframe.

Le brief demandait un style : *Moderne, dynamique, un peu décalé.*
Nous allons donc choisir un style **Néo-Brutaliste** (comme celui utilisé sur ce blog !). Ce style est très populaire auprès de la cible (développeurs/freelances) :
- Des bordures noires très épaisses (3px).
- Des ombres portées solides et dures (sans flou).
- Des couleurs très saturées (flashy).
- Une typographie audacieuse.

---

## 5. La création du Design System

Un développeur ne choisit jamais ses couleurs au hasard pendant qu'il code. Avant d'écrire la moindre ligne de CSS ou de Tailwind, il faut figer un **Design System** sur Figma.

### A. La Palette de Couleurs
On limite les choix pour garder une cohérence parfaite :
- **Couleur Primaire :** Un Jaune électrique (`#FFD700`) - Utilisé pour les boutons d'action.
- **Couleur Secondaire :** Un Violet profond (`#8A2BE2`) - Utilisé pour les badges ou accents.
- **Background (Fond) :** Un Blanc cassé (`#F4F4F0`) - Plus doux pour les yeux que le blanc pur.
- **Texte / Bordures :** Noir pur (`#000000`) - Pour le contraste néo-brutaliste.

### B. La Typographie
On choisit deux polices maximum :
- **Titres (Headings) :** `Space Grotesk` (Donne un look moderne et tech).
- **Corps de texte (Body) :** `Inter` (Lisibilité maximale pour les descriptions).

### C. Les Composants (La librairie)
On dessine ensuite les composants de base qui seront réutilisés partout (ce qu'on appelle l'Atomic Design) :

1. **Le Bouton Primaire :**
   - Fond : Jaune.
   - Bordure : 3px Noir.
   - Ombre : `4px 4px 0px black`.
   - Interaction (Hover) : L'ombre se réduit et le bouton se décale (effet bouton physique).

2. **La Carte (Café Card) :**
   - Fond : Blanc.
   - Bordure : 3px Noir.
   - Image du café en haut.
   - Titre, Note Wi-Fi (Badge violet), Adresse.

3. **L'Input (Barre de recherche) :**
   - Gros padding pour être cliquable sur mobile.
   - Bordure épaisse qui devient jaune au focus.

---

## Conclusion : Du Design au Code

Une fois le Design System en place et la maquette finalisée, le développement devient un jeu d'enfant. 

Dans un framework comme React couplé à Tailwind CSS, vous allez :
1. Configurer votre `tailwind.config.js` avec vos couleurs (`primary: '#FFD700'`) et vos polices.
2. Créer vos composants "Dumb" (`Button.tsx`, `Card.tsx`) en copiant exactement les espacements et les bordures définis sur Figma.
3. Assembler vos pages en respectant le wireframe validé au tout début.

C'est cette rigueur (Brief -> UX -> Wireframe -> UI -> Design System -> Code) qui fait la différence entre un site qui a l'air d'un projet étudiant brouillon, et un produit professionnel qui inspire confiance !
