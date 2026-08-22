import { NavLink } from 'react-router-dom';

export default function SideNavBar() {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3 rounded-xl transition-transform ${isActive ? 'bg-tertiary-fixed text-on-tertiary-fixed border-[3px] border-on-background shadow-[4px_4px_0px_0px_#1A1A1A] active:scale-95' : 'text-on-surface-variant hover:bg-surface-variant hover:translate-x-1'}`;

  return (
    <aside
      className="hidden lg:flex flex-col p-6 gap-stack-md h-full bg-surface-container-low border-r-[3px] border-on-background w-72 sticky top-[76px] self-start z-40"
      style={{ height: "calc(100vh - 76px)" }}
    >
      <div className="flex flex-col gap-2 mb-stack-md">
        <div className="w-12 h-12 rounded-full neo-border overflow-hidden bg-primary-container mb-2">
          <img
            className="w-full h-full object-cover"
            alt="Author portrait"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAKbjOZFENCflJNTndzxluNjVE7yR3qpULNs7I5o-6hRqWOmOGI0ckhJ6bWNSPHs5Y8_4jQ3XsRaZSOs4jxVkxywXfHiv70GLcQyIwWrNFOB7Fu9iLVRvoMgoWZ0XTLuwDzooeyCECj6TY7sy931fEXrn9hid-T98YygWoTNnveqr4BxqBKn1FCGmmkRfq3f4AKvjUmuAMmEfSBM3DP737x3Qzviv-o6oQYNrvANvMRX-llWGgahFgNw"
          />
        </div>
        <h2 className="font-headline-sm text-headline-sm text-primary notranslate">DevRaw</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Explorations techniques approfondies.</p>
      </div>
      <nav className="flex flex-col gap-2 flex-1 font-label-mono text-label-mono">
        <NavLink className={getNavClass} to="/" end>
          <span className="material-symbols-outlined notranslate">article</span>
          Derniers Articles
        </NavLink>
        <NavLink className={getNavClass} to="/tags/populaire">
          <span className="material-symbols-outlined notranslate">trending_up</span>
          Populaire
        </NavLink>
        <NavLink className={getNavClass} to="/tags/architecture">
          <span className="material-symbols-outlined notranslate">architecture</span>
          Architecture Système
        </NavLink>
        <NavLink className={getNavClass} to="/tags/rust-go">
          <span className="material-symbols-outlined notranslate">terminal</span>
          Rust & Go
        </NavLink>
        <NavLink className={getNavClass} to="/tags/open-source">
          <span className="material-symbols-outlined notranslate">code</span>
          Open Source
        </NavLink>
      </nav>
      <div className="mt-auto flex flex-col gap-4">
        <button className="w-full bg-[#5865F2] text-white neo-border py-3 font-label-mono text-label-mono font-bold neo-shadow-sm neo-btn flex justify-center items-center gap-2">
          Rejoindre Discord
        </button>
        <div className="flex flex-col gap-2 font-label-mono text-label-mono text-xs border-t-[3px] border-on-background pt-4">
          <a className="flex items-center gap-2 text-on-surface-variant hover:text-primary" href="#">
            <span className="material-symbols-outlined notranslate text-sm">settings</span> Paramètres
          </a>
          <a className="flex items-center gap-2 text-on-surface-variant hover:text-primary" href="#">
            <span className="material-symbols-outlined notranslate text-sm">menu_book</span> Documentation
          </a>
        </div>
      </div>
    </aside>
  );
}
