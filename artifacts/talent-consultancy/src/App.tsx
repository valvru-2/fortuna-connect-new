import { useEffect, useState } from 'react';
import { translations, type Language } from './content';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';
import InteractivePipeline from './components/InteractivePipeline';
import CandidateOnboarding from './components/CandidateOnboarding';
import B2BModal from './components/B2BModal';
import Footer from './components/Footer';

function App() {
  const [language, setLanguage] = useState<Language>('ES');
  const [menuOpen, setMenuOpen] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(0);
  const [b2bOpen, setB2bOpen] = useState(false);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    document.title = language === 'ES'
      ? 'Fortuna Connect — Conectando talento con oportunidades'
      : language === 'PT'
        ? 'Fortuna Connect — Conectando talentos a oportunidades'
        : 'Fortuna Connect — Connecting talent with opportunity';
  }, [language]);
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [language]);

  return <main className="site-shell" lang={language.toLowerCase()}>
    <Header language={language} setLanguage={setLanguage} t={t} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onB2B={() => setB2bOpen(true)} />
    <div className="locale-content" key={language}>
      <Hero t={t} language={language} onB2B={() => setB2bOpen(true)} />
      <div className="ticker" aria-label={t.hero.ariaLabel}>{t.ticker.map((item, index) => <span className="ticker-item" key={item}>{index > 0 && <span className="ticker-dot" aria-hidden="true" />}{item}</span>)}</div>
      <ServicesGrid t={t} />
      <InteractivePipeline t={t} stage={pipelineStage} setStage={setPipelineStage} />
      <CandidateOnboarding t={t} language={language} />
      <section className="quote-band reveal" aria-label={t.quote.ariaLabel}><blockquote className="quote">{t.quote.text}</blockquote><p className="quote-aside">{t.quote.aside}</p></section>
      <Footer t={t} />
    </div>
    <B2BModal open={b2bOpen} onOpenChange={setB2bOpen} language={language} t={t} />
  </main>;
}

export default App;
