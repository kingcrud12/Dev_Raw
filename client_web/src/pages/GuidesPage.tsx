import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Guide {
  id: string;
  type: string;
  slug: string;
  title: string;
  description: string;
  tags: string;
  imageUrl: string;
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contents?type=guide')
      .then(res => res.json())
      .then(data => {
        setGuides(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="flex flex-col gap-stack-md pt-stack-md">
      <h1 className="font-headline-xl text-headline-xl text-on-background border-b-[3px] border-on-background pb-4 mb-4">
        Guides Complets
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
        Des explorations approfondies pour maîtriser l'architecture système, le DevOps et les outils modernes.
      </p>
      
      {loading ? (
        <div className="p-8 text-center font-label-mono animate-pulse">Chargement...</div>
      ) : guides.length === 0 ? (
        <div className="p-8 text-center font-label-mono text-on-surface-variant">Aucun guide n'a été publié pour le moment.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {guides.map((guide, idx) => (
            <Link key={guide.id} to={`/guides/${guide.slug}`} className="block outline-none focus:ring-4 focus:ring-primary">
              <article className={`bg-${['secondary', 'tertiary', 'primary'][idx % 3]}-container neo-border neo-shadow-md p-8 flex flex-col md:flex-row gap-8 items-start group hover:-translate-y-1 transition-transform`}>
              {guide.imageUrl && (
                <div className="w-full md:w-64 h-40 bg-surface-container-lowest neo-border overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src={guide.imageUrl} alt={guide.title} />
                </div>
              )}
              <div className="flex-1">
                <span className="bg-surface-container-lowest neo-border px-3 py-1 rounded-full text-xs font-label-mono font-bold mb-4 inline-block uppercase">
                  {guide.tags?.split(',')[0] || "GUIDE"}
                </span>
                <h2 className="font-headline-md text-headline-md text-on-background mb-3 group-hover:underline decoration-[3px] underline-offset-4">
                  {guide.title}
                </h2>
                <p className="font-body-md text-body-md text-on-secondary-container mb-6 opacity-80 text-black">
                  {guide.description}
                </p>
                <button className="bg-background text-on-background neo-border px-6 py-2 font-label-mono text-sm uppercase font-bold neo-shadow-sm neo-btn">
                  Lire le guide
                </button>
              </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
