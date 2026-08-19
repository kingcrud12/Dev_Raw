import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

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
    window.scrollTo(0, 0);
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

      <div className="font-body-lg text-body-lg text-on-background leading-relaxed">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            h2: ({ node, ...props }) => <h2 className="font-headline-lg text-headline-lg border-b-[3px] border-on-background pb-2 mt-8 mb-4 font-bold" {...props} />,
            h3: ({ node, ...props }) => <h3 className="font-headline-md text-headline-md mt-6 mb-3 font-bold" {...props} />,
            p: ({ node, ...props }) => <p className="mb-6 leading-relaxed" {...props} />,
            a: ({ node, ...props }) => <a className="text-primary underline decoration-[3px] underline-offset-4 hover:bg-primary hover:text-on-primary transition-colors font-bold" target="_blank" rel="noopener noreferrer" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-8 mb-6" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-8 mb-6" {...props} />,
            li: ({ node, ...props }) => <li className="mb-2" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-[6px] border-primary pl-4 py-2 italic bg-surface-variant/30 mb-6 neo-border" {...props} />,
            pre: ({ node, ...props }) => <pre className="bg-surface-container-lowest neo-border p-4 overflow-x-auto mb-6 text-sm font-label-mono neo-shadow-sm" {...props} />,
            code: ({ node, inline, className, children, ...props }: any) => {
              return inline ? (
                <code className="bg-surface-variant px-1.5 py-0.5 font-label-mono text-sm neo-border border-2 font-bold" {...props}>
                  {children}
                </code>
              ) : (
                <code className="text-on-surface-variant font-label-mono" {...props}>
                  {children}
                </code>
              );
            },
            iframe: ({ node, ...props }) => (
              <div className="w-full aspect-video neo-border neo-shadow-md mb-6 overflow-hidden bg-black">
                <iframe className="w-full h-full" {...props} />
              </div>
            )
          }}
        >
          {content.contentText || content.description}
        </ReactMarkdown>
      </div>
    </article>
  );
}
