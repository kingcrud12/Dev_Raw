import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-surface-container-high w-full border-t-[3px] border-on-background flex flex-col md:flex-row justify-between items-center px-margin py-stack-md gap-4 mt-stack-md">
      <div className="font-headline-sm text-headline-sm font-black text-on-surface notranslate">
        DevRaw
      </div>
      <div className="flex flex-wrap justify-center gap-6 font-label-mono text-label-mono text-on-surface-variant">
        <a className="hover:text-primary underline" href="#">RSS</a>
        <a className="hover:text-primary underline" href="#">Privacy</a>
        <a className="hover:text-primary underline" href="#">Source</a>
        <a className="hover:text-primary underline" href="#">{t('contact')}</a>
      </div>
      <div className="font-body-md text-body-md text-on-surface">
        © 2026 <span className="notranslate">DevRaw</span>. {t('footerText')}
      </div>
    </footer>
  );
}
