export default function CategoryCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Flutter */}
      <article className="bg-primary-container neo-border neo-shadow-md p-6 flex flex-col justify-between min-h-[250px] group hover:-translate-y-1 transition-transform">
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined notranslate text-4xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>phone_iphone</span>
          <div className="bg-surface-container-lowest neo-border px-3 py-1 rounded-full text-xs font-label-mono font-bold">MOBILE</div>
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background mb-2 group-hover:underline decoration-[3px] underline-offset-4">Flutter 3.19</h3>
          <p className="font-body-md text-body-md text-on-primary-container">Maîtriser les animations complexes et le moteur Impeller pour des perfs natives.</p>
        </div>
      </article>

      {/* Card 2: Node.js */}
      <article className="bg-secondary-container neo-border neo-shadow-md p-6 flex flex-col justify-between min-h-[250px] group hover:-translate-y-1 transition-transform">
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined notranslate text-4xl text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>dns</span>
          <div className="bg-surface-container-lowest neo-border px-3 py-1 rounded-full text-xs font-label-mono font-bold">BACKEND</div>
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background mb-2 group-hover:underline decoration-[3px] underline-offset-4">Node.js V20</h3>
          <p className="font-body-md text-body-md text-on-secondary-container">Architecture orientée événements avec NestJS et intégration Kafka robuste.</p>
        </div>
      </article>

      {/* Card 3: Architecture */}
      <article className="bg-tertiary-container neo-border neo-shadow-md p-6 flex flex-col justify-between min-h-[250px] group hover:-translate-y-1 transition-transform">
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined notranslate text-4xl text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>schema</span>
          <div className="bg-surface-container-lowest neo-border px-3 py-1 rounded-full text-xs font-label-mono font-bold">SYSTÈMES</div>
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background mb-2 group-hover:underline decoration-[3px] underline-offset-4">Micro-Frontends</h3>
          <p className="font-body-md text-body-md text-on-tertiary-container">Le guide définitif de l'intégration continue et du déploiement isolé.</p>
        </div>
      </article>
    </section>
  );
}
