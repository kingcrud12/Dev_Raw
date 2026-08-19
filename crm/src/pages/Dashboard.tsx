import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

interface Content {
  id: string;
  type: string;
  title: string;
  description: string;
  tags?: string;
  imageUrl?: string;
  readingTime?: number;
}

export default function Dashboard() {
  const { role, logout } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [error, setError] = useState('');

  // Form states
  const [type, setType] = useState('article');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const [tags, setTags] = useState('');
  const [readingTime, setReadingTime] = useState<number>(5);
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchContents = async () => {
    try {
      const res = await api.get('/crm/contents');
      setContents(res.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Vous n'avez pas le rôle 'editor'.");
      }
    }
  };

  useEffect(() => {
    if (role === 'editor' || role === 'admin') {
      fetchContents();
    }
  }, [role]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === textareaRef.current && textareaRef.current) {
        selectionRef.current = {
          start: textareaRef.current.selectionStart,
          end: textareaRef.current.selectionEnd
        };
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('readingTime', readingTime.toString());
    if (image) {
      formData.append('image', image);
    }

    try {
      if (editingId) {
        await api.put(`/crm/contents/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/crm/contents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      resetForm();
      fetchContents();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setTags('');
    setReadingTime(5);
    setImage(null);
    setExistingImageUrl(null);
    setType('article');
  };

  const handleEdit = (c: Content) => {
    setEditingId(c.id);
    setTitle(c.title);
    setDescription(c.description);
    setTags(c.tags || '');
    setReadingTime(c.readingTime || 5);
    setType(c.type || 'article');
    setImage(null);
    setExistingImageUrl(c.imageUrl || null);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/crm/contents/${id}`);
      fetchContents();
    } catch (err) {
      console.error(err);
    }
  };

  if (role !== 'editor' && role !== 'admin') {
    return (
      <div className="p-8">
        <div className="bg-error text-on-error p-6 neo-border neo-shadow-md">
          <h2 className="font-bold text-xl mb-2">Accès Refusé</h2>
          <p>Vous n'avez pas le rôle éditeur ou admin pour accéder au CRM. Contactez l'administrateur.</p>
          <button onClick={logout} className="mt-4 bg-background text-on-background px-4 py-2 neo-border">Déconnexion</button>
        </div>
      </div>
    );
  }

  const insertText = (before: string, after: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    
    // On se fie uniquement à la dernière sélection connue (sauvegardée de manière 100% fiable par l'événement natif).
    const start = selectionRef.current.start;
    const end = selectionRef.current.end;

    const text = description;
    const beforeText = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);
    const newText = beforeText + before + selectedText + after + afterText;
    
    setDescription(newText);
    
    // Update the selection ref immediately so subsequent clicks work
    const newCursorPos = start + before.length + selectedText.length;
    selectionRef.current = { start: newCursorPos, end: newCursorPos };

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, newCursorPos);
    }, 10);
  };

  const renderForm = () => (
    <div className="bg-surface-container-low p-6 neo-border neo-shadow-md h-full overflow-y-auto">
      <h2 className="font-headline-md font-bold mb-4">{editingId ? 'Modifier Contenu' : 'Nouveau Contenu'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-label-mono mb-1">Type</label>
          <select className="w-full bg-surface-container-lowest neo-border p-2 focus:bg-tertiary-container outline-none" value={type} onChange={e => setType(e.target.value)}>
            <option value="article">Article</option>
            <option value="guide">Guide</option>
            <option value="tutorial">Tutoriel</option>
          </select>
        </div>
        <div>
          <label className="block font-label-mono mb-1">Titre</label>
          <input className="w-full bg-surface-container-lowest neo-border p-2 focus:bg-tertiary-container outline-none" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <div className="flex justify-between items-end mb-1">
            <label className="block font-label-mono">Description (Markdown & HTML autorisés)</label>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2 p-2 bg-surface-variant neo-border items-center">
            <button type="button" onClick={() => insertText('\n```javascript\n', '\n```\n')} className="px-2 py-1 bg-surface-container-lowest neo-border font-label-mono text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors">Code</button>
          </div>

          <textarea 
            ref={textareaRef}
            className="w-full bg-surface-container-lowest neo-border p-2 focus:bg-tertiary-container outline-none resize-y" 
            rows={20} 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            required 
          />
          
          <div className="mt-2 text-xs text-on-surface-variant p-3 bg-secondary-container/20 border-l-[4px] border-primary">
            <p className="mb-1 font-bold">Astuces de mise en forme :</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Vidéo YouTube :</strong> Sur YouTube, cliquez sur Partager {'>'} Intégrer, puis copiez-collez la balise <code>{'<iframe src="..."></iframe>'}</code> directement dans le texte.</li>
              <li><strong>Code :</strong> Utilisez le bouton "Code" ci-dessus ou encadrez votre code avec 3 backticks (```).</li>
            </ul>
          </div>
        </div>
        <div>
          <label className="block font-label-mono mb-1">Tags (séparés par des virgules)</label>
          <input className="w-full bg-surface-container-lowest neo-border p-2 focus:bg-tertiary-container outline-none" value={tags} onChange={e => setTags(e.target.value)} placeholder="React, Go, DevOps..." />
        </div>
        <div>
          <label className="block font-label-mono mb-1">Temps de lecture (minutes)</label>
          <input type="number" min="1" className="w-full bg-surface-container-lowest neo-border p-2 focus:bg-tertiary-container outline-none" value={readingTime} onChange={e => setReadingTime(parseInt(e.target.value) || 5)} />
        </div>
        <div>
          <label className="block font-label-mono mb-1">Image de couverture</label>
          {existingImageUrl && !image && (
            <div className="mb-2">
              <span className="text-xs text-on-surface-variant font-label-mono mb-1 block">Image actuelle :</span>
              <img src={existingImageUrl} alt="Preview" className="h-32 object-cover neo-border" />
            </div>
          )}
          <input type="file" accept="image/*" className="w-full bg-surface-container-lowest neo-border p-2 focus:bg-tertiary-container outline-none" onChange={e => setImage(e.target.files?.[0] || null)} />
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" disabled={isUploading} className="flex-1 bg-primary text-on-primary neo-border py-2 font-bold uppercase hover:bg-primary-fixed neo-shadow-sm neo-btn disabled:opacity-50">
            {isUploading ? 'Chargement...' : (editingId ? 'Mettre à jour' : 'Publier')}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-surface-variant text-on-surface-variant neo-border px-4 py-2 font-bold uppercase hover:bg-error hover:text-on-error neo-btn transition-colors">
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderList = () => (
    <div className="h-full overflow-y-auto pl-2">
      <h2 className="font-headline-md font-bold mb-4">
        {role === 'admin' ? 'Tous les Contenus' : 'Mes Contenus'}
      </h2>
      {error && <div className="bg-error text-on-error p-4 neo-border mb-4">{error}</div>}
      <div className="flex flex-col gap-4 pb-12">
        {contents.map(c => (
          <div key={c.id} className="bg-surface-container-lowest p-4 neo-border flex justify-between items-center group hover:bg-surface-variant transition-colors">
            <div>
              <span className="bg-secondary-container px-2 py-1 text-xs font-label-mono neo-border inline-block mb-2 uppercase">{c.type}</span>
              <h3 className="font-bold text-lg">{c.title}</h3>
              <p className="text-on-surface-variant text-sm truncate max-w-md">{c.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleEdit(c)} className="text-primary border-[3px] border-transparent hover:border-primary px-3 py-1 bg-primary/10 font-bold text-sm transition-all">Modifier</button>
              <button onClick={() => handleDelete(c.id)} className="text-error border-[3px] border-transparent hover:border-error px-3 py-1 bg-error/10 font-bold text-sm transition-all">Supprimer</button>
            </div>
          </div>
        ))}
        {contents.length === 0 && <p className="text-on-surface-variant">Aucun contenu trouvé.</p>}
      </div>
    </div>
  );

  const [leftWidth, setLeftWidth] = useState(450);
  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  };

  const resize = (e: MouseEvent) => {
    if (isResizing.current) {
      // 32 is approx the p-8 padding (8 * 4px) on the left of the container
      let newWidth = e.clientX - 32;
      if (newWidth < 300) newWidth = 300;
      if (newWidth > 1200) newWidth = 1200;
      setLeftWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-8 font-body-md text-on-background flex flex-col h-screen overflow-hidden">
      <div className="flex justify-between items-center mb-8 border-b-[3px] border-on-background pb-4 flex-shrink-0">
        <h1 className="font-headline-lg text-headline-lg font-bold">CRM Dashboard</h1>
        <button onClick={logout} className="bg-surface-variant px-4 py-2 neo-border font-label-mono font-bold hover:bg-error hover:text-on-error transition-colors">Déconnexion</button>
      </div>

      <div className="hidden lg:flex flex-1 min-h-0 items-stretch">
        <div style={{ width: leftWidth }} className="flex-shrink-0 h-full">
          {renderForm()}
        </div>
        
        <div 
          className="w-8 flex-shrink-0 cursor-col-resize group flex justify-center items-center hover:bg-surface-variant/50 transition-colors mx-4 rounded-lg"
          onMouseDown={startResizing}
        >
          <div className="w-1.5 h-16 bg-on-surface-variant/30 group-hover:bg-primary group-hover:opacity-100 transition-all neo-border rounded-full" />
        </div>
        
        <div className="flex-1 min-w-0 h-full">
          {renderList()}
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:hidden flex-1 overflow-y-auto pb-12">
        {renderForm()}
        {renderList()}
      </div>
    </div>
  );
}
