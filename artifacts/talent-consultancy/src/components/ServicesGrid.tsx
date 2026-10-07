import type { Translations } from '../content';

export default function ServicesGrid({ t }: { t: Translations }) {
  return <section className="section services" id="companies" aria-labelledby="services-title">
    <div className="section-grid">
      <div className="reveal"><div className="eyebrow section-index">{t.services.eyebrow}</div><h2 className="display section-heading" id="services-title">{t.services.title}</h2><p className="section-copy">{t.services.intro}</p></div>
      <div className="service-grid reveal">{t.services.items.map((service, index) => <article className="service-item" key={service.title} data-testid={`card-service-${index + 1}`}><div className="eyebrow service-index">{String(index + 1).padStart(2, '0')}</div><h3 className="service-title">{service.title}</h3><p className="service-description">{service.description}</p></article>)}</div>
    </div>
  </section>;
}
