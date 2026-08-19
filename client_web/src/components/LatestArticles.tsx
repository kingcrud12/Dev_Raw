import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Article {
  id: string;
  type: string;
  slug: string;
  title: string;
  description: string;
  tags: string;
  readingTime: number;
  imageUrl: string;
}

export default function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = import.meta.env.VITE_API_BASE_URL || '/api';
    fetch(`${url}/contents?type=article`)
      .then(res => res.json())
      .then(data => {
        setArticles(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-headline-md text-headline-md text-on-background border-b-[3px] border-on-background pb-2">Récemment Publié</h2>
      
      {loading ? (
        <div className="p-8 text-center font-label-mono animate-pulse">Chargement...</div>
      ) : articles.length === 0 ? (
        <div className="p-8 text-center font-label-mono text-on-surface-variant">Aucun article trouvé.</div>
      ) : (
        articles.map((article) => (
          <Link key={article.id} to={`/articles/${article.slug}`} className="block outline-none focus:ring-4 focus:ring-primary">
            <article className="bg-surface-container-lowest neo-border neo-shadow-sm p-4 flex flex-col md:flex-row gap-6 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#1A1A1A] transition-all">
            {article.imageUrl && (
              <div className="w-full md:w-48 h-32 bg-primary-container neo-border flex-shrink-0 overflow-hidden">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src={article.imageUrl} alt={article.title} />
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-3">
                {article.tags?.split(',').map(tag => (
                  <span key={tag} className="bg-primary-container neo-border px-2 py-0.5 rounded-full text-xs font-label-mono font-bold uppercase">{tag.trim()}</span>
                ))}
              </div>
              <h3 className="font-headline-md text-headline-md text-on-background mb-2 group-hover:underline decoration-[3px] underline-offset-4">{article.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-3">{article.description}</p>
              <div className="mt-auto flex items-center gap-4 font-label-mono text-sm text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {article.readingTime || 5} min</span>
              </div>
            </div>
            </article>
          </Link>
        ))
      )}
    </section>
  );
}
