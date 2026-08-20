# Architecture React : L'Art de découper et d'organiser ses Composants

Quand on débute avec React ou n'importe quel framework basé sur des composants, on a tendance à créer des "composants monstres" de 1000 lignes qui gèrent à la fois l'appel réseau, le style, les animations et la logique métier. Résultat : au bout de deux semaines, le code devient impossible à maintenir.

L'architecture d'une application frontend moderne repose sur une règle simple : **Chaque chose à sa place**. Voici un guide pratique pour organiser vos composants, gérer vos états (State) et vos appels API de manière professionnelle.

---

## 1. La Règle d'Or : Le Principe de Responsabilité Unique

Si vous avez du mal à trouver un nom pour votre composant (ex: `UserProfilAndSettingsAndAvatar`), c'est qu'il fait probablement trop de choses.

**Un composant ne doit faire qu'une seule et unique chose.**
- S'il s'appelle `Button`, il affiche un bouton. Il ne doit pas appeler l'API pour sauvegarder l'utilisateur.
- S'il s'appelle `UserProfileCard`, il affiche les infos. Il ne gère pas le formulaire d'édition.

Découpez ! Au lieu d'un énorme fichier, vous aurez :
- `<UserPage />`
  - `<UserProfileCard />`
  - `<UserEditForm />`
    - `<TextInput />`
    - `<SubmitButton />`

---

## 2. L'Organisation des Dossiers

Dans un projet classique, on sépare généralement les composants selon leur niveau de réutilisabilité et leur rôle.

```text
src/
 ┣ components/       # Les composants d'UI réutilisables (Boutons, Modales, Inputs)
 ┣ features/         # (Optionnel pour les gros projets) Regroupement par fonctionnalité
 ┣ hooks/            # Logique réutilisable (useAuth, useDragAndDrop...)
 ┣ pages/            # Les "Vues" principales (Home, Dashboard)
 ┣ api/              # La configuration réseau (Axios, Fetch)
 ┗ context/          # Le State global (AuthContext, ThemeContext)
```

**La différence entre `pages` et `components` :**
- Les `pages` correspondent à vos URL (ex: la page d'accueil `/`). Elles s'occupent d'assembler la page.
- Les `components` sont les briques de Lego. Ils peuvent être utilisés dans plusieurs pages.

---

## 3. Les Appels API : Smart vs Dumb Components

L'un des meilleurs modèles d'architecture s'appelle **Container / Presentational** (ou Smart vs Dumb).

### A. Le composant "Intelligent" (Smart / Container)
Son rôle est de **récupérer les données** et de **gérer la logique**. Il n'a presque pas de style. Dans notre architecture, ce sont très souvent nos `pages`.

```tsx
// pages/Dashboard.tsx (Smart)
import { useState, useEffect } from 'react';
import api from '../api';
import ArticleList from '../components/ArticleList'; // Le Dumb composant

export default function Dashboard() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 1. Il fait l'appel API
    api.get('/contents').then(res => setArticles(res.data));
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/contents/${id}`);
    // Re-fetch des données...
  };

  // 2. Il passe les données au composant d'affichage via les Props
  return (
    <div className="p-8">
      <h1>Mon Dashboard</h1>
      <ArticleList data={articles} onDelete={handleDelete} />
    </div>
  );
}
```

### B. Le composant "Stupide" (Dumb / Presentational)
Son seul rôle est de faire joli. **Il ne sait pas ce qu'est une base de données ou une API.** Il prend des *Props* (des données) et il affiche du CSS.

```tsx
// components/ArticleList.tsx (Dumb)
// Aucune trace de 'fetch' ou 'axios' ici !
export default function ArticleList({ data, onDelete }) {
  return (
    <div className="flex flex-col gap-4">
      {data.map(article => (
        <div key={article.id} className="p-4 bg-white shadow-md rounded-md">
          <h3 className="font-bold">{article.title}</h3>
          
          {/* Quand on clique, on appelle simplement la fonction passée par le parent */}
          <button onClick={() => onDelete(article.id)} className="text-red-500">
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
```
**L'avantage massif ?** Vous pouvez réutiliser `ArticleList` n'importe où ! Dans le dashboard de l'admin, sur la page publique d'un auteur... Il se moque de savoir d'où viennent les données.

---

## 4. Gérer le State (État) sans devenir fou

Le "State" (l'état) est la mémoire de votre application (ex: est-ce que le menu est ouvert ? Quel est le texte tapé dans l'input ? L'utilisateur est-il connecté ?).

### Règle 1 : La Colocation (Gardez-le local)
Mettez votre State au plus près de l'endroit où il est utilisé.
- Si seul le composant `<BurgerMenu />` a besoin de savoir si le menu est ouvert ou fermé, le `useState` doit être dans `<BurgerMenu />`. Inutile de le mettre dans `<App />`.

### Règle 2 : Le Levage d'État (Lifting State Up)
Si deux composants "frères" ont besoin de partager la même information, remontez le `useState` dans leur parent commun le plus proche.
- Le `<SearchBar />` (qui capte le texte) et la `<List />` (qui affiche les résultats) ont besoin du même State. Mettez le State dans la `<Page />` qui les contient tous les deux.

### Règle 3 : Le State Global (Context ou Redux/Zustand)
Si une information doit être accessible par 80% de votre application (ex: Les informations de l'utilisateur connecté `role: admin`, ou le thème `sombre / clair`), utilisez le **State Global**.
Dans React, cela se fait via l'API **Context**.

```tsx
// Exemple : Utilisation n'importe où grâce au Context (comme vu dans AuthContext)
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  // Pas besoin de faire passer "role" à travers 5 composants parents via les props !
  const { role, logout } = useAuth(); 

  return (
    <nav>
      {role === 'admin' && <button>Administration</button>}
      <button onClick={logout}>Déconnexion</button>
    </nav>
  );
}
```

---

## En résumé : La Checklist de la bonne architecture

Avant de créer un composant, posez-vous ces 4 questions :
1. **Fait-il trop de choses ?** Si oui, découpez-le en petits composants.
2. **Est-ce une page (Smart) ou un bloc d'UI (Dumb) ?** Séparez bien celui qui *cherche* la donnée de celui qui *l'affiche*.
3. **Mon State est-il au bon endroit ?** Ne mettez en State global que ce qui est strictement nécessaire pour toute l'app.
4. **Mon style est-il bien isolé ?** Le Tailwind (ou CSS) doit rester dans vos composants *Dumb* d'UI.
