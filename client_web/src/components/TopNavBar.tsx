import { NavLink, Link } from 'react-router-dom';

export default function TopNavBar() {
  const getNavClass = ({ isActive }: { isActive: boolean }) => 
    `transition-colors px-2 py-1 ${isActive ? 'text-primary underline decoration-[3px] underline-offset-4' : 'text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'}`;

  return (
    <nav className="bg-background w-full border-b-[3px] border-on-background shadow-[4px_4px_0px_0px_#1A1A1A] flex justify-between items-center px-gutter py-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-headline-sm text-headline-sm font-bold text-on-background">DevRaw</Link>
      </div>
      <div className="hidden md:flex items-center gap-8 font-label-mono text-label-mono">
        <NavLink to="/" className={getNavClass} end>Articles</NavLink>
        <NavLink to="/guides" className={getNavClass}>Guides</NavLink>
        <NavLink to="/tutoriels" className={getNavClass}>Tutoriels</NavLink>
        <NavLink to="/newsletter" className={getNavClass}>Newsletter</NavLink>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-surface-container-lowest neo-border w-10 h-10 flex items-center justify-center neo-shadow-sm neo-btn">
          <span className="material-symbols-outlined text-on-background">search</span>
        </button>
        <Link to="/newsletter" className="bg-primary text-on-primary neo-border px-6 py-2 font-label-mono text-label-mono uppercase font-bold neo-shadow-sm neo-btn hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors">
          S'abonner
        </Link>
      </div>
    </nav>
  );
}
