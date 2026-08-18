export default function RightWidgets() {
  return (
    <aside className="hidden xl:flex flex-col w-80 p-6 gap-stack-lg border-l-[3px] border-on-background bg-surface-container-low">
      {/* Newsletter Widget */}
      <div className="bg-primary-container neo-border p-6 neo-shadow-sm flex flex-col gap-4">
        <div className="w-12 h-12 bg-on-background rounded-full flex items-center justify-center neo-shadow-sm mb-2">
          <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-background">Restez à jour.</h3>
        <p className="font-body-md text-body-md text-on-primary-container">Recevez nos articles techniques hebdomadaires directement dans votre boîte mail.</p>
        <form className="flex flex-col gap-3 mt-2">
          <input className="w-full bg-surface-container-lowest neo-border p-3 font-label-mono focus:ring-0 focus:outline-none focus:bg-tertiary-container transition-colors" placeholder="dev@example.com" type="email" />
          <button className="w-full bg-on-background text-surface-container-lowest neo-border py-3 font-label-mono font-bold uppercase neo-shadow-sm neo-btn hover:bg-primary transition-colors" type="button">
            S'inscrire
          </button>
        </form>
      </div>

      {/* Tags Widget */}
      <div className="flex flex-col gap-4">
        <h3 className="font-label-mono text-label-mono font-bold text-on-background uppercase tracking-widest border-b-[3px] border-on-background pb-2">Sujets Chauds</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-surface-container-lowest neo-border px-3 py-1 rounded-full text-sm font-label-mono hover:bg-secondary-container cursor-pointer transition-colors">#TypeScript</span>
          <span className="bg-surface-container-lowest neo-border px-3 py-1 rounded-full text-sm font-label-mono hover:bg-primary-container cursor-pointer transition-colors">#WebAssembly</span>
          <span className="bg-surface-container-lowest neo-border px-3 py-1 rounded-full text-sm font-label-mono hover:bg-tertiary-container cursor-pointer transition-colors">#GraphQL</span>
          <span className="bg-surface-container-lowest neo-border px-3 py-1 rounded-full text-sm font-label-mono hover:bg-surface-variant cursor-pointer transition-colors">#Docker</span>
          <span className="bg-surface-container-lowest neo-border px-3 py-1 rounded-full text-sm font-label-mono hover:bg-surface-variant cursor-pointer transition-colors">#React</span>
        </div>
      </div>
    </aside>
  );
}
