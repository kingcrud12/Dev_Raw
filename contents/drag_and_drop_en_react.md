# Tutoriel : Construire un système de Drag and Drop complet (De la DB au Frontend React)

L'expérience utilisateur (UX) d'un logiciel se joue souvent sur des détails. L'un des plus satisfaisants pour un utilisateur est de pouvoir réorganiser ses données d'un simple glisser-déposer (Drag and Drop). 

Dans ce tutoriel, nous allons décortiquer l'implémentation du système de Drag and Drop (DnD) présent dans ce projet (le CMS du blog). Plutôt que de montrer un exemple théorique, nous allons voir comment cela fonctionne **de bout en bout** : depuis la structure de la base de données (Golang/GORM), en passant par l'API (Gin), jusqu'au Frontend (React avec l'API HTML5 native).

---

## 1. La Base de Données : Penser à l'ordre (Golang + GORM)

Pour qu'un ordre soit sauvegardé et persistant, la base de données doit être capable de mémoriser la position de chaque élément. 

Dans notre modèle `Content` (qui représente un article, un guide ou un tutoriel), nous avons ajouté un champ dédié : `OrderPosition`.

```go
// api/models/content.go
package models

type Content struct {
	Base
	Type          ContentType `gorm:"index;not null" json:"type"`
	Title         string      `gorm:"not null" json:"title"`
	// ... autres champs
	OrderPosition int         `json:"orderPosition"` // <-- Le champ magique
}
```

> [!NOTE]
> L'ordre par défaut en SQL n'est pas garanti. Si vous ne triez pas explicitement avec un champ comme `order_position`, la base de données renverra les éléments dans l'ordre où ils ont été insérés, ou de façon aléatoire.

Pour s'assurer que les données soient toujours renvoyées dans le bon ordre à l'utilisateur, on modifie la requête de récupération (GET) dans notre API :

```go
// api/handlers/content.go (GetAllContent)
query.Order("order_position ASC, created_at DESC").Find(&contents)
```
*Ici, on trie d'abord par `order_position` croissant, et en cas d'égalité (par exemple pour les nouveaux éléments qui ont tous 0), on trie par date de création décroissante.*

---

## 2. L'API Backend : Gérer la réorganisation

Lorsque l'utilisateur relâche sa souris après un Drag and Drop, le Frontend envoie un tableau contenant les identifiants (IDs) des éléments dans leur **nouvel ordre**. Le rôle du Backend est de mettre à jour le champ `OrderPosition` de chacun de ces éléments.

Voici le gestionnaire (handler) Go/Gin qui s'occupe de la route `PUT /crm/contents/reorder` :

```go
// api/handlers/content.go
func ReorderContents(c *gin.Context) {
	// 1. On s'attend à recevoir un tableau d'IDs
	var body struct {
		IDs []string `json:"ids"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// 2. On boucle sur les IDs reçus.
	// L'index 'i' de la boucle correspond à la nouvelle position (0, 1, 2...)
	for i, id := range body.IDs {
		database.DB.Model(&models.Content{}).
			Where("id = ?", id).
			Update("order_position", i) // On met à jour la position
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reordered successfully"})
}
```

---

## 3. Le Frontend (React) : L'API HTML5 Native

Pour le Frontend, beaucoup utilisent des librairies lourdes comme `react-beautiful-dnd` ou `@dnd-kit/core`. Bien qu'excellentes, elles sont parfois overkill pour une simple liste. Dans notre CRM, nous avons utilisé l'**API HTML5 Native** couplée à un Custom Hook React pour un code ultra-léger et performant.

### A. Le Custom Hook : `useDragAndDrop`

Nous avons isolé toute la logique du Drag and Drop dans un hook réutilisable (`useDragAndDrop.ts`). Ce hook gère l'état visuel du glissement et met à jour la liste en temps réel avant même d'appeler l'API.

```typescript
// crm/src/hooks/useDragAndDrop.ts
import { useState, useEffect } from 'react';

export function useDragAndDrop<T>(initialItems: T[], onReorder?: (newItems: T[]) => void) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Met à jour la liste si les données API changent
  useEffect(() => { setItems(initialItems); }, [initialItems]);

  // Déclenché au moment où on commence à glisser un élément
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index); // On retient qui est en train d'être déplacé
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString()); // Requis pour Firefox
  };

  // Déclenché lorsqu'on survole d'autres éléments avec notre élément fantôme
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Indispensable pour autoriser le "drop" final
    if (draggedIdx === null || draggedIdx === index) return;
    
    // On permute les éléments dans la liste locale pour un feedback visuel instantané
    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setItems(newItems);
  };

  // Déclenché lorsqu'on relâche la souris
  const handleDragEnd = () => {
    setDraggedIdx(null);
    if (onReorder) {
      onReorder(items); // On appelle la fonction pour sauvegarder via l'API
    }
  };

  return { items, draggedIdx, handleDragStart, handleDragOver, handleDragEnd };
}
```

### B. Intégration dans l'Interface (Dashboard.tsx)

Il ne reste plus qu'à utiliser notre hook dans le composant d'affichage !

```tsx
// crm/src/pages/Dashboard.tsx

// 1. Déclaration de la fonction qui appelle l'API Backend
const handleReorder = async (newItems: Content[]) => {
  try {
    const ids = newItems.map(c => c.id);
    await api.put('/crm/contents/reorder', { ids });
  } catch (err) {
    fetchContents(); // En cas d'erreur réseau, on annule visuellement
  }
};

// 2. Initialisation du Hook
const { items, draggedIdx, handleDragStart, handleDragOver, handleDragEnd } = 
  useDragAndDrop<Content>(apiContents, handleReorder);

// 3. Rendu de la liste
return (
  <div className="flex flex-col gap-4">
    {items.map((c, idx) => (
      <div 
        key={c.id} 
        draggable // <-- Active le mode Drag and Drop HTML5
        onDragStart={(e) => handleDragStart(e, idx)}
        onDragOver={(e) => handleDragOver(e, idx)}
        onDragEnd={handleDragEnd}
        // Style visuel : on réduit l'opacité de l'élément fantôme
        className={`p-4 flex cursor-grab ${draggedIdx === idx ? 'opacity-50' : 'opacity-100'}`}
      >
        <span className="material-symbols-outlined cursor-grab">drag_indicator</span>
        <h3>{c.title}</h3>
      </div>
    ))}
  </div>
);
```

> [!TIP]
> **Pourquoi le visuel est-il si fluide ?** Parce que la permutation du tableau JavaScript se fait dans le `onDragOver` (pendant le survol) et non dans le `onDrop`. L'utilisateur voit immédiatement l'élément s'insérer à sa nouvelle place avant même d'avoir relâché la souris !

---

## Conclusion

Créer un système de Drag and Drop de bout en bout ne nécessite pas forcément des dizaines de librairies complexes. En respectant le cycle **"Événement React -> Mise à jour du State -> Requête Backend -> Mise à jour Base de Données"**, vous pouvez implémenter des interfaces sophistiquées tout en gardant un contrôle total sur votre code et vos performances.
