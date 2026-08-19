import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

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

const getPageInfo = (tag: string) => {
  switch (tag) {
    case 'architecture':
      return { title: 'Architecture', desc: "Tous les articles traitant d'architecture logicielle et système." };
    case 'rust-go':
      return { title: 'Rust & Go', desc: "Performances et concurrence : tout sur Rust et Golang." };
    case 'open-source':
      return { title: 'Open Source', desc: "L'actualité et les projets autour du mouvement Open Source." };
    case 'populaire':
      return { title: 'Populaires', desc: "Les articles les plus plébiscités par nos lecteurs." };
    default:
      return { title: `Tag : ${tag}`, desc: `Articles correspondant au tag ${tag}` };
  }
};

const matchTag = (articleTags: string = "", targetTag: string) => {
  const tags = articleTags.split(',').map(t => t.trim().toLowerCase());
  if (targetTag === 'rust-go') {
    return tags.some(t => t === 'rust' || t === 'go' || t === 'golang');
  }
  if (targetTag === 'open-source') {
    return tags.some(t => t === 'open source' || t === 'opensource');
  }
  return tags.some(t => t === targetTag.toLowerCase());
};

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const safeTag = tag || '';
  const pageInfo = getPageInfo(safeTag);

  useEffect(() => {
    const url = import.meta.env.VITE_API_BASE_URL || '/api';
    // Fetch all contents and filter client-side for flexibility with complex rules
    fetch(`${url}/contents`)
      .then(res => res.json())
      .then((data: Article[]) => {
        const filtered = (data || []).filter(article => matchTag(article.tags, safeTag));
        setArticles(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [safeTag]);

  return (
    <section className="flex flex-col gap-4 pt-4">
      <h1 className="font-headline-xl text-headline-xl text-on-background border-b-[3px] border-on-background pb-4 mb-2">
        {pageInfo.title}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
        {pageInfo.desc}
      </p>
      
      {loading ? (
        <div className="p-8 text-center font-label-mono animate-pulse">Chargement...</div>
      ) : articles.length === 0 ? (
        <div className="p-8 text-center font-label-mono text-on-surface-variant">Aucun article trouvé pour cette catégorie.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {articles.map((article) => (
            <Link key={article.id} to={`/${article.type}s/${article.slug}`} className="block outline-none focus:ring-4 focus:ring-primary">
              <article className="bg-surface-container-lowest neo-border neo-shadow-sm p-4 flex flex-col md:flex-row gap-6 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#1A1A1A] transition-all">
              {article.imageUrl && (
                <div className="w-full md:w-48 h-32 bg-primary-container neo-border flex-shrink-0 overflow-hidden">
                  <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src={article.imageUrl} alt={article.title} />
                </div>
              )}
              <div className="flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags?.split(',').map(t => (
                    <span key={t} className="bg-primary-container neo-border px-2 py-0.5 rounded-full text-xs font-label-mono font-bold uppercase">{t.trim()}</span>
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
          ))}
        </div>
      )}
    </section>
  );
}
