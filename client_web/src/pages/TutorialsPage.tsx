import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Tutorial {
  id: string;
  type: string;
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  tags: string;
  readingTime: number;
}

import { useLanguage } from '../context/LanguageContext';

export default function TutorialsPage() {
  const { language, t } = useLanguage();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = import.meta.env.VITE_API_BASE_URL || '/api';
    fetch(`${url}/contents?type=tutorial`)
      .then(res => res.json())
      .then(data => {
        setTutorials(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getTagColor = (idx: number) => {
    const colors = ['bg-primary-container', 'bg-secondary-container', 'bg-tertiary-container'];
    return colors[idx % colors.length];
  };

  return (
    <section className="flex flex-col gap-stack-md pt-stack-md">
      <h1 className="font-headline-xl text-headline-xl text-on-background border-b-[3px] border-on-background pb-4 mb-4">
        {t('tutorials')}
      </h1>
      
      {loading ? (
        <div className="p-8 text-center font-label-mono animate-pulse">Chargement...</div>
      ) : tutorials.length === 0 ? (
        <div className="p-8 text-center font-label-mono text-on-surface-variant">{t('noResults')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutorials.map((tutorial, idx) => (
            <Link key={tutorial.id} to={`/tutoriels/${tutorial.slug}`} className="block outline-none focus:ring-4 focus:ring-primary">
              <article className="bg-surface-container-lowest neo-border neo-shadow-sm p-6 flex flex-col h-full group hover:shadow-[8px_8px_0px_0px_#1A1A1A] hover:-translate-y-1 transition-all">
              <div className={`${getTagColor(idx)} neo-border px-3 py-1 rounded-full text-xs font-label-mono font-bold self-start mb-4 uppercase`}>
                {tutorial.tags?.split(',')[0] || "TUTORIEL"}
              </div>
              <h3 className="font-headline-md text-headline-md text-on-background mb-2 group-hover:text-primary transition-colors">
                {(language === 'en' && tutorial.titleEn) ? tutorial.titleEn : tutorial.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-1 line-clamp-4">
                {(language === 'en' && tutorial.descriptionEn) ? tutorial.descriptionEn : tutorial.description}
              </p>
              <div className="flex items-center gap-2 font-label-mono text-sm text-on-surface-variant border-t-[3px] border-on-background pt-4">
                <span className="material-symbols-outlined notranslate text-sm">schedule</span> {tutorial.readingTime || 5} {t('readingTime')}
              </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
