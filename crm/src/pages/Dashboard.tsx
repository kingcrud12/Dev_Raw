import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

interface Content {
  id: string;
  type: string;
  title: string;
  description: string;
  tags?: string;
  imageUrl?: string;
}

export default function Dashboard() {
  const { role, logout } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [error, setError] = useState('');

  // Form states
  const [type, setType] = useState('article');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
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
    if (role === 'editor') {
      fetchContents();
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
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
    setImage(null);
    setExistingImageUrl(null);
    setType('article');
  };

  const handleEdit = (c: Content) => {
    setEditingId(c.id);
    setTitle(c.title);
    setDescription(c.description);
    setTags(c.tags || '');
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

  if (role !== 'editor') {
    return (
      <div className="p-8">
        <div className="bg-error text-on-error p-6 neo-border neo-shadow-md">
          <h2 className="font-bold text-xl mb-2">Accès Refusé</h2>
          <p>Vous n'avez pas le rôle éditeur pour accéder au CRM. Contactez l'administrateur.</p>
          <button onClick={logout} className="mt-4 bg-background text-on-background px-4 py-2 neo-border">Déconnexion</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 font-body-md text-on-background">
      <div className="flex justify-between items-center mb-8 border-b-[3px] border-on-background pb-4">
        <h1 className="font-headline-lg text-headline-lg font-bold">CRM Dashboard</h1>
        <button onClick={logout} className="bg-surface-variant px-4 py-2 neo-border font-label-mono font-bold hover:bg-error hover:text-on-error transition-colors">Déconnexion</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-surface-container-low p-6 neo-border neo-shadow-md self-start">
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
              <label className="block font-label-mono mb-1">Description</label>
              <textarea className="w-full bg-surface-container-lowest neo-border p-2 focus:bg-tertiary-container outline-none" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div>
              <label className="block font-label-mono mb-1">Tags (séparés par des virgules)</label>
              <input className="w-full bg-surface-container-lowest neo-border p-2 focus:bg-tertiary-container outline-none" value={tags} onChange={e => setTags(e.target.value)} placeholder="React, Go, DevOps..." />
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

        {/* List */}
        <div className="lg:col-span-2">
          <h2 className="font-headline-md font-bold mb-4">Mes Contenus</h2>
          {error && <div className="bg-error text-on-error p-4 neo-border mb-4">{error}</div>}
          <div className="flex flex-col gap-4">
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
      </div>
    </div>
  );
}
