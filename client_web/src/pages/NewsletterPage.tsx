import { useState } from 'react';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[<>]/g, '');
    setEmail(sanitized);
  };
  return (
    <section className="flex flex-col items-center justify-center pt-stack-lg pb-stack-lg h-full min-h-[60vh]">
      <div className="bg-primary-container neo-border p-10 md:p-16 neo-shadow-md flex flex-col gap-6 max-w-2xl w-full text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-tertiary-container rounded-full neo-border opacity-50 blur-sm"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-container neo-border transform rotate-45 opacity-50 blur-sm"></div>
        
        <div className="w-20 h-20 bg-on-background rounded-full flex items-center justify-center mx-auto neo-shadow-sm mb-4 relative z-10">
          <span className="material-symbols-outlined text-5xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
        </div>
        
        <h1 className="font-headline-xl text-headline-xl text-on-background relative z-10">
          Ne manquez rien.
        </h1>
        
        <p className="font-body-lg text-body-lg text-on-primary-container relative z-10 mb-6">
          Rejoignez plus de 10 000 développeurs qui reçoivent nos explorations techniques, tutoriels et astuces d'architecture chaque mardi. Pas de spam, uniquement du contenu pur et dur.
        </p>
        
        <form className="flex flex-col md:flex-row gap-4 relative z-10">
          <input 
            className="flex-1 bg-surface-container-lowest neo-border p-4 font-label-mono text-lg focus:ring-0 focus:outline-none focus:bg-tertiary-container transition-colors" 
            placeholder="votre.email@exemple.com" 
            type="email" 
            required 
            value={email}
            onChange={handleEmailChange}
          />
          <button 
            className="bg-on-background text-surface-container-lowest neo-border px-8 py-4 font-label-mono font-bold uppercase text-lg neo-shadow-sm neo-btn hover:bg-primary transition-colors whitespace-nowrap" 
            type="submit"
          >
            S'abonner
          </button>
        </form>
        
        <p className="font-label-mono text-sm text-on-primary-container mt-4 relative z-10">
          Vous pouvez vous désabonner à tout moment. Lisez notre <a href="#" className="underline font-bold">Politique de Confidentialité</a>.
        </p>
      </div>
    </section>
  );
}
