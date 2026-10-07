import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Menu, UploadCloud, X } from 'lucide-react';
import { languages, translations, type Language, type Translations } from './content';

type FormValues = {
  role: string;
  email: string;
  cv: File | null;
};

const officeImage =
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1800';

function useReveal(language: Language) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [language]);
}

function scrollToOnboarding() {
  document.getElementById('candidate')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function App() {
  const [language, setLanguage] = useState<Language>('ES');
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [pipelineStage, setPipelineStage] = useState(0);
  const [form, setForm] = useState<FormValues>({ role: '', email: '', cv: null });
  const [error, setError] = useState<keyof Translations['candidate']['errors'] | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];
  useReveal(language);

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    document.title =
      language === 'ES'
        ? 'Fortuna Connect — Conectando talento con oportunidades'
        : language === 'PT'
          ? 'Fortuna Connect — Conectando talentos a oportunidades'
          : 'Fortuna Connect — Connecting talent with opportunity';
  }, [language]);

  const selectFile = (file?: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError('fileSize');
      return;
    }
    setForm((current) => ({ ...current, cv: file }));
    setError(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const advance = () => {
    if (step === 1 && form.role.trim().length < 2) {
      setError('roleRequired');
      return;
    }
    if (step === 2 && !form.cv) {
      setError('cvRequired');
      return;
    }
    if (step === 3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('invalidEmail');
      return;
    }
    setError(null);
    setStep((current) => current + 1);
  };

  const resetFlow = () => {
    setStep(0);
    setForm({ role: '', email: '', cv: null });
    setError(null);
  };

  const handleNav = (event: MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    if (event.currentTarget.getAttribute('href') === '#candidate') {
      event.preventDefault();
      scrollToOnboarding();
    }
  };

  return (
    <main className="site-shell" lang={language.toLowerCase()}>
      <header className="nav-bar">
        <a className="brand-lockup" href="#top" data-testid="link-brand" aria-label="Fortuna Connect home">
          <span className="brand-mark">F</span>
          <span className="brand-type">FORTUNA CONNECT</span>
        </a>
        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label={t.navLabel}>
          <a href="#companies" onClick={handleNav} data-testid="link-companies">{t.navCompanies}</a>
          <a href="#pipeline" onClick={handleNav} data-testid="link-pipeline">{t.navPipeline}</a>
          <button className="nav-contact" type="button" onClick={() => { setMenuOpen(false); scrollToOnboarding(); }} data-testid="button-connect-nav">
            {t.navConnect} <ArrowUpRight size={15} aria-hidden="true" />
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
              onClick={() => { setLanguage(option); setMenuOpen(false); }}
              data-testid={`button-language-${option.toLowerCase()}`}
            >
              {option}
            </button>
          ))}
        </div>
        <button className="nav-menu-toggle" type="button" onClick={() => setMenuOpen((current) => !current)} aria-label={menuOpen ? t.menuClose : t.menuOpen} aria-expanded={menuOpen} data-testid="button-menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className="locale-content" key={language}>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow reveal">{t.hero.eyebrow}</div>
          <h1 className="display hero-title reveal" id="hero-title">{t.hero.title}</h1>
          <div className="hero-rule reveal" aria-hidden="true" />
          <p className="hero-intro reveal">{t.hero.intro}</p>
          <div className="hero-cta-row reveal">
            <button className="button-primary" type="button" onClick={scrollToOnboarding} data-testid="button-connect-hero">
              {t.hero.primaryCta} <ArrowRight size={16} aria-hidden="true" />
            </button>
            <a className="button-text" href="#companies" data-testid="link-explore-services">{t.hero.secondaryCta}</a>
          </div>
          <div className="hero-meta reveal" aria-label={t.hero.ariaLabel}>
            {t.hero.stats.map((stat) => (
              <div key={stat.value}><strong>{stat.value}</strong><span>{stat.label}</span></div>
            ))}
          </div>
        </div>
        <div className="hero-visual reveal">
          <img className="hero-image" src={officeImage} alt={t.hero.imageAlt} data-testid="img-hero-office" />
          <div className="hero-image-label"><span className="mono">FORTUNA / 01</span><span>{t.hero.imageLabel}</span></div>
        </div>
      </section>

      <div className="ticker" aria-label={t.hero.ariaLabel}>
        {t.ticker.map((item, index) => (
          <span className="ticker-item" key={item}>
            {index > 0 && <span className="ticker-dot" aria-hidden="true" />}
            {item}
          </span>
        ))}
      </div>

      <section className="section services" id="companies" aria-labelledby="services-title">
        <div className="section-grid">
          <div className="reveal">
            <div className="eyebrow section-index">{t.services.eyebrow}</div>
            <h2 className="display section-heading" id="services-title">{t.services.title}</h2>
            <p className="section-copy">{t.services.intro}</p>
          </div>
          <div className="service-grid reveal">
            {t.services.items.map((service, index) => (
              <article className="service-item" key={service.title} data-testid={`card-service-${index + 1}`}>
                <div className="eyebrow service-index">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section pipeline" id="pipeline" aria-labelledby="pipeline-title">
        <div className="section-grid">
          <div className="pipeline-copy reveal">
            <div className="eyebrow section-index">{t.pipeline.eyebrow}</div>
            <h2 className="display section-heading" id="pipeline-title">{t.pipeline.title}</h2>
            <p className="section-copy">{t.pipeline.intro}</p>
            <ul className="pipeline-principles">
              {t.pipeline.principles.map((principle) => (
                <li key={principle}><span aria-hidden="true" />{principle}</li>
              ))}
            </ul>
          </div>
          <div className="pipeline-board reveal">
            <div className="pipeline-board-top">
              <div>
                <span className="eyebrow">{t.pipeline.widgetLabel}</span>
                <p>{t.pipeline.widgetCaption}</p>
              </div>
              <span className="pipeline-demo-badge">{t.pipeline.illustrative}</span>
            </div>
            <div className="pipeline-tabs" role="tablist" aria-label={t.pipeline.tabsLabel}>
              {t.pipeline.stages.map((stage, index) => (
                <button
                  className={`pipeline-tab ${pipelineStage === index ? 'is-active' : ''}`}
                  type="button"
                  role="tab"
                  id={`pipeline-tab-${index}`}
                  aria-controls="pipeline-stage-panel"
                  aria-selected={pipelineStage === index}
                  tabIndex={pipelineStage === index ? 0 : -1}
                  key={stage.name}
                  onClick={() => setPipelineStage(index)}
                  onKeyDown={(event) => {
                    const last = t.pipeline.stages.length - 1;
                    const next = event.key === 'ArrowRight'
                      ? (index + 1) % t.pipeline.stages.length
                      : event.key === 'ArrowLeft'
                        ? (index + last) % t.pipeline.stages.length
                        : event.key === 'Home'
                          ? 0
                          : event.key === 'End'
                            ? last
                            : null;
                    if (next !== null) {
                      event.preventDefault();
                      setPipelineStage(next);
                      document.getElementById(`pipeline-tab-${next}`)?.focus();
                    }
                  }}
                >
                  <span className="pipeline-tab-number">{String(index + 1).padStart(2, '0')}</span>
                  <span>{stage.name}</span>
                </button>
              ))}
            </div>
            <div className="pipeline-profile">
              <div className="pipeline-monogram" aria-hidden="true">FC</div>
              <div className="pipeline-profile-copy">
                <strong>{t.pipeline.profileLabel}</strong>
                <span>{t.pipeline.profileDetail}</span>
              </div>
              <span className="pipeline-profile-status"><span aria-hidden="true" />{t.pipeline.stages[pipelineStage].status}</span>
            </div>
            <div
              className="pipeline-stage-panel"
              id="pipeline-stage-panel"
              role="tabpanel"
              aria-labelledby={`pipeline-tab-${pipelineStage}`}
              key={`${language}-${pipelineStage}`}
            >
              <div className="pipeline-stage-copy">
                <span className="eyebrow">{t.pipeline.stageProgress} {String(pipelineStage + 1).padStart(2, '0')} / 03</span>
                <h3>{t.pipeline.stages[pipelineStage].title}</h3>
                <p>{t.pipeline.stages[pipelineStage].body}</p>
              </div>
              <div className="pipeline-stage-metric" aria-hidden="true">
                <strong>{t.pipeline.stages[pipelineStage].metric}</strong>
                <span>{t.pipeline.stages[pipelineStage].metricLabel}</span>
              </div>
            </div>
            <div className="pipeline-board-bottom">
              <div className="pipeline-progress" role="progressbar" aria-label={t.pipeline.progressLabel} aria-valuemin={1} aria-valuemax={3} aria-valuenow={pipelineStage + 1}>
                <span style={{ width: `${((pipelineStage + 1) / t.pipeline.stages.length) * 100}%` }} />
              </div>
              <button
                type="button"
                className="pipeline-next"
                onClick={() => setPipelineStage((current) => (current + 1) % t.pipeline.stages.length)}
              >
                {pipelineStage === t.pipeline.stages.length - 1 ? t.pipeline.restart : t.pipeline.next}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section onboarding" id="candidate" aria-labelledby="candidate-title">
        <div className="section-grid">
          <div className="reveal">
            <div className="eyebrow section-index">{t.candidate.eyebrow}</div>
            <h2 className="display section-heading" id="candidate-title">{t.candidate.title}</h2>
            <p className="section-copy">{t.candidate.intro}</p>
          </div>
          <div className="onboarding-panel reveal" aria-live="polite">
            <div className="onboarding-panel-inner">
              <div className="onboarding-topline">
                <span className="eyebrow">{t.candidate.panelLabel}</span>
                <span className="onboarding-step-count">{step < 4 ? `0${step + 1} / 04` : t.candidate.completeLabel}</span>
              </div>
              {step < 4 && (
                <div
                  className="progress-track"
                  role="progressbar"
                  aria-label={t.candidate.progressLabel}
                  aria-valuemin={1}
                  aria-valuemax={4}
                  aria-valuenow={step + 1}
                >
                  <div className="progress-value" style={{ width: `${((step + 1) / 4) * 100}%` }} />
                </div>
              )}
              {step === 0 && (
                <>
                  <h3 id="onboarding-title">{t.candidate.startTitle}</h3>
                  <p className="question-copy">{t.candidate.startBody}</p>
                  <button className="linkedin-button" type="button" onClick={() => { setForm((current) => ({ ...current, role: current.role || 'A role aligned with my experience' })); setStep(1); }} data-testid="button-connect-linkedin">
                    <span className="linkedin-button-main"><span className="linkedin-icon">in</span><span>{t.candidate.linkedin}</span></span><ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                  <div className="manual-divider"><span>{t.candidate.manualDivider}</span></div>
                  <button className="button-text" type="button" style={{ color: '#f3f6fb' }} onClick={() => setStep(1)} data-testid="button-manual-path">{t.candidate.manual} <ArrowRight size={14} style={{ verticalAlign: 'middle', marginLeft: 4 }} aria-hidden="true" /></button>
                </>
              )}
              {step === 1 && (
                <>
                  <h3>{t.candidate.roleTitle}</h3>
                  <p className="question-copy">{t.candidate.roleBody}</p>
                  <label className="input-label" htmlFor="role-input">{t.candidate.roleLabel}</label>
                  <input className="dark-input" id="role-input" type="text" value={form.role} onChange={(event) => { setForm((current) => ({ ...current, role: event.target.value })); setError(null); }} placeholder={t.candidate.rolePlaceholder} data-testid="input-role" autoComplete="organization-title" />
                  {error && <p className="form-error" role="alert" data-testid="error-role">{t.candidate.errors[error]}</p>}
                  <div className="onboarding-actions"><button className="back-button" type="button" onClick={() => { setError(null); setStep(0); }} data-testid="button-back-role"><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} aria-hidden="true" /> {t.candidate.back}</button><button className="button-primary" type="button" onClick={advance} data-testid="button-next-role">{t.candidate.next} <ArrowRight size={16} aria-hidden="true" /></button></div>
                </>
              )}
              {step === 2 && (
                <>
                  <h3>{t.candidate.cvTitle}</h3>
                  <p className="question-copy">{t.candidate.cvBody}</p>
                  <label className={`drop-zone ${dragging ? 'is-dragging' : ''}`} htmlFor="cv-input" onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} data-testid="dropzone-cv">
                    <UploadCloud size={24} aria-hidden="true" />
                    <span className="drop-zone-copy"><strong>{form.cv ? form.cv.name : t.candidate.cvChoose}</strong><span>{form.cv ? `${(form.cv.size / 1024 / 1024).toFixed(1)} MB` : t.candidate.cvConfidential}</span></span>
                    <input className="file-input-hidden" id="cv-input" ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} data-testid="input-cv" />
                  </label>
                  {error && <p className="form-error" role="alert" data-testid="error-cv">{t.candidate.errors[error]}</p>}
                  <div className="onboarding-actions"><button className="back-button" type="button" onClick={() => { setError(null); setStep(1); }} data-testid="button-back-cv"><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} aria-hidden="true" /> {t.candidate.back}</button><button className="button-primary" type="button" onClick={advance} data-testid="button-next-cv">{t.candidate.next} <ArrowRight size={16} aria-hidden="true" /></button></div>
                </>
              )}
              {step === 3 && (
                <>
                  <h3>{t.candidate.emailTitle}</h3>
                  <p className="question-copy">{t.candidate.emailBody}</p>
                  <label className="input-label" htmlFor="email-input">{t.candidate.emailLabel}</label>
                  <input className="dark-input" id="email-input" type="email" value={form.email} onChange={(event) => { setForm((current) => ({ ...current, email: event.target.value })); setError(null); }} placeholder={t.candidate.emailPlaceholder} data-testid="input-email" autoComplete="email" />
                  {error && <p className="form-error" role="alert" data-testid="error-email">{t.candidate.errors[error]}</p>}
                  <div className="onboarding-actions"><button className="back-button" type="button" onClick={() => { setError(null); setStep(2); }} data-testid="button-back-email"><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} aria-hidden="true" /> {t.candidate.back}</button><button className="button-primary" type="button" onClick={advance} data-testid="button-submit-candidate">{t.candidate.submit} <ArrowRight size={16} aria-hidden="true" /></button></div>
                </>
              )}
              {step === 4 && (
                <>
                  <div className="completion-mark"><Check size={25} aria-hidden="true" /></div>
                  <h3>{t.candidate.completeTitle}</h3>
                  <p className="completion-note">{t.candidate.completeBody.split('{email}')[0]}<strong>{form.email || t.candidate.emailLabel.toLowerCase()}</strong>{t.candidate.completeBody.split('{email}')[1]}</p>
                  <button className="reset-button" type="button" onClick={resetFlow} data-testid="button-start-over">{t.candidate.restart}</button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="quote-band reveal" aria-label={t.quote.ariaLabel}>
        <blockquote className="quote">{t.quote.text}</blockquote>
        <p className="quote-aside">{t.quote.aside}</p>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <a className="brand-lockup" href="#top" data-testid="link-footer-brand"><span className="brand-mark">F</span><span className="brand-type">FORTUNA CONNECT</span></a>
            <p className="footer-tagline">{t.footer.tagline}</p>
          </div>
          <div className="footer-column">
            <h3 className="eyebrow">{t.footer.explore}</h3>
            <a href="#companies" data-testid="link-footer-companies">{t.footer.companies} <ArrowUpRight size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} aria-hidden="true" /></a>
            <a href="#pipeline" data-testid="link-footer-pipeline">{t.footer.pipeline} <ArrowUpRight size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} aria-hidden="true" /></a>
            <button type="button" onClick={scrollToOnboarding} data-testid="button-footer-connect">{t.footer.connect} <ArrowUpRight size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} aria-hidden="true" /></button>
          </div>
          <div className="footer-column">
            <h3 className="eyebrow">{t.footer.contact}</h3>
            <a href="https://thefortunaconnect.com" target="_blank" rel="noreferrer" data-testid="link-footer-website">{t.footer.website} <ArrowUpRight size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} aria-hidden="true" /></a>
            <span className="footer-locations">{t.footer.locations}</span>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Fortuna Connect. {t.footer.rights}</span><span className="mono">FC / {String(new Date().getFullYear()).slice(-2)}</span></div>
      </footer>
      </div>
    </main>
  );
}

export default App;
