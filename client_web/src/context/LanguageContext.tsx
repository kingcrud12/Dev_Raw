import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'fr' | 'en';

interface Dictionary {
  [key: string]: {
    fr: string;
    en: string;
  };
}

const dictionary: Dictionary = {
  home: { fr: 'Accueil', en: 'Home' },
  articles: { fr: 'Articles', en: 'Articles' },
  guides: { fr: 'Guides', en: 'Guides' },
  tutorials: { fr: 'Tutoriels', en: 'Tutorials' },
  newsletter: { fr: 'Newsletter', en: 'Newsletter' },
  subscribe: { fr: 'S\'abonner', en: 'Subscribe' },
  latestArticles: { fr: 'Derniers articles', en: 'Latest Articles' },
  searchPlaceholder: { fr: 'Rechercher un article, guide...', en: 'Search for articles, guides...' },
  noResults: { fr: 'Aucun résultat.', en: 'No results.' },
  readingTime: { fr: 'min de lecture', en: 'min read' },
  publishedOn: { fr: 'Publié le', en: 'Published on' },
  by: { fr: 'par', en: 'by' },
  allTags: { fr: 'Tous les tags', en: 'All tags' },
  footerText: { fr: 'Conçu pour les développeurs.', en: 'Built for developers.' },
  heroTitle: { fr: 'Explorez. Apprenez. Construisez.', en: 'Explore. Learn. Build.' },
  heroSubtitle: { fr: 'Des articles et tutoriels pointus pour les développeurs qui veulent passer au niveau supérieur.', en: 'Advanced articles and tutorials for developers who want to level up.' },
  contact: { fr: 'Contact', en: 'Contact' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof dictionary) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('blog-lang') as Language;
    if (savedLang === 'fr' || savedLang === 'en') {
      setLanguageState(savedLang);
    }
  }, []);

  const triggerGoogleTranslate = (lang: string) => {
    // 1. Try to trigger via combobox (without reload)
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    } else {
      // 2. If combobox is not available, set cookies and reload the page.
      // Google translate automatically reads the googtrans cookie on page load.
      document.cookie = `googtrans=/fr/${lang}; path=/`;
      document.cookie = `googtrans=/fr/${lang}; domain=${window.location.hostname}; path=/`;
      window.location.reload();
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('blog-lang', lang);
    
    // Set cookie for Google Translate (to persist translation across reloads if the widget handles it)
    document.cookie = `googtrans=/fr/${lang}; path=/`;
    document.cookie = `googtrans=/fr/${lang}; domain=${window.location.hostname}; path=/`;
    
    // Trigger translation
    triggerGoogleTranslate(lang);
  };

  const t = (key: keyof typeof dictionary): string => {
    return dictionary[key]?.[language] || key as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
