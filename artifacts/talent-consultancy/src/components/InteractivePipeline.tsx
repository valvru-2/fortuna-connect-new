import { useRef, type KeyboardEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Translations } from '../content';

export default function InteractivePipeline({ t, stage, setStage }: { t: Translations; stage: number; setStage: (stage: number) => void }) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const stages = t.pipeline.stages;
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = stages.length - 1;
    const next = event.key === 'ArrowRight' ? (index + 1) % stages.length : event.key === 'ArrowLeft' ? (index + last) % stages.length : event.key === 'Home' ? 0 : event.key === 'End' ? last : null;
    if (next !== null) { event.preventDefault(); setStage(next); refs.current[next]?.focus(); }
  };
  const current = stages[stage];
  return <section className="section pipeline" id="pipeline" aria-labelledby="pipeline-title">
    <div className="section-grid">
      <div className="pipeline-copy reveal"><div className="eyebrow section-index">{t.pipeline.eyebrow}</div><h2 className="display section-heading" id="pipeline-title">{t.pipeline.title}</h2><p className="section-copy">{t.pipeline.intro}</p><ul className="pipeline-principles">{t.pipeline.principles.map((principle) => <li key={principle}><span aria-hidden="true" />{principle}</li>)}</ul></div>
      <div className="pipeline-board reveal">
        <div className="pipeline-board-top"><div><span className="eyebrow">{t.pipeline.widgetLabel}</span><p>{t.pipeline.widgetCaption}</p></div><span className="pipeline-demo-badge">{t.pipeline.illustrative}</span></div>
        <div className="pipeline-tabs" role="tablist" aria-label={t.pipeline.tabsLabel}>{stages.map((item, index) => <button ref={(el) => { refs.current[index] = el; }} className={`pipeline-tab ${stage === index ? 'is-active' : ''}`} type="button" role="tab" id={`pipeline-tab-${index}`} aria-controls="pipeline-stage-panel" aria-selected={stage === index} tabIndex={stage === index ? 0 : -1} key={item.name} onClick={() => setStage(index)} onKeyDown={(event) => handleKey(event, index)}><span className="pipeline-tab-number">{String(index + 1).padStart(2, '0')}</span><span>{item.name}</span></button>)}</div>
        <div className="pipeline-profile"><div className="pipeline-monogram" aria-hidden="true">FC</div><div className="pipeline-profile-copy"><strong>{t.pipeline.profileLabel}</strong><span>{t.pipeline.profileDetail}</span></div><span className="pipeline-profile-status"><span aria-hidden="true" />{current.status}</span></div>
        <div className="pipeline-stage-panel" id="pipeline-stage-panel" role="tabpanel" aria-labelledby={`pipeline-tab-${stage}`} key={`${stage}-${current.title}`}>
          <div className="pipeline-stage-copy"><span className="eyebrow">{t.pipeline.stageProgress} {String(stage + 1).padStart(2, '0')} / 03</span><h3>{current.title}</h3><p>{current.body}</p></div><div className="pipeline-stage-metric" aria-hidden="true"><strong>{current.metric}</strong><span>{current.metricLabel}</span></div>
        </div>
        <div className="pipeline-details">
          <div><h4>{t.pipeline.slaLabel}</h4><p>{current.sla}</p></div>
          <div><h4>{t.pipeline.deliverablesLabel}</h4><ul>{current.deliverables.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><h4>{t.pipeline.methodsLabel}</h4><ul>{current.methods.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
        <p className="pipeline-timing-note">{t.pipeline.timingNote}</p>
        <div className="pipeline-board-bottom"><div className="pipeline-progress" role="progressbar" aria-label={t.pipeline.progressLabel} aria-valuemin={1} aria-valuemax={3} aria-valuenow={stage + 1}><span style={{ width: `${((stage + 1) / stages.length) * 100}%` }} /></div><button type="button" className="pipeline-next" onClick={() => setStage((stage + 1) % stages.length)}>{stage === stages.length - 1 ? t.pipeline.restart : t.pipeline.next}<ArrowRight size={15} aria-hidden="true" /></button></div>
      </div>
    </div>
  </section>;
}
