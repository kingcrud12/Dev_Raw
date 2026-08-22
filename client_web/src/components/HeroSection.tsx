import { useLanguage } from '../context/LanguageContext';

export default function HeroSection() {
  const { language } = useLanguage();
  return (
    <section className="flex flex-col gap-stack-md">
      <h1 className="font-headline-lg-mobile md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-background uppercase max-w-4xl">
        {language === 'en' ? <>CODE.<br />BUILD.<br />SHIP.</> : <>CODER.<br />CONSTRUIRE.<br />LIVRER.</>}
      </h1>
      <div className="w-full max-w-[700px] h-48 md:h-64 rounded-xl neo-border neo-shadow-md overflow-hidden relative bg-primary-container">
        <img
          className="w-full h-full object-cover"
          alt="A striking digital installation art piece featuring glowing, generative geometric shapes representing code structures, suspended in a bright, modern space. The artwork relies on a sophisticated palette of deep blacks and pristine whites, punctuated by intense accents of vibrant pink and mint. The mood is high-energy, raw, and technologically advanced."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkucjQ4W9UJu4xfJcVfL3Tqpe5O8iXLoNJxwYqGDiUQ_fEdAvUjD4hfBgPfL6kj9Kn2u_7THHqUbslQzFsAJyTyakgZCHkOFjYNO_NjUqMgR8gQThzfxu4_7UA-5xk7TYvTWxwdH9yU1tsHLENhV1xszBbnpBiQAe0MgI9tbeAH502JASlJTsJcRT--CooUNvhwYyTCfD2xIDXNk8F-NpKX6mf-oPdVTV8YRzfUrCNeYU8dhkUhNGr8w"
        />
        <div className="absolute bottom-6 right-6 bg-tertiary-container neo-border px-6 py-3 neo-shadow-sm transform rotate-3">
          <span className="font-label-mono text-label-mono font-bold text-on-background">{language === 'en' ? 'V 3.4.0 ONLINE' : 'V 3.4.0 EN LIGNE'}</span>
        </div>
      </div>
    </section>
  );
}
