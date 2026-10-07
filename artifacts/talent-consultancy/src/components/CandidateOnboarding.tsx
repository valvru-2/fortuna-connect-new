import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, UploadCloud, X } from 'lucide-react';
import type { Language, Translations } from '../content';

type Values = { role: string; email: string; cv: File | null };
type ErrorKey = keyof Translations['candidate']['errors'];
const sampleNames: Record<Language, string> = { ES: 'Lucía Fernández', EN: 'Lucia Fernandez', PT: 'Lucía Fernández' };
const sampleSkills: Record<Language, string[]> = { ES: ['Estrategia', 'Análisis', 'Liderazgo'], EN: ['Strategy', 'Analysis', 'Leadership'], PT: ['Estratégia', 'Análise', 'Liderança'] };
function readableSize(bytes: number) { return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`; }

export default function CandidateOnboarding({ t, language }: { t: Translations; language: Language }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Values>({ role: '', email: '', cv: null });
  const [error, setError] = useState<ErrorKey | null>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const simulationTimer = useRef<number | null>(null);
  const chooseFile = () => fileRef.current?.click();
  const selectFile = (file?: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setError('fileSize'); return; }
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) { setError('fileType'); return; }
    setForm((v) => ({ ...v, cv: file })); setError(null);
  };
  const fileChanged = (event: ChangeEvent<HTMLInputElement>) => { selectFile(event.target.files?.[0]); event.target.value = ''; };
  const dropped = (event: DragEvent<HTMLLabelElement>) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files?.[0]); };
  const startSimulation = () => {
    setPreview(true); setExtracting(true);
    simulationTimer.current = window.setTimeout(() => {
      setForm((v) => ({ ...v, role: v.role || t.candidate.simulationRole }));
      setExtracting(false);
      setStep(1);
      simulationTimer.current = null;
    }, 1100);
  };
  const startManual = () => {
    if (simulationTimer.current !== null) window.clearTimeout(simulationTimer.current);
    simulationTimer.current = null;
    setExtracting(false);
    setPreview(false);
    setStep(1);
  };
  useEffect(() => () => {
    if (simulationTimer.current !== null) window.clearTimeout(simulationTimer.current);
  }, []);
  const goNext = () => {
    if (step === 1 && form.role.trim().length < 2) { setError('roleRequired'); return; }
    if (step === 2 && !form.cv) { setError('cvRequired'); return; }
    if (step === 3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('invalidEmail'); return; }
    setError(null); setStep((v) => v + 1);
  };
  const reset = () => { setStep(0); setForm({ role: '', email: '', cv: null }); setError(null); setPreview(false); };
  const back = (to: number) => { setError(null); setStep(to); };
  const stepNames = [t.candidate.startTitle, t.candidate.roleTitle, t.candidate.cvTitle, t.candidate.emailTitle, t.candidate.reviewTitle];
  return <section className="section onboarding" id="candidate" aria-labelledby="candidate-title">
    <div className="section-grid">
      <div className="reveal"><div className="eyebrow section-index">{t.candidate.eyebrow}</div><h2 className="display section-heading" id="candidate-title">{t.candidate.title}</h2><p className="section-copy">{t.candidate.intro}</p></div>
      <div className="onboarding-panel reveal" aria-live="polite"><div className="onboarding-panel-inner">
        <div className="onboarding-topline"><span className="eyebrow">{t.candidate.panelLabel}</span><span className="onboarding-step-count">{step < 5 ? `0${step + 1} / 05` : t.candidate.completeLabel}</span></div>
        {step < 5 && <div className="progress-track" role="progressbar" aria-label={t.candidate.progressLabel} aria-valuemin={1} aria-valuemax={5} aria-valuenow={step + 1}><div className="progress-value" style={{ width: `${((step + 1) / 5) * 100}%` }} /></div>}
        {step === 0 && <><h3 id="onboarding-title">{t.candidate.startTitle}</h3><p className="question-copy">{t.candidate.startBody}</p>
          <button className="linkedin-button" type="button" onClick={startSimulation} disabled={extracting} data-testid="button-connect-linkedin"><span className="linkedin-button-main"><span className="linkedin-icon">in</span><span>{t.candidate.linkedin}</span></span><ArrowRight size={16} aria-hidden="true" /></button>
          {preview && <div className="simulation-card" data-testid="linkedin-simulation"><div className="simulation-heading"><span className="avatar-initials" aria-hidden="true">LF</span><div><strong>{sampleNames[language]}</strong><span>{t.candidate.simulationRole}</span></div><span className="simulation-tag">{t.candidate.simulationTitle}</span></div><p>{t.candidate.simulationNotice}</p><strong className="simulation-skills-label">{t.candidate.simulationSkillsLabel}</strong><div className="skill-list">{sampleSkills[language].map((skill) => <span key={skill}>{skill}</span>)}</div>{extracting && <div className="simulation-progress" aria-label={t.candidate.simulationTitle}><span /></div>}</div>}
          <div className="manual-divider"><span>{t.candidate.manualDivider}</span></div><button className="button-text" type="button" style={{ color: '#f3f6fb' }} onClick={startManual} data-testid="button-manual-path">{t.candidate.manual} <ArrowRight size={14} aria-hidden="true" /></button>
        </>}
        {step === 1 && <><h3>{stepNames[1]}</h3><p className="question-copy">{t.candidate.roleBody}</p><label className="input-label" htmlFor="role-input">{t.candidate.roleLabel}</label><input className="dark-input" id="role-input" value={form.role} onChange={(e) => { setForm((v) => ({ ...v, role: e.target.value })); setError(null); }} placeholder={t.candidate.rolePlaceholder} data-testid="input-role" autoComplete="organization-title" />{error && <p className="form-error" role="alert">{t.candidate.errors[error]}</p>}<div className="onboarding-actions"><button className="back-button" type="button" onClick={() => back(0)} data-testid="button-back-role"><ArrowLeft size={14} /> {t.candidate.back}</button><button className="button-primary" type="button" onClick={goNext} data-testid="button-next-role">{t.candidate.next} <ArrowRight size={16} /></button></div></>}
        {step === 2 && <><h3>{stepNames[2]}</h3><p className="question-copy">{t.candidate.cvBody}</p><label className={`drop-zone ${dragging ? 'is-dragging' : ''}`} htmlFor="cv-input" onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={dropped} data-testid="dropzone-cv"><UploadCloud size={24} aria-hidden="true" /><span className="drop-zone-copy"><strong>{t.candidate.cvChoose}</strong><span>{t.candidate.cvConfidential}</span></span><input className="file-input-hidden" id="cv-input" ref={fileRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={fileChanged} data-testid="input-cv" /></label>
          {form.cv && <div className="file-chip" data-testid="file-chip"><div className="file-chip-icon">CV</div><div className="file-chip-details"><strong title={form.cv.name}>{form.cv.name}</strong><span>{t.candidate.fileSizeLabel}: {readableSize(form.cv.size)}</span></div><button type="button" className="file-action" onClick={() => { setForm((v) => ({ ...v, cv: null })); setError(null); }} data-testid="button-remove-cv" aria-label={`${t.candidate.removeFile}: ${form.cv.name}`}><X size={14} />{t.candidate.removeFile}</button><button type="button" className="file-action" onClick={chooseFile} data-testid="button-replace-cv">{t.candidate.replaceFile}</button></div>}
          {error && <p className="form-error" role="alert">{t.candidate.errors[error]}</p>}<div className="onboarding-actions"><button className="back-button" type="button" onClick={() => back(1)} data-testid="button-back-cv"><ArrowLeft size={14} /> {t.candidate.back}</button><button className="button-primary" type="button" onClick={goNext} data-testid="button-next-cv">{t.candidate.next} <ArrowRight size={16} /></button></div></>}
        {step === 3 && <><h3>{stepNames[3]}</h3><p className="question-copy">{t.candidate.emailBody}</p><label className="input-label" htmlFor="email-input">{t.candidate.emailLabel}</label><input className="dark-input" id="email-input" type="email" value={form.email} onChange={(e) => { setForm((v) => ({ ...v, email: e.target.value })); setError(null); }} placeholder={t.candidate.emailPlaceholder} data-testid="input-email" autoComplete="email" />{error && <p className="form-error" role="alert">{t.candidate.errors[error]}</p>}<div className="onboarding-actions"><button className="back-button" type="button" onClick={() => back(2)} data-testid="button-back-email"><ArrowLeft size={14} /> {t.candidate.back}</button><button className="button-primary" type="button" onClick={goNext} data-testid="button-review-candidate">{t.candidate.next} <ArrowRight size={16} /></button></div></>}
        {step === 4 && <><h3>{t.candidate.reviewTitle}</h3><p className="question-copy">{t.candidate.reviewIntro}</p><div className="review-list"><div><span>{t.candidate.reviewRole}</span><strong>{form.role}</strong><button type="button" onClick={() => back(1)} data-testid="button-edit-role">{t.candidate.edit}</button></div><div><span>{t.candidate.reviewCv}</span><strong>{form.cv?.name} · {form.cv && readableSize(form.cv.size)}</strong><button type="button" onClick={() => back(2)} data-testid="button-edit-cv">{t.candidate.edit}</button></div><div><span>{t.candidate.reviewEmail}</span><strong>{form.email}</strong><button type="button" onClick={() => back(3)} data-testid="button-edit-email">{t.candidate.edit}</button></div></div><div className="onboarding-actions"><button className="back-button" type="button" onClick={() => back(3)} data-testid="button-back-review"><ArrowLeft size={14} /> {t.candidate.back}</button><button className="button-primary" type="button" onClick={() => setStep(5)} data-testid="button-submit-candidate">{t.candidate.reviewSubmit} <Check size={16} /></button></div></>}
        {step === 5 && <><div className="completion-mark"><Check size={25} aria-hidden="true" /></div><h3>{t.candidate.completeTitle}</h3><p className="completion-note">{t.candidate.localComplete}</p><button className="reset-button" type="button" onClick={reset} data-testid="button-start-over">{t.candidate.restart}</button></>}
      </div></div>
    </div>
  </section>;
}
