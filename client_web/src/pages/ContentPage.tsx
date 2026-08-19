import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Content {
  id: string;
  type: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string;
  contentText?: string;
  readingTime?: number;
}

export default function ContentPage() {
  const { slug } = useParams();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const url = import.meta.env.VITE_API_BASE_URL || '/api';
        const res = await fetch(`${url}/contents/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Contenu introuvable.");
          }
          throw new Error("Erreur lors de la récupération du contenu.");
        }
        const data = await res.json();
        setContent(data);
      } catch (err: any) {
        setError(err.message || "Erreur réseau.");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [slug]);

  if (loading) {
    return <div className="p-8 text-center font-label-mono animate-pulse">Chargement...</div>;
  }

  if (error || !content) {
    return (
      <div className="p-8 text-center">
        <p className="font-label-mono text-error mb-4">{error}</p>
        <Link to="/" className="text-primary hover:underline font-bold">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <article className="flex flex-col gap-6">
      <div className="flex gap-2 mb-2">
        {content.tags?.split(',').map((tag, idx) => (
          <span key={idx} className="bg-secondary-container text-on-secondary-container px-3 py-1 neo-border text-xs font-label-mono font-bold uppercase">
            {tag.trim()}
          </span>
        ))}
      </div>
      
      <h1 className="font-headline-lg text-headline-lg font-bold text-on-background">
        {content.title}
      </h1>
      
      {(content.readingTime || 5) > 0 && (
        <p className="font-label-mono text-on-surface-variant text-sm">
          Temps de lecture estimé : {content.readingTime || 5} min
        </p>
      )}

      {content.imageUrl && (
        <div className="w-full max-h-[400px] bg-surface-container-lowest neo-border overflow-hidden my-4">
          <img src={content.imageUrl} alt={content.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="font-body-lg text-body-lg text-on-background leading-relaxed whitespace-pre-wrap">
        {content.contentText || content.description}
      </div>
    </article>
  );
}
