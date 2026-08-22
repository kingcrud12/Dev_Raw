import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: string;
  slug: string;
  title: string;
  description: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = import.meta.env.VITE_API_BASE_URL || '/api';
        const res = await fetch(`${url}/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data || []);
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative hidden sm:flex items-center" ref={containerRef}>
      <div 
        className={`flex items-center bg-surface-container-lowest neo-border neo-shadow-sm transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-10'
        } h-10 overflow-hidden relative`}
      >
        <button 
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-transparent border-none outline-none cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <span className="material-symbols-outlined notranslate text-on-background">search</span>
        </button>
        
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="flex-1 bg-transparent border-none outline-none font-label-mono text-sm px-2 text-on-background placeholder:text-on-surface-variant w-full"
          value={query}
          onChange={(e) => {
            const sanitized = e.target.value
              .replace(/[<>;"'\\*]/g, '')
              .replace(/\b(select|insert|update|delete|drop|union|alter|exec)\b/ig, '');
            setQuery(sanitized);
            if (!isExpanded) setIsExpanded(true);
          }}
          onFocus={() => setIsExpanded(true)}
          style={{ display: isExpanded ? 'block' : 'none' }}
        />
        
        {isExpanded && query && (
          <button 
            className="w-8 h-8 mr-1 flex-shrink-0 flex items-center justify-center bg-transparent border-none outline-none cursor-pointer"
            onClick={() => setQuery('')}
          >
            <span className="material-symbols-outlined notranslate text-on-surface-variant text-sm hover:text-error transition-colors">close</span>
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isExpanded && (query.length >= 2) && (
        <div className="absolute top-full right-0 mt-2 w-[400px] bg-background border-[3px] border-on-background shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-col z-50 max-h-[400px] overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center font-label-mono text-sm text-on-surface-variant animate-pulse">
              Recherche en cours...
            </div>
          )}
          
          {!isLoading && results.length === 0 && (
            <div className="p-4 text-center font-label-mono text-sm text-on-surface-variant">
              Aucun résultat pour "{query}"
            </div>
          )}

          {!isLoading && results.map((item) => {
            const pathPrefix = item.type === 'tutorial' ? 'tutoriels' : `${item.type}s`;
            return (
            <Link 
              key={item.id} 
              to={`/${pathPrefix}/${item.slug}`} 
              className="p-4 border-b-[3px] border-on-background last:border-b-0 hover:bg-surface-variant transition-colors block"
              onClick={() => setIsExpanded(false)}
            >
              <div className="flex justify-between items-start mb-1 gap-2">
                <h4 className="font-headline-sm text-sm font-bold text-on-background leading-tight flex-1">
                  {item.title}
                </h4>
                <span className="text-[10px] font-label-mono bg-primary-container neo-border px-2 py-0.5 uppercase flex-shrink-0">
                  {item.type}
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2">
                {item.description}
              </p>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
