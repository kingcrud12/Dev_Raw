import { useState, useEffect } from 'react';

export function useDragAndDrop<T>(initialItems: T[], onReorder?: (newItems: T[]) => void) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    // Nécessaire pour Firefox
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Nécessaire pour autoriser le drop
    if (draggedIdx === null || draggedIdx === index) return;
    
    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    if (onReorder) {
      onReorder(items);
    }
  };

  return { 
    items, 
    draggedIdx, 
    handleDragStart, 
    handleDragOver, 
    handleDragEnd 
  };
}
