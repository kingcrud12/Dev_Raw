import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useLanguage } from '../context/LanguageContext';

export default function TopNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const getNavClass = ({ isActive }: { isActive: boolean }) => 
    `transition-colors px-2 py-1 ${isActive ? 'text-primary underline decoration-[3px] underline-offset-4' : 'text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'}`;

  return (
    <nav className="bg-background w-full border-b-[3px] border-on-background shadow-[0px_4px_0px_0px_#1A1A1A] flex justify-between items-center px-gutter py-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button className="md:hidden bg-surface-container-lowest neo-border w-10 h-10 flex items-center justify-center neo-shadow-sm neo-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="material-symbols-outlined notranslate text-on-background">menu</span>
        </button>
        <Link to="/" className="font-headline-sm text-headline-sm font-bold text-on-background notranslate">DevRaw</Link>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 font-label-mono text-label-mono">
        <NavLink to="/" className={getNavClass} end>{t('articles')}</NavLink>
        <NavLink to="/guides" className={getNavClass}>{t('guides')}</NavLink>
        <NavLink to="/tutoriels" className={getNavClass}>{t('tutorials')}</NavLink>
        <NavLink to="/newsletter" className={getNavClass}>{t('newsletter')}</NavLink>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="bg-surface-variant text-on-surface-variant font-bold font-label-mono neo-border w-10 h-10 hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center notranslate"
          title={`Passer en ${language === 'fr' ? 'Anglais' : 'Français'}`}
        >
          {language === 'fr' ? 'EN' : 'FR'}
        </button>
        <SearchBar />
        <Link to="/newsletter" className="hidden sm:block bg-primary text-on-primary neo-border px-6 py-2 font-label-mono text-label-mono uppercase font-bold neo-shadow-sm neo-btn hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors">
          {t('subscribe')}
        </Link>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b-[3px] border-on-background flex flex-col p-4 gap-4 md:hidden neo-shadow-md z-40">
          <NavLink to="/" className={getNavClass} onClick={() => setIsMenuOpen(false)} end>{t('articles')}</NavLink>
          <NavLink to="/guides" className={getNavClass} onClick={() => setIsMenuOpen(false)}>{t('guides')}</NavLink>
          <NavLink to="/tutoriels" className={getNavClass} onClick={() => setIsMenuOpen(false)}>{t('tutorials')}</NavLink>
          <NavLink to="/newsletter" className={getNavClass} onClick={() => setIsMenuOpen(false)}>{t('newsletter')}</NavLink>
        </div>
      )}
    </nav>
  );
}
