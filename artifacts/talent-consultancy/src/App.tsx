import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Menu, UploadCloud, X } from 'lucide-react';

type FormValues = {
  role: string;
  email: string;
  cv: File | null;
};

const officeImage =
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1800';

function useReveal() {
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
  }, []);
}

function scrollToOnboarding() {
  document.getElementById('candidate')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormValues>({ role: '', email: '', cv: null });
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useReveal();

  const selectFile = (file?: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError('Please choose a file smaller than 8MB.');
      return;
    }
    setForm((current) => ({ ...current, cv: file }));
    setError('');
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
      setError('Tell us which role you are exploring.');
      return;
    }
    if (step === 2 && !form.cv) {
      setError('Add a CV so we can make the right introduction.');
      return;
    }
    if (step === 3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setStep((current) => current + 1);
  };

  const resetFlow = () => {
    setStep(0);
    setForm({ role: '', email: '', cv: null });
    setError('');
  };

  const handleNav = (event: MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    if (event.currentTarget.getAttribute('href') === '#candidate') {
      event.preventDefault();
      scrollToOnboarding();
    }
  };

  return (
    <main className="site-shell">
      <header className="nav-bar">
        <a className="brand-lockup" href="#top" data-testid="link-brand" aria-label="Northstar Talent home">
          <span className="brand-mark">N</span>
          <span className="brand-type">NORTHSTAR / TALENT</span>
        </a>
        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#companies" onClick={handleNav} data-testid="link-companies">For companies</a>
          <a href="#pipeline" onClick={handleNav} data-testid="link-pipeline">Our pipeline</a>
          <button className="nav-contact" type="button" onClick={() => { setMenuOpen(false); scrollToOnboarding(); }} data-testid="button-connect-nav">
            Connect talent <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </nav>
        <button className="nav-menu-toggle" type="button" onClick={() => setMenuOpen((current) => !current)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} data-testid="button-menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow reveal">Independent talent consultancy / Est. 2014</div>
          <h1 className="display hero-title reveal" id="hero-title">Connecting Talent with Opportunity.</h1>
          <div className="hero-rule reveal" aria-hidden="true" />
          <p className="hero-intro reveal">
            Northstar Talent is the search partner for ambitious teams and the people who move them forward. We find the precise fit, then make the introduction matter.
          </p>
          <div className="hero-cta-row reveal">
            <button className="button-primary" type="button" onClick={scrollToOnboarding} data-testid="button-connect-hero">
              Start a conversation <ArrowRight size={16} aria-hidden="true" />
            </button>
            <a className="button-text" href="#companies" data-testid="link-explore-services">Explore our work</a>
          </div>
          <div className="hero-meta reveal" aria-label="Northstar highlights">
            <div><strong>14 yrs</strong><span>in the room</span></div>
            <div><strong>38 cities</strong><span>within reach</span></div>
            <div><strong>1:1</strong><span>human attention</span></div>
          </div>
        </div>
        <div className="hero-visual reveal">
          <img className="hero-image" src={officeImage} alt="Talent leaders discussing a plan around a whiteboard in a bright office" data-testid="img-hero-office" />
          <div className="hero-image-label"><span className="mono">FIELD NOTE 04</span><span>New York / London / Everywhere</span></div>
        </div>
      </section>

      <div className="ticker" aria-label="Northstar focus areas">
        <span>Strategy</span><span className="ticker-dot" /><span>Leadership</span><span className="ticker-dot" /><span>Product</span><span className="ticker-dot" /><span>Growth</span><span className="ticker-dot" /><span>Human capital</span>
      </div>

      <section className="section services" id="companies" aria-labelledby="services-title">
        <div className="section-grid">
          <div className="reveal">
            <div className="eyebrow section-index">01 / For companies</div>
            <h2 className="display section-heading" id="services-title">The right person changes the trajectory.</h2>
            <p className="section-copy">Hiring is a strategic decision disguised as a job description. We bring market intelligence, discretion, and a point of view to every search.</p>
          </div>
          <div className="service-grid reveal">
            <article className="service-item" data-testid="card-service-search">
              <div className="eyebrow service-index">01</div>
              <h3 className="service-title">Executive search</h3>
              <p className="service-description">Critical leadership hires for moments that have no room for the wrong answer.</p>
            </article>
            <article className="service-item" data-testid="card-service-build">
              <div className="eyebrow service-index">02</div>
              <h3 className="service-title">Team build</h3>
              <p className="service-description">Build a function with the right operating rhythm, from first hire to full signal.</p>
            </article>
            <article className="service-item" data-testid="card-service-advisory">
              <div className="eyebrow service-index">03</div>
              <h3 className="service-title">Talent advisory</h3>
              <p className="service-description">A clear-eyed read on the market, your story, and the move worth making next.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section pipeline" id="pipeline" aria-labelledby="pipeline-title">
        <div className="section-grid">
          <div className="pipeline-copy reveal">
            <div className="eyebrow section-index">02 / Our pipeline</div>
            <h2 className="display section-heading" id="pipeline-title">Signal over noise. Always.</h2>
            <p className="section-copy">Our process is deliberately considered. We do the work before we send a name: context, chemistry, ambition, and the detail that makes a placement last.</p>
          </div>
          <div className="pipeline-list reveal">
            <article className="pipeline-item">
              <div className="eyebrow">01 — Listen</div>
              <h3>Read the room.</h3>
              <p>We start with the business, not the vacancy. What is changing? What cannot?</p>
            </article>
            <article className="pipeline-item">
              <div className="eyebrow">02 — Map</div>
              <h3>Find the signal.</h3>
              <p>Our network is built on earned trust and a clear sense of who is ready for what.</p>
            </article>
            <article className="pipeline-item">
              <div className="eyebrow">03 — Align</div>
              <h3>Make it real.</h3>
              <p>We stay close through the decision and after the yes. Good work has a long tail.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section onboarding" id="candidate" aria-labelledby="candidate-title">
        <div className="section-grid">
          <div className="reveal">
            <div className="eyebrow section-index">03 / For candidates</div>
            <h2 className="display section-heading" id="candidate-title">A better role starts with less friction.</h2>
            <p className="section-copy">No portals. No black holes. Give us a clear signal and our team will come back with a considered next step.</p>
          </div>
          <div className="onboarding-panel reveal" aria-live="polite">
            <div className="onboarding-panel-inner">
              <div className="onboarding-topline">
                <span className="eyebrow">Candidate intake</span>
                <span className="onboarding-step-count">{step < 4 ? `0${step + 1} / 04` : 'COMPLETE'}</span>
              </div>
              {step < 4 && <div className="progress-track" aria-label={`Progress: ${step + 1} of 4`}><div className="progress-value" style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>}
              {step === 0 && (
                <>
                  <h3 id="onboarding-title">Start with your signal.</h3>
                  <p className="question-copy">Connect your LinkedIn profile for the fastest route in, or take the considered manual path. Four short steps. One useful conversation.</p>
                  <button className="linkedin-button" type="button" onClick={() => { setForm((current) => ({ ...current, role: current.role || 'A role aligned with my experience' })); setStep(1); }} data-testid="button-connect-linkedin">
                    <span className="linkedin-button-main"><span className="linkedin-icon">in</span><span>Continue with LinkedIn</span></span><ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                  <div className="manual-divider"><span>or complete manually</span></div>
                  <button className="button-text" type="button" style={{ color: '#f3f6fb' }} onClick={() => setStep(1)} data-testid="button-manual-path">Use the manual path <ArrowRight size={14} style={{ verticalAlign: 'middle', marginLeft: 4 }} aria-hidden="true" /></button>
                </>
              )}
              {step === 1 && (
                <>
                  <h3>What kind of move are you considering?</h3>
                  <p className="question-copy">A title is useful. The context behind it is better. Tell us the role or direction on your mind.</p>
                  <label className="input-label" htmlFor="role-input">Role or direction</label>
                  <input className="dark-input" id="role-input" type="text" value={form.role} onChange={(event) => { setForm((current) => ({ ...current, role: event.target.value })); setError(''); }} placeholder="e.g. VP Product, climate tech" data-testid="input-role" autoComplete="organization-title" />
                  {error && <p className="form-error" role="alert" data-testid="error-role">{error}</p>}
                  <div className="onboarding-actions"><button className="back-button" type="button" onClick={() => { setError(''); setStep(0); }} data-testid="button-back-role"><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} aria-hidden="true" /> Back</button><button className="button-primary" type="button" onClick={advance} data-testid="button-next-role">Next <ArrowRight size={16} aria-hidden="true" /></button></div>
                </>
              )}
              {step === 2 && (
                <>
                  <h3>Give us the long view.</h3>
                  <p className="question-copy">A CV or profile gives our team the useful detail. PDF, DOC, or DOCX, up to 8MB.</p>
                  <label className={`drop-zone ${dragging ? 'is-dragging' : ''}`} htmlFor="cv-input" onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} data-testid="dropzone-cv">
                    <UploadCloud size={24} aria-hidden="true" />
                    <span className="drop-zone-copy"><strong>{form.cv ? form.cv.name : 'Drop your CV here or choose a file'}</strong><span>{form.cv ? `${(form.cv.size / 1024 / 1024).toFixed(1)}MB selected` : 'Your information stays confidential.'}</span></span>
                    <input className="file-input-hidden" id="cv-input" ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} data-testid="input-cv" />
                  </label>
                  {error && <p className="form-error" role="alert" data-testid="error-cv">{error}</p>}
                  <div className="onboarding-actions"><button className="back-button" type="button" onClick={() => { setError(''); setStep(1); }} data-testid="button-back-cv"><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} aria-hidden="true" /> Back</button><button className="button-primary" type="button" onClick={advance} data-testid="button-next-cv">Next <ArrowRight size={16} aria-hidden="true" /></button></div>
                </>
              )}
              {step === 3 && (
                <>
                  <h3>Where should we reach you?</h3>
                  <p className="question-copy">We only use this to follow up personally. No newsletters, no automated sequences.</p>
                  <label className="input-label" htmlFor="email-input">Email address</label>
                  <input className="dark-input" id="email-input" type="email" value={form.email} onChange={(event) => { setForm((current) => ({ ...current, email: event.target.value })); setError(''); }} placeholder="you@company.com" data-testid="input-email" autoComplete="email" />
                  {error && <p className="form-error" role="alert" data-testid="error-email">{error}</p>}
                  <div className="onboarding-actions"><button className="back-button" type="button" onClick={() => { setError(''); setStep(2); }} data-testid="button-back-email"><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} aria-hidden="true" /> Back</button><button className="button-primary" type="button" onClick={advance} data-testid="button-submit-candidate">Send my details <ArrowRight size={16} aria-hidden="true" /></button></div>
                </>
              )}
              {step === 4 && (
                <>
                  <div className="completion-mark"><Check size={25} aria-hidden="true" /></div>
                  <h3>You're on our radar.</h3>
                  <p className="completion-note">Thanks for trusting us with the next chapter. A Northstar partner will review your details and reach out at <strong>{form.email || 'your email address'}</strong> within two working days.</p>
                  <button className="reset-button" type="button" onClick={resetFlow} data-testid="button-start-over">Start another conversation</button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="quote-band reveal" aria-label="Northstar perspective">
        <blockquote className="quote">“The best people do not need to be sold a role. They need to see the possibility clearly.”</blockquote>
        <p className="quote-aside">Northstar Talent works at the intersection of ambition and timing. When both are right, the result is bigger than a placement.</p>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <a className="brand-lockup" href="#top" data-testid="link-footer-brand"><span className="brand-mark">N</span><span className="brand-type">NORTHSTAR / TALENT</span></a>
            <p className="footer-tagline">Independent search for the people building what comes next.</p>
          </div>
          <div className="footer-column">
            <h3 className="eyebrow">Explore</h3>
            <a href="#companies" data-testid="link-footer-companies">For companies <ArrowUpRight size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} aria-hidden="true" /></a>
            <a href="#pipeline" data-testid="link-footer-pipeline">Our pipeline <ArrowUpRight size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} aria-hidden="true" /></a>
            <button type="button" onClick={scrollToOnboarding} data-testid="button-footer-connect">Connect talent <ArrowUpRight size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} aria-hidden="true" /></button>
          </div>
          <div className="footer-column">
            <h3 className="eyebrow">Contact</h3>
            <a href="mailto:hello@northstartalent.co" data-testid="link-footer-email">hello@northstartalent.co</a>
            <a href="tel:+12125550184" data-testid="link-footer-phone">+1 212 555 0184</a>
            <span style={{ display: 'block', marginTop: '1.3rem', color: '#8997ad', fontSize: '0.78rem' }}>New York · London · Remote</span>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2024 Northstar Talent. All rights reserved.</span><span className="mono">N / 01—24</span></div>
      </footer>
    </main>
  );
}

export default App;
