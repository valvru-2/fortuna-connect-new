import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { b2bTranslations, type Language, type Translations } from '../content';

export default function Hero({ t, language, onB2B }: { t: Translations; language: Language; onB2B: () => void }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow reveal">{t.hero.eyebrow}</div>
        <h1 className="display hero-title reveal" id="hero-title">{t.hero.title}</h1>
        <div className="hero-rule reveal" aria-hidden="true" />
        <p className="hero-intro reveal">{t.hero.intro}</p>
        <div className="hero-cta-row reveal">
          <button className="button-primary" type="button" onClick={onB2B} data-testid="button-connect-hero">{b2bTranslations[language].cta} <ArrowRight size={16} aria-hidden="true" /></button>
          <a className="button-text" href="#companies" data-testid="link-explore-services">{t.hero.secondaryCta} <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
        <div className="hero-meta reveal" aria-label={t.hero.ariaLabel}>{t.hero.stats.map((stat) => <div key={stat.value}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
      </div>
      <div className="hero-visual reveal">
        <img className="hero-image" src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1800" alt={t.hero.imageAlt} data-testid="img-hero-office" />
        <div className="hero-image-label"><span className="mono">FORTUNA / 01</span><span>{t.hero.imageLabel}</span></div>
      </div>
    </section>
  );
}
