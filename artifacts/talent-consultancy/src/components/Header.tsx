import { Menu, X, ArrowUpRight } from 'lucide-react';
import { languages, b2bTranslations, type Language, type Translations } from '../content';
import { FortunaLogo } from './FortunaLogo';

type Props = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onB2B: () => void;
};

export default function Header({ language, setLanguage, t, menuOpen, setMenuOpen, onB2B }: Props) {
  return (
    <header className="nav-bar">
      <a className="brand-lockup" href="#top" data-testid="link-brand" aria-label="Fortuna Connect">
        <FortunaLogo className="h-7 w-auto" showText={true} lightMode={true} />
      </a>
      <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label={t.navLabel}>
        <a href="#companies" onClick={() => setMenuOpen(false)} data-testid="link-companies">{t.navCompanies}</a>
        <a href="#pipeline" onClick={() => setMenuOpen(false)} data-testid="link-pipeline">{t.navPipeline}</a>
        <button className="nav-contact" type="button" onClick={() => { setMenuOpen(false); onB2B(); }} data-testid="button-connect-nav">
          {b2bTranslations[language].cta} <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </nav>
      <div className="language-switcher" role="group" aria-label={t.languageLabel}>
        {languages.map((option) => (
          <button
            className={language === option ? 'is-active' : ''}
            type="button"
            key={option}
            lang={option.toLowerCase()}
            aria-pressed={language === option}
            onClick={() => setLanguage(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className="nav-menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
}