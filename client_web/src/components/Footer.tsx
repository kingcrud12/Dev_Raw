export default function Footer() {
  return (
    <footer className="bg-surface-container-high w-full border-t-[3px] border-on-background flex flex-col md:flex-row justify-between items-center px-margin py-stack-md gap-4 mt-stack-md">
      <div className="font-headline-sm text-headline-sm font-black text-on-surface">
        DevRaw
      </div>
      <div className="flex flex-wrap justify-center gap-6 font-label-mono text-label-mono text-on-surface-variant">
        <a className="hover:text-primary underline" href="#">Flux RSS</a>
        <a className="hover:text-primary underline" href="#">Politique de Confidentialité</a>
        <a className="hover:text-primary underline" href="#">Code Source</a>
        <a className="hover:text-primary underline" href="#">Contact</a>
      </div>
      <div className="font-body-md text-body-md text-on-surface">
        © 2024 DevRaw. Conçu pour les développeurs.
      </div>
    </footer>
  );
}
